'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Vote, Skull, Lightbulb } from 'lucide-react';

const rules = [
  {
    step: '01',
    icon: Lightbulb,
    title: 'Secret Word',
    color: '#F7C948',
    body: 'All players receive one secret word — except the Imposter, who only gets a category (or nothing at all).',
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Give Clues',
    color: '#4ECDC4',
    body: 'Each player gives a short, clever clue related to the word. Say enough to prove you know it, but not enough to expose it to the Imposter.',
  },
  {
    step: '03',
    icon: Vote,
    title: 'Discuss & Vote',
    color: '#E50914',
    body: 'Analyze every clue. Debate who was suspicious. Vote to eliminate the player you believe is the Imposter.',
  },
  {
    step: '04',
    icon: Skull,
    title: 'Final Steal',
    color: '#FF6B35',
    body: "If the Imposter is caught, they get one last chance — guess the secret word correctly to steal victory from the civilians!",
  },
];

export function RulesPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4 space-y-3"
    >
      <p className="text-center label-upper mb-4 tracking-[0.2em]">The 60-Second Rulebook</p>

      {rules.map((rule, i) => {
        const Icon = rule.icon;
        return (
          <motion.div
            key={rule.step}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 p-4 rounded-2xl"
            style={{
              background: 'rgba(13,13,13,0.9)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Step + Icon */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${rule.color}15`, border: `1px solid ${rule.color}33` }}
              >
                <Icon className="w-5 h-5" style={{ color: rule.color }} />
              </div>
              {i < rules.length - 1 && (
                <div
                  className="w-px flex-1"
                  style={{ background: 'rgba(255,255,255,0.06)', minHeight: 16 }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] font-bold" style={{ color: rule.color }}>
                  {rule.step}
                </span>
                <h3 className="font-display font-bold text-white text-sm">{rule.title}</h3>
              </div>
              <p className="text-white/45 text-xs leading-relaxed">{rule.body}</p>
            </div>
          </motion.div>
        );
      })}

      <div
        className="mt-4 p-4 rounded-2xl text-center"
        style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)' }}
      >
        <p className="text-white/60 text-xs leading-relaxed">
          <strong className="text-white">Civilian Win:</strong> Correctly eliminate the Imposter.
          <br />
          <strong className="text-[#E50914]">Imposter Win:</strong> Avoid elimination or guess the word.
        </p>
      </div>
    </motion.div>
  );
}
