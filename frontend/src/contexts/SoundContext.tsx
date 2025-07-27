// src/contexts/soundcontext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: 'click' | 'hover' | 'success' | 'error') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('soundMuted', isMuted.toString());
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playSound = (type: 'click' | 'hover' | 'success' | 'error') => {
    if (isMuted) return;

    const soundMap: Record<string, string> = {
      click: '/sound/click.mp3',
      hover: '/sound/hover.mp3',
      success: '/sound/success.mp3',
      error: '/sound/error.mp3',
    };

    const audio = new Audio(soundMap[type]);
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.warn(`Cannot play sound (${type}):`, err);
    });
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
};
