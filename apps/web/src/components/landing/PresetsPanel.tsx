'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Shuffle, Users } from 'lucide-react';
import { APP_CONFIG } from '@deceit/config';

const presetIcons: Record<string, React.ElementType> = {
  CLASSIC: Shield,
  HARDCORE: Zap,
  CHAOS: Shuffle,
  FRIENDS: Users,
};

const presetColors: Record<string, { accent: string; glow: string; bg: string }> = {
  CLASSIC: { accent: '#E50914', glow: 'rgba(229,9,20,0.3)', bg: 'rgba(229,9,20,0.06)' },
  HARDCORE: { accent: '#FF6B35', glow: 'rgba(255,107,53,0.3)', bg: 'rgba(255,107,53,0.06)' },
  CHAOS: { accent: '#F7C948', glow: 'rgba(247,201,72,0.3)', bg: 'rgba(247,201,72,0.06)' },
  FRIENDS: { accent: '#4ECDC4', glow: 'rgba(78,205,196,0.3)', bg: 'rgba(78,205,196,0.06)' },
};

export function PresetsPanel() {
  const presets = Object.values(APP_CONFIG.gamePresets);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4"
    >
      <p className="text-center text-white/30 text-xs mb-4">
        Choose a preset when creating a room to apply these settings automatically.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset, i) => {
          const Icon = presetIcons[preset.id] || Zap;
          const colors = presetColors[preset.id] || presetColors.CLASSIC;

          return (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl flex flex-col gap-3 transition-all duration-200 cursor-default"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.accent}33`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${colors.accent}18`,
                  border: `1px solid ${colors.accent}44`,
                  boxShadow: `0 0 16px ${colors.glow}`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: colors.accent }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-0.5">{preset.name}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{preset.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
