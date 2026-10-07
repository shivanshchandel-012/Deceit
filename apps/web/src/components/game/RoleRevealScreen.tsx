'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientGameState } from '@deceit/game-types';
import { Eye } from 'lucide-react';

interface RoleRevealScreenProps {
  gameState: ClientGameState;
}

export function RoleRevealScreen({ gameState }: RoleRevealScreenProps) {
  const { myInfo } = gameState;
  const isImposter = myInfo.role === 'IMPOSTER';
  const [step, setStep] = useState<'fade' | 'card' | 'done'>('fade');

  useEffect(() => {
    const t1 = setTimeout(() => setStep('card'), 600);
    const t2 = setTimeout(() => setStep('done'), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-full px-6 py-8 relative overflow-hidden"
    >
      {/* Role Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: step !== 'fade' ? 1 : 0, y: step !== 'fade' ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="label-upper mb-6 tracking-[0.3em]"
        style={{ color: isImposter ? '#E50914' : 'rgba(255,255,255,0.4)' }}
      >
        Your Secret Role
      </motion.div>

      {/* Main card */}
      <AnimatePresence>
        {step !== 'fade' && (
          <motion.div
            initial={{ opacity: 0, rotateY: -90, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full max-w-sm relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card body */}
            <div
              className="relative rounded-3xl p-8 text-center overflow-hidden"
              style={{
                background: isImposter
                  ? 'linear-gradient(145deg, rgba(30,8,8,0.98), rgba(20,5,5,0.98))'
                  : 'linear-gradient(145deg, rgba(18,18,18,0.98), rgba(12,12,12,0.98))',
                border: `1px solid ${isImposter ? 'rgba(229,9,20,0.5)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isImposter
                  ? '0 24px 60px rgba(229,9,20,0.14), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >

              {/* Role badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-6"
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: isImposter
                      ? 'linear-gradient(135deg, rgba(229,9,20,0.3), rgba(139,0,0,0.2))'
                      : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${isImposter ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.15)'}`,
                    boxShadow: isImposter ? '0 0 30px rgba(229,9,20,0.4)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 36 }}>{isImposter ? '🎭' : '🕵️'}</span>
                </div>

                <h1
                  className="font-display font-black leading-none"
                  style={{
                    fontSize: 'clamp(36px, 12vw, 56px)',
                    color: isImposter ? '#E50914' : 'white',
                    textShadow: isImposter ? '0 0 40px rgba(229,9,20,0.7)' : 'none',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {myInfo.role}
                </h1>
              </motion.div>

              {/* Divider */}
              <div
                className="h-px w-2/3 mx-auto mb-6"
                style={{
                  background: isImposter
                    ? 'linear-gradient(90deg, transparent, rgba(229,9,20,0.5), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                }}
              />

              {/* Word / Category reveal */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {myInfo.secretWord ? (
                  <div className="space-y-1">
                    <p className="label-upper text-white/30">Secret Word</p>
                    <p
                      className="font-display font-black text-white font-mono"
                      style={{
                        fontSize: 'clamp(28px, 8vw, 40px)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {myInfo.secretWord}
                    </p>
                    <p className="text-white/35 text-sm mt-2">
                      Category: <span className="text-white/60 font-semibold">{myInfo.category}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="label-upper" style={{ color: 'rgba(229,9,20,0.7)' }}>
                      {myInfo.category ? 'Your Only Clue' : 'You Know Nothing'}
                    </p>
                    {myInfo.category && (
                      <p className="text-xl font-display font-bold text-white">
                        Category: {myInfo.category}
                      </p>
                    )}
                    {myInfo.hint && (
                      <p className="text-amber-400 text-sm font-medium">
                        Hint: "{myInfo.hint}"
                      </p>
                    )}
                    {!myInfo.category && (
                      <p className="text-white/30 text-sm">
                        Blend in. Observe carefully. Deceive everyone.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Instruction footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/25 text-xs mt-6 leading-relaxed"
              >
                {isImposter
                  ? 'Blend in with subtle clues. Deduce the secret word to win.'
                  : 'Give clues that prove you know the word — without revealing it to the Imposter.'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waiting indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/20"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
        <p className="text-white/25 text-xs">Clue phase starting soon…</p>
      </motion.div>
    </div>
  );
}
