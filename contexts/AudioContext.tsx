import React, { createContext, useContext, useState } from 'react';
import { Audio } from 'expo-av';

interface AudioContextType {
  activeVerse: string | null;
  activeSound: Audio.Sound | null;
  setActiveVerse: (verseId: string | null) => void;
  setActiveSound: (sound: Audio.Sound | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeVerse, setActiveVerse] = useState<string | null>(null);
  const [activeSound, setActiveSound] = useState<Audio.Sound | null>(null);

  return (
    <AudioContext.Provider
      value={{
        activeVerse,
        activeSound,
        setActiveVerse,
        setActiveSound,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
