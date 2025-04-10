import React, { createContext, useContext, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { parseTimeSegment, TimeSegment } from '../utils/audioUtils';

interface VerseAudio {
  verseKey: string;
  audioUrl: string;
}

interface AudioState {
  isPlaying: boolean;
  currentVerseKey: string | null;
  currentSound: Audio.Sound | null;
  timeSegment: { start: number; end: number } | null;
  playlist: VerseAudio[];
  currentIndex: number;
}

interface AudioContextType extends Omit<AudioState, 'playlist'> {
  loadAndPlayVerse: (verseKey: string, audioUrl: string, playlist: VerseAudio[]) => Promise<void>;
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
    playlist: [],
    currentIndex: -1,
  });

  const playNext = useCallback(async () => {
    const nextIndex = audioState.currentIndex + 1;
    if (nextIndex < audioState.playlist.length) {
      const nextVerse = audioState.playlist[nextIndex];
      await loadAndPlayVerse(nextVerse.verseKey, nextVerse.audioUrl, audioState.playlist);
    }
  }, [audioState.currentIndex, audioState.playlist]);

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
      currentIndex: -1,
    }));
  }, [audioState.currentSound]);

  const loadAndPlayVerse = useCallback(async (verseKey: string, audioUrl: string, playlist: VerseAudio[]) => {
    await stopPlayback();

    const currentIndex = playlist.findIndex(v => v.verseKey === verseKey);
    const timeSegment = parseTimeSegment(audioUrl);
    
    if (!timeSegment) {
      console.error('Invalid time segment in URL:', audioUrl);
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: timeSegment.baseUrl },
        { 
          shouldPlay: true,
          positionMillis: timeSegment.start,
        }
      );

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        // Vérifier si nous avons atteint la fin du segment
        if (status.positionMillis >= timeSegment.end) {
          playNext();
          return;
        }

        if (status.didJustFinish) {
          playNext();
        }
      });

      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        currentVerseKey: verseKey,
        currentSound: newSound,
        timeSegment,
        playlist,
        currentIndex,
      }));
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, [stopPlayback, playNext]);

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
        isPlaying: audioState.isPlaying,
        currentVerseKey: audioState.currentVerseKey,
        currentSound: audioState.currentSound,
        timeSegment: audioState.timeSegment,
        currentIndex: audioState.currentIndex,
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
