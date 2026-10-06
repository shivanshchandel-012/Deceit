'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClientGameState } from '@deceit/game-types';
import { Users, Bot, Play, Settings2, Plus, X, Copy, Check, Crown } from 'lucide-react';
import { PlayerCard } from '@/components/ui/PlayerCard';

interface LobbyViewProps {
  gameState: ClientGameState;
  myPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
  onAddBot: (personality: 'balanced' | 'aggressive' | 'quiet' | 'analytical' | 'bluffer') => void;
  onRemoveBot: (botId: string) => void;
  onUpdateSettings: (s: any) => void;
}

const BOT_PERSONALITIES = [
  { id: 'balanced', label: '⚖️ Balanced', desc: 'Well-rounded play style' },
  { id: 'aggressive', label: '🔥 Aggressive', desc: 'Goes on the offensive' },
  { id: 'quiet', label: '🤫 Quiet', desc: 'Says little, watches more' },
  { id: 'analytical', label: '🧠 Analytical', desc: 'Logic-driven decisions' },
  { id: 'bluffer', label: '🎭 Bluffer', desc: 'Master of deception' },
] as const;

export function LobbyView({ gameState, myPlayerId, isHost, onStartGame, onAddBot, onRemoveBot }: LobbyViewProps) {
  const [copied, setCopied] = useState(false);
  const [showBotMenu, setShowBotMenu] = useState(false);
  const canStart = gameState.players.length >= 3;

  const copyInvite = () => {
    const text = `Join my DECEIT game! Room code: ${gameState.roomCode}\n${window.location.origin}?join=${gameState.roomCode}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Room Header */}
      <div
        className="flex-shrink-0 px-4 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label-upper mb-0.5">Room Code</p>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-3xl text-white tracking-widest">
                {gameState.roomCode}
              </span>
              <button
                onClick={copyInvite}
                className="p-2 rounded-xl transition-all active:scale-95"
                style={{
                  background: copied ? 'rgba(78,205,196,0.15)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${copied ? 'rgba(78,205,196,0.4)' : 'rgba(255,255,255,0.1)'}`,
                }}
                title="Copy invite link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#4ECDC4]" />
                ) : (
                  <Copy className="w-4 h-4 text-white/40" />
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
            <div
              className="px-3 py-1.5 rounded-xl text-sm font-bold"
              style={{
                background: canStart ? 'rgba(78,205,196,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${canStart ? 'rgba(78,205,196,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: canStart ? '#4ECDC4' : 'rgba(255,255,255,0.3)',
              }}
            >
              {gameState.players.length}/{gameState.settings.maxPlayers} Players
            </div>
            {!canStart && (
              <p className="text-[10px] text-white/25 mt-1">Need {3 - gameState.players.length} more</p>
            )}
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        <div className="flex items-center justify-between mb-3">
          <span className="label-upper flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Players
          </span>
          {isHost && (
            <div className="relative">
              <button
                onClick={() => setShowBotMenu((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                <Bot className="w-3.5 h-3.5" />
                Add AI Bot
                <Plus className="w-3 h-3" />
              </button>

              {showBotMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-full mt-1.5 z-20 rounded-2xl p-2 min-w-[180px]"
                  style={{
                    background: 'rgba(13,13,13,0.98)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {BOT_PERSONALITIES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onAddBot(p.id);
                        setShowBotMenu(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all hover:bg-white/5"
                    >
                      <div className="font-bold text-white">{p.label}</div>
                      <div className="text-white/30 text-[10px] mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Player list */}
        <div className="space-y-2">
          {gameState.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              variant="compact"
              isMe={player.id === myPlayerId}
              onRemove={
                isHost && player.isBot
                  ? () => onRemoveBot(player.id)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Settings summary (non-host) */}
        <div
          className="mt-4 p-4 rounded-2xl"
          style={{ background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="label-upper mb-3 flex items-center gap-1.5">
            <Settings2 className="w-3 h-3" />
            Game Settings
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Imposters', value: gameState.settings.imposterCount },
              { label: 'Hint Mode', value: gameState.settings.imposterHintMode.replace('_AND_', '+') },
              { label: 'Clue Timer', value: `${gameState.settings.clueTimerSeconds}s` },
              { label: 'Voting', value: `${gameState.settings.votingTimerSeconds}s` },
            ].map((s) => (
              <div key={s.label}>
                <span className="text-white/25 block">{s.label}</span>
                <span className="text-white font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      {isHost && (
        <div
          className="flex-shrink-0 px-4 py-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className="btn-primary w-full py-4 text-base"
          >
            <Play className="w-5 h-5 fill-current" />
            {canStart ? 'Launch Match' : `Need ${3 - gameState.players.length} more player${3 - gameState.players.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {!isHost && (
        <div
          className="flex-shrink-0 px-4 py-3 text-center text-sm text-white/30"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Crown className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
          Waiting for the host to start…
        </div>
      )}
    </div>
  );
}
