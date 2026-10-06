'use client';

import { ClientGameState } from '@deceit/game-types';
import { DeceitLogo } from '@/components/brand/DeceitLogo';
import { Timer } from '@/components/ui/Timer';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  gameState?: ClientGameState | null;
  phase?: string;
}

function phaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    LOBBY: 'Lobby',
    STARTING: 'Starting',
    WORD_ASSIGNMENT: 'Assigning',
    ROLE_REVEAL: 'Role Reveal',
    CLUE_PHASE: 'Clue Phase',
    DISCUSSION: 'Discussion',
    VOTING: 'Voting',
    VOTE_RESULT: 'Vote Result',
    IMPOSTER_GUESS: 'Final Guess',
    ROUND_RESULT: 'Round Over',
    NEXT_ROUND: 'Next Round',
    GAME_RESULT: 'Game Over',
  };
  return labels[phase] || phase;
}

export function TopBar({ gameState }: TopBarProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    if (!gameState?.roomCode) return;
    navigator.clipboard.writeText(gameState.roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 safe-top"
      style={{
        height: 'var(--topbar-height)',
        background: 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left: Logo */}
      <DeceitLogo size="sm" />

      {/* Center: Room code (only when in a game) */}
      {gameState?.roomCode && (
        <button
          onClick={copyRoomCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95"
          style={{
            background: 'rgba(21,21,21,0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          title="Copy room code"
        >
          <span className="font-mono font-black text-sm text-white tracking-widest">{gameState.roomCode}</span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#4ECDC4]" />
          ) : (
            <Copy className="w-3 h-3 text-white/30" />
          )}
        </button>
      )}

      {/* Right: Phase + Timer */}
      <div className="flex items-center gap-2.5">
        {gameState && (
          <>
            <span
              className="text-[11px] font-bold uppercase tracking-wider hidden sm:block"
              style={{
                color: gameState.phase === 'VOTING' || gameState.phase === 'IMPOSTER_GUESS'
                  ? '#E50914'
                  : 'rgba(255,255,255,0.5)',
              }}
            >
              {phaseLabel(gameState.phase)}
            </span>
            <Timer
              endsAt={gameState.phaseEndTime}
              durationSeconds={gameState.phaseDurationSeconds}
              size={36}
            />
          </>
        )}
        {!gameState && (
          <div className="flex items-center gap-1.5">
            <div className="dot-live" />
            <span className="text-[11px] text-white/30 font-medium hidden sm:block">Live</span>
          </div>
        )}
      </div>
    </header>
  );
}
