'use client';

import { PlayerPublicInfo } from '@deceit/game-types';
import { Crown, Bot, Wifi, WifiOff, X } from 'lucide-react';

interface PlayerCardProps {
  player: PlayerPublicInfo;
  variant?: 'lobby' | 'vote' | 'result' | 'compact';
  isSelected?: boolean;
  isMe?: boolean;
  isEliminated?: boolean;
  revealedRole?: 'CIVILIAN' | 'IMPOSTER' | null;
  onClick?: () => void;
  onRemove?: () => void;
}

// Deterministic avatar color from player id
function avatarColor(id: string): string {
  const colors = ['#E50914', '#FF6B35', '#F7C948', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#98D8C8'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function avatarInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function PlayerCard({
  player,
  variant = 'lobby',
  isSelected = false,
  isMe = false,
  isEliminated = false,
  revealedRole = null,
  onClick,
  onRemove,
}: PlayerCardProps) {
  const color = avatarColor(player.id);
  const initials = avatarInitials(player.name);

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
          isEliminated ? 'opacity-40' : ''
        } ${onClick ? 'cursor-pointer' : ''}`}
        style={{ background: 'rgba(21,21,21,0.9)', border: `1px solid rgba(255,255,255,0.07)` }}
        onClick={onClick}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
          style={{ background: color, opacity: isEliminated ? 0.5 : 1 }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-white truncate">{player.name}</span>
            {isMe && <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-bold uppercase">You</span>}
            {player.isHost && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
          </div>
          {player.isBot && <span className="text-[10px] text-white/30 font-medium">AI Bot</span>}
        </div>
        {!player.isConnected && <WifiOff className="w-3 h-3 text-red-500 flex-shrink-0" />}
        {onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-0.5 text-white/20 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'vote') {
    return (
      <button
        onClick={onClick}
        disabled={isEliminated}
        className={`vote-card transition-all duration-150 ${isSelected ? 'card-selected' : ''} ${
          isEliminated ? 'opacity-30 cursor-not-allowed' : 'hover:border-white/20'
        }`}
      >
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-lg text-white relative"
          style={{
            background: `linear-gradient(135deg, ${color}cc, ${color}44)`,
            border: `2px solid ${color}66`,
            boxShadow: isSelected ? `0 0 20px ${color}66` : undefined,
          }}
        >
          {initials}
          {player.isHost && (
            <Crown className="absolute -top-1.5 -right-1.5 w-4 h-4 text-amber-400" />
          )}
          {player.isBot && (
            <Bot className="absolute -bottom-1 -right-1 w-3.5 h-3.5 text-white/50 bg-[#151515] rounded-full p-0.5" />
          )}
        </div>
        <span className="text-sm font-bold text-white leading-tight text-center line-clamp-1">{player.name}</span>
        {isMe && <span className="text-[9px] text-white/30 font-bold uppercase -mt-1">You</span>}
        {isSelected && (
          <div className="w-full h-0.5 rounded-full bg-[#E50914] mt-0.5" />
        )}
      </button>
    );
  }

  if (variant === 'result') {
    const roleColor = revealedRole === 'IMPOSTER' ? '#E50914' : '#4ECDC4';
    return (
      <div
        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${isEliminated ? 'opacity-60' : ''}`}
        style={{
          background: revealedRole === 'IMPOSTER' ? 'rgba(229,9,20,0.08)' : 'rgba(21,21,21,0.9)',
          border: `1px solid ${revealedRole ? roleColor + '44' : 'rgba(255,255,255,0.07)'}`,
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl text-white relative"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color}44)` }}
        >
          {initials}
          {player.isHost && <Crown className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-400" />}
        </div>
        <span className="text-xs font-bold text-white text-center">{player.name}</span>
        {revealedRole && (
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: roleColor }}>
            {revealedRole}
          </span>
        )}
        {isEliminated && <span className="text-[10px] text-red-400 font-bold">Eliminated</span>}
      </div>
    );
  }

  // Lobby variant (default)
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all ${
        isEliminated ? 'opacity-40' : ''
      }`}
      style={{ 
        background: 'rgba(21,21,21,0.9)', 
        border: isMe ? '1px solid rgba(229,9,20,0.3)' : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl text-white relative"
        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}44)` }}
      >
        {initials}
        {player.isHost && <Crown className="absolute -top-2 -right-2 w-4 h-4 text-amber-400" />}
        {player.isBot && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0D0D0D] flex items-center justify-center">
            <Bot className="w-2.5 h-2.5 text-white/50" />
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="text-xs font-bold text-white truncate max-w-[80px]">{player.name}</div>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          {isMe && <span className="text-[9px] text-[#E50914] font-bold uppercase">You</span>}
          {player.isBot && <span className="text-[9px] text-white/30 font-bold">AI</span>}
          {!player.isConnected && <WifiOff className="w-2.5 h-2.5 text-red-500" />}
        </div>
      </div>

      {/* Ready state dot */}
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: player.isReady ? '#4ECDC4' : 'rgba(255,255,255,0.15)' }}
      />

      {onRemove && player.isBot && (
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 p-0.5 text-white/20 hover:text-red-400 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
