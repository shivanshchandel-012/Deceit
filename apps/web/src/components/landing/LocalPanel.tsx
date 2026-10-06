'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Plus, X, Play, Eye, EyeOff, RotateCcw, ChevronRight } from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';

const WORD_POOL = [
  { word: 'INTERSTELLAR', category: 'Movies', hint: 'Space time dilation' },
  { word: 'ALGORITHM', category: 'Technology', hint: 'Step by step instructions' },
  { word: 'PIZZA', category: 'Food', hint: 'Italian flatbread' },
  { word: 'GUITAR', category: 'Music', hint: 'Six-stringed instrument' },
  { word: 'VOLCANO', category: 'Nature', hint: 'Erupts lava' },
  { word: 'CHESS', category: 'Games', hint: 'Strategic board game' },
  { word: 'LIGHTHOUSE', category: 'Places', hint: 'Guides ships at sea' },
  { word: 'TELESCOPE', category: 'Science', hint: 'For stargazing' },
  { word: 'AVALANCHE', category: 'Nature', hint: 'Sliding snow' },
  { word: 'CARNIVAL', category: 'Events', hint: 'Rides and games' },
  { word: 'SUBMARINE', category: 'Vehicles', hint: 'Underwater vessel' },
  { word: 'CAMOUFLAGE', category: 'Military', hint: 'Blend in with surroundings' },
];

type LocalGamePhase = 'setup' | 'reveal' | 'playing';

interface LocalPanelProps {
  localPlayers: string[];
  onPlayersChange: (players: string[]) => void;
  errorMsg: string | null;
  onClearError: () => void;
}

