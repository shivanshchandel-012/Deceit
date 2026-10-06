'use client';

import { useEffect, useState, useRef } from 'react';

interface TimerProps {
  endsAt: number | null;
  durationSeconds: number;
  size?: number;
  showLabel?: boolean;
}

export function Timer({ endsAt, durationSeconds, size = 44, showLabel = false }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const animRef = useRef<number>();

  useEffect(() => {
    if (!endsAt || durationSeconds <= 0) return;

    const tick = () => {
      const now = Date.now();
      const secs = Math.max(0, Math.ceil((endsAt - now) / 1000));
      setRemaining(secs);
      if (secs > 0) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [endsAt, durationSeconds]);

  if (!endsAt || durationSeconds <= 0) return null;

  const progress = Math.max(0, Math.min(1, remaining / durationSeconds));
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const isUrgent = remaining <= 10;
  const strokeColor = isUrgent ? '#E50914' : '#FF1E2D';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="timer-ring">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s ease',
            filter: isUrgent ? `drop-shadow(0 0 6px ${strokeColor})` : undefined,
          }}
        />
      </svg>
      {/* Number */}
      <span
        className="absolute font-mono font-black text-white"
        style={{
          fontSize: size * 0.32,
          color: isUrgent ? '#FF1E2D' : 'white',
          textShadow: isUrgent ? '0 0 12px rgba(229,9,20,0.8)' : undefined,
        }}
      >
        {remaining}
      </span>
    </div>
  );
}
