'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, LogIn, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { ErrorToast } from '@/components/ui/ErrorToast';
import { GameSettings } from '@deceit/game-types';

interface PlayPanelProps {
  username: string;
  onUsernameChange: (v: string) => void;
  roomCodeInput: string;
  onRoomCodeChange: (v: string) => void;
  settingsImposters: number;
  onImpostersChange: (v: number) => void;
  settingsHintMode: 'NONE' | 'CATEGORY' | 'CATEGORY_AND_HINT';
  onHintModeChange: (v: 'NONE' | 'CATEGORY' | 'CATEGORY_AND_HINT') => void;
  settingsPack: string;
  onPackChange: (v: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  errorMsg: string | null;
  onClearError: () => void;
}

const WORD_PACKS = [
  { id: 'pack-movies-cinema', label: '🎬 Movies & Cinema' },
  { id: 'pack-tech-digital', label: '💻 Tech & Digital' },
  { id: 'pack-food-cuisine', label: '🍕 Food & Cuisine' },
  { id: 'pack-sports-athletics', label: '⚽ Sports' },
  { id: 'pack-animals-nature', label: '🦁 Animals & Nature' },
  { id: 'pack-gaming-esports', label: '🎮 Gaming' },
  { id: 'pack-music-pop', label: '🎵 Music & Pop' },
  { id: 'pack-bollywood', label: '🎭 Bollywood' },
];

export function PlayPanel({
  username, onUsernameChange,
  roomCodeInput, onRoomCodeChange,
  settingsImposters, onImpostersChange,
  settingsHintMode, onHintModeChange,
  settingsPack, onPackChange,
  onCreateRoom, onJoinRoom,
  errorMsg, onClearError,
}: PlayPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [activeMode, setActiveMode] = useState<'create' | 'join'>('create');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (activeMode === 'create') onCreateRoom();
      else onJoinRoom();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto px-4"
    >
      {/* Error */}
      <div className="mb-3">
        <ErrorToast message={errorMsg} type="error" onDismiss={onClearError} />
      </div>

      {/* Name input */}
      <div className="mb-4">
        <label className="label-upper block mb-2">Your Codename</label>
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          maxLength={20}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field"
          autoFocus
        />
      </div>

      {/* Mode toggle */}
      <div
        className="flex p-1 rounded-2xl mb-4 gap-1"
        style={{ background: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {(['create', 'join'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: activeMode === mode ? '#E50914' : 'transparent',
              color: activeMode === mode ? 'white' : 'rgba(255,255,255,0.35)',
              boxShadow: activeMode === mode ? '0 2px 12px rgba(229,9,20,0.4)' : 'none',
            }}
          >
            {mode === 'create' ? '+ Create Room' : '→ Join Room'}
          </button>
        ))}
      </div>

      {/* Create mode */}
      <AnimatePresence mode="wait">
        {activeMode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Settings toggle */}
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white/80 transition-colors"
              style={{ background: 'rgba(21,21,21,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Game Settings
              </span>
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="p-4 rounded-2xl space-y-3"
                    style={{ background: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label-upper block mb-1.5">Imposters</label>
                        <select
                          value={settingsImposters}
                          onChange={(e) => onImpostersChange(Number(e.target.value))}
                          className="input-field text-sm py-2.5"
                        >
                          <option value={1}>1 Imposter</option>
                          <option value={2}>2 Imposters</option>
                          <option value={3}>3 Imposters</option>
                        </select>
                      </div>
                      <div>
                        <label className="label-upper block mb-1.5">Hint Mode</label>
                        <select
                          value={settingsHintMode}
                          onChange={(e) => onHintModeChange(e.target.value as any)}
                          className="input-field text-sm py-2.5"
                        >
                          <option value="NONE">No Hint</option>
                          <option value="CATEGORY">Category</option>
                          <option value="CATEGORY_AND_HINT">Cat + Hint</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label-upper block mb-1.5">Word Pack</label>
                      <select
                        value={settingsPack}
                        onChange={(e) => onPackChange(e.target.value)}
                        className="input-field text-sm py-2.5"
                      >
                        {WORD_PACKS.map((p) => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={onCreateRoom}
              className="btn-primary w-full py-4 text-base rounded-2xl"
            >
              <PlusCircle className="w-5 h-5" />
              Create Room
            </button>
          </motion.div>
        )}

        {/* Join mode */}
        {activeMode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div>
              <label className="label-upper block mb-2">Room Code</label>
              <input
                type="text"
                placeholder="A B C D E F"
                maxLength={8}
                value={roomCodeInput}
                onChange={(e) => onRoomCodeChange(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                className="input-code"
              />
            </div>

            <button
              onClick={onJoinRoom}
              className="btn-primary w-full py-4 text-base rounded-2xl"
            >
              <LogIn className="w-5 h-5" />
              Join Game
            </button>

            <p className="text-center text-xs text-white/25">
              Ask the host for the 6-letter room code
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