export function LocalPanel({ localPlayers, onPlayersChange, errorMsg, onClearError }: LocalPanelProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [phase, setPhase] = useState<LocalGamePhase>('setup');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [imposterIndex, setImposterIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORD_POOL[0]);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (!name || localPlayers.includes(name)) return;
    onPlayersChange([...localPlayers, name]);
    setNewPlayerName('');
    inputRef.current?.focus();
  };

  const removePlayer = (i: number) => {
    onPlayersChange(localPlayers.filter((_, idx) => idx !== i));
  };

  const startGame = () => {
    if (localPlayers.length < 3) return;
    const word = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    const imp = Math.floor(Math.random() * localPlayers.length);
    setCurrentWord(word);
    setImposterIndex(imp);
    setCurrentPlayerIndex(0);
    setRevealed(false);
    setPhase('reveal');
  };

  const handleNext = () => {
    if (currentPlayerIndex + 1 < localPlayers.length) {
      setCurrentPlayerIndex((i) => i + 1);
      setRevealed(false);
    } else {
      setPhase('playing');
    }
  };

  const handleRestart = () => {
    setPhase('setup');
    setCurrentPlayerIndex(0);
    setRevealed(false);
  };

  const isImposter = currentPlayerIndex === imposterIndex;

  // ── PLAYING PHASE ──
  if (phase === 'playing') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto px-4 text-center"
      >
        <div
          className="p-8 rounded-3xl space-y-4"
          style={{
            background: 'rgba(13,13,13,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 60px rgba(229,9,20,0.08)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center mx-auto">
            <Play className="w-8 h-8 text-[#E50914]" />
          </div>
          <h2 className="font-display font-black text-3xl text-white">All Roles Seen!</h2>
          <p className="text-white/50 text-sm">
            Everyone knows their role. Start giving clues!
          </p>
          <div
            className="py-3 px-4 rounded-2xl text-xs"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-white/30">The game is afoot. Try to find the imposter!</span>
          </div>
          <button onClick={handleRestart} className="btn-ghost w-full">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      </motion.div>
    );
  }

  // ── REVEAL PHASE ──
  if (phase === 'reveal') {
    return (
      <motion.div
        key={`reveal-${currentPlayerIndex}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto px-4 space-y-4"
      >
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="label-upper">Player {currentPlayerIndex + 1} of {localPlayers.length}</span>
          <div className="flex gap-1">
            {localPlayers.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i === currentPlayerIndex ? 24 : 8,
                  background: i < currentPlayerIndex ? '#4ECDC4' : i === currentPlayerIndex ? '#E50914' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 text-center space-y-5"
          style={{
            background: revealed && isImposter
              ? 'rgba(229,9,20,0.1)'
              : revealed
              ? 'rgba(21,21,21,0.95)'
              : 'rgba(13,13,13,0.95)',
            border: revealed && isImposter
              ? '1px solid rgba(229,9,20,0.5)'
              : '1px solid rgba(255,255,255,0.08)',
            boxShadow: revealed && isImposter
              ? '0 0 40px rgba(229,9,20,0.2)'
              : 'none',
            minHeight: 280,
          }}
        >
          {/* Name */}
          <div>
            <p className="label-upper mb-1">Pass to</p>
            <h2 className="font-display font-black text-4xl text-white">
              {localPlayers[currentPlayerIndex]}
            </h2>
          </div>

          {!revealed ? (
            // Hidden state
            <div className="space-y-4">
              <div
                className="py-10 rounded-2xl flex flex-col items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <EyeOff className="w-8 h-8 text-white/20" />
                <p className="text-white/30 text-sm">Hidden — tap to reveal your role</p>
              </div>
              <button
                onClick={() => setRevealed(true)}
                className="btn-primary w-full py-4 text-base"
              >
                <Eye className="w-5 h-5" />
                Reveal My Role
              </button>
            </div>
          ) : (
            // Revealed state
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {isImposter ? (
                  <>
                    <div className="space-y-1">
                      <p className="label-upper text-[#E50914]">You are the</p>
                      <p
                        className="font-display font-black text-5xl"
                        style={{ color: '#E50914', textShadow: '0 0 30px rgba(229,9,20,0.6)' }}
                      >
                        IMPOSTER
                      </p>
                    </div>
                    <div
                      className="py-4 px-5 rounded-2xl space-y-1"
                      style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)' }}
                    >
                      <p className="text-white/50 text-xs">You do NOT know the secret word.</p>
                      <p className="text-white/80 text-xs font-semibold">
                        Category: <span className="text-amber-400">{currentWord.category}</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="label-upper text-white/40">Secret Word</p>
                      <p
                        className="font-display font-black text-5xl text-white font-mono tracking-wider"
                        style={{ letterSpacing: '0.05em' }}
                      >
                        {currentWord.word}
                      </p>
                      <p className="text-white/40 text-xs mt-2">Category: {currentWord.category}</p>
                    </div>
                    <div
                      className="py-3 px-4 rounded-2xl text-xs text-white/50"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      Give subtle clues — don't make it too obvious!
                    </div>
                  </>
                )}

                <button onClick={handleNext} className="btn-primary w-full py-3.5">
                  <span>
                    {currentPlayerIndex + 1 < localPlayers.length
                      ? 'Hide & Pass to Next'
                      : 'All Roles Seen — Start!'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Back */}
        <button onClick={handleRestart} className="btn-ghost w-full text-xs">
          ← Back to Setup
        </button>
      </motion.div>
    );
  }

  // ── SETUP PHASE ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4 space-y-4"
    >
      <ErrorToast message={errorMsg} type="error" onDismiss={onClearError} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)' }}
        >
          <Smartphone className="w-5 h-5 text-[#E50914]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-white">Pass & Play</h2>
          <p className="text-white/40 text-xs">All on one device · No WiFi needed</p>
        </div>
      </div>

      {/* Add player */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add player name..."
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          className="input-field flex-1"
          maxLength={20}
        />
        <button onClick={addPlayer} className="btn-primary px-4 py-0 rounded-xl flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Player chips */}
      <div
        className="rounded-2xl p-3 min-h-[120px]"
        style={{ background: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {localPlayers.length === 0 ? (
          <p className="text-center text-white/20 text-sm py-8">Add at least 3 players to start</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {localPlayers.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'rgba(21,21,21,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {name}
                <button
                  onClick={() => removePlayer(i)}
                  className="text-white/30 hover:text-red-400 transition-colors ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Player count hint */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-white/30">{localPlayers.length} players · need at least 3</span>
        <span className="text-white/20">Works offline ✓</span>
      </div>

      <button
        onClick={startGame}
        disabled={localPlayers.length < 3}
        className="btn-primary w-full py-4 text-base"
      >
        <Play className="w-5 h-5" />
        Start Local Match
      </button>
    </motion.div>
  );
}
