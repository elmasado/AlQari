import React, { createContext, useContext, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { parseTimeSegment } from '../utils/audioUtils';

interface AudioState {
  isPlaying: boolean;
  currentVerseKey: string | null;
  currentSound: Audio.Sound | null;
  timeSegment: { start: number; end: number } | null;
}

interface AudioContextType extends AudioState {
  loadAndPlayVerse: (verseKey: string, audioUrl: string) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
  stopPlayback: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentVerseKey: null,
    currentSound: null,
    timeSegment: null,
  });

  const stopPlayback = useCallback(async () => {
    if (audioState.currentSound) {
      await audioState.currentSound.stopAsync();
      await audioState.currentSound.unloadAsync();
    }
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      currentSound: null,
      currentVerseKey: null,
      timeSegment: null,
    }));
  }, [audioState.currentSound]);

  const loadAndPlayVerse = useCallback(async (verseKey: string, audioUrl: string) => {
    // Stop current playback if any
    await stopPlayback();

    const timeSegment = parseTimeSegment(audioUrl);
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { 
        shouldPlay: true,
        positionMillis: timeSegment?.start || 0,
      }
    );

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      if (status.didJustFinish || 
          (timeSegment?.end && status.positionMillis >= timeSegment.end)) {
        stopPlayback();
      }
    });

    setAudioState({
      isPlaying: true,
      currentVerseKey: verseKey,
      currentSound: newSound,
      timeSegment,
    });
  }, [stopPlayback]);

  const pausePlayback = useCallback(async () => {
    if (audioState.currentSound) {
      await audioState.currentSound.pauseAsync();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [audioState.currentSound]);

  const resumePlayback = useCallback(async () => {
    if (audioState.currentSound) {
      await audioState.currentSound.playAsync();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [audioState.currentSound]);

  return (
    <AudioContext.Provider
      value={{
        ...audioState,
        loadAndPlayVerse,
        pausePlayback,
        resumePlayback,
        stopPlayback,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
