'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, CheckCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface ErrorToastProps {
  message: string | null;
  type?: 'error' | 'success' | 'info';
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export function ErrorToast({ message, type = 'error', onDismiss, autoDismissMs = 4000 }: ErrorToastProps) {
  useEffect(() => {
    if (!message || !onDismiss) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [message, onDismiss, autoDismissMs]);

  const configs = {
    error: {
      bg: 'rgba(229,9,20,0.12)',
      border: 'rgba(229,9,20,0.4)',
      text: '#FF6B6B',
      icon: <ShieldAlert className="w-4 h-4 flex-shrink-0" style={{ color: '#FF6B6B' }} />,
    },
    success: {
      bg: 'rgba(78,205,196,0.1)',
      border: 'rgba(78,205,196,0.3)',
      text: '#4ECDC4',
      icon: <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#4ECDC4' }} />,
    },
    info: {
      bg: 'rgba(255,255,255,0.06)',
      border: 'rgba(255,255,255,0.15)',
      text: '#B3B3B3',
      icon: <ShieldAlert className="w-4 h-4 flex-shrink-0" style={{ color: '#B3B3B3' }} />,
    },
  };

  const cfg = configs[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            color: cfg.text,
          }}
        >
          {cfg.icon}
          <span className="flex-1">{message}</span>
          {onDismiss && (
            <button onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
