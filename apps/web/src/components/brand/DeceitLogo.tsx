'use client';

import { motion } from 'framer-motion';

interface DeceitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 28, text: 'text-xl', tagline: 'text-[9px]', gap: 'gap-2' },
  md: { icon: 36, text: 'text-2xl', tagline: 'text-[10px]', gap: 'gap-2.5' },
  lg: { icon: 48, text: 'text-4xl', tagline: 'text-xs', gap: 'gap-3' },
  xl: { icon: 72, text: 'text-6xl', tagline: 'text-sm', gap: 'gap-4' },
};

export function DeceitLogo({ size = 'md', showTagline = false, animate = false, className = '' }: DeceitLogoProps) {
  const s = sizeMap[size];

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }
    : {};

  return (
    <Wrapper className={`flex items-center ${s.gap} ${className}`} {...(wrapperProps as any)}>
      {/* Icon */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-xl font-display font-black text-white overflow-hidden"
        style={{
          width: s.icon,
          height: s.icon,
          background: 'linear-gradient(135deg, #E50914 0%, #8B0000 100%)',
          boxShadow: '0 4px 16px rgba(229,9,20,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          fontSize: s.icon * 0.55,
        }}
      >
        {/* Gloss effect */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 opacity-20"
          style={{ background: 'linear-gradient(180deg, white, transparent)' }}
        />
        D
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-tight text-white ${s.text}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          DECEIT
        </span>
        {showTagline && (
          <span className={`${s.tagline} text-white/35 font-medium mt-0.5 tracking-wider uppercase`}>
            Think. Bluff. Deceive. Survive.
          </span>
        )}
      </div>
    </Wrapper>
  );
}
