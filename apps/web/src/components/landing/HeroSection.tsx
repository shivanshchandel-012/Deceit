'use client';

import { motion } from 'framer-motion';
import { Play, Smartphone, BookOpen, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'PLAY', label: 'Online Game', icon: Play },
  { id: 'LOCAL', label: 'Pass & Play', icon: Smartphone },
  { id: 'PRESETS', label: 'Presets', icon: Sparkles },
  { id: 'RULES', label: 'How to Play', icon: BookOpen },
];

// Floating particle for background
function Particle({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full opacity-0"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(229,9,20,0.6), transparent)`,
      }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.2, 0.5],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

const particles = [
  { x: '15%', y: '30%', delay: 0, size: 4 },
  { x: '75%', y: '20%', delay: 0.8, size: 3 },
  { x: '45%', y: '70%', delay: 1.5, size: 5 },
  { x: '85%', y: '55%', delay: 0.3, size: 3 },
  { x: '25%', y: '65%', delay: 2.1, size: 4 },
  { x: '60%', y: '85%', delay: 1.0, size: 3 },
  { x: '10%', y: '85%', delay: 0.5, size: 4 },
  { x: '90%', y: '30%', delay: 1.8, size: 3 },
];

export function HeroSection({ activeTab, onTabChange }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden text-center px-4 pt-8 pb-6">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      {/* Big red glow behind heading */}
      <div
        className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% -20%, rgba(229,9,20,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        <p className="label-upper mb-3 tracking-[0.3em]">Secret Word · Imposter Game</p>
        <h1
          className="font-display font-black leading-[0.9] mb-4"
          style={{ fontSize: 'clamp(56px, 18vw, 120px)' }}
        >
          <span className="text-gradient">DECEIT</span>
        </h1>
        <p className="text-white/50 font-medium text-base sm:text-lg max-w-xs mx-auto leading-relaxed">
          One word. One imposter.{' '}
          <span className="text-white/80">Everyone is watching.</span>
        </p>
      </motion.div>

      {/* Stats pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-center gap-3 mt-6 mb-8 flex-wrap"
      >
        {[
          { label: '3–12 Players', accent: false },
          { label: '🔴 Live', accent: true },
          { label: 'Free to Play', accent: false },
        ].map((pill) => (
          <div
            key={pill.label}
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: pill.accent ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${pill.accent ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: pill.accent ? '#FF6B6B' : 'rgba(255,255,255,0.6)',
            }}
          >
            {pill.label}
          </div>
        ))}
      </motion.div>

      {/* Tab navigation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="flex items-center justify-center gap-1.5 p-1 rounded-2xl max-w-sm mx-auto"
        style={{ background: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200"
              style={{
                background: isActive ? '#E50914' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.35)',
                boxShadow: isActive ? '0 2px 12px rgba(229,9,20,0.4)' : 'none',
              }}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:block">{tab.label}</span>
              <span className="sm:hidden text-[9px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
