import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
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
  timeSegment: TimeSegment | null;
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

  // Ajouter une référence pour suivre l'état actuel
  const audioStateRef = useRef(audioState);

  // Mettre à jour la référence quand l'état change
  React.useEffect(() => {
    audioStateRef.current = audioState;
  }, [audioState]);


  const stopPlayback = useCallback(async () => {
    const currentState = audioStateRef.current;

    if (currentState.currentSound) {
      await currentState.currentSound.stopAsync();
      await currentState.currentSound.unloadAsync();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentVerseKey: null,
        currentSound: null,
        timeSegment: null,
        currentIndex: -1,
      }));
    }
  }, [audioState.currentSound]);


  const loadAndPlayVerse = useCallback(async (verseKey: string, audioUrl: string, playlist: VerseAudio[]) => {
    const timeSegment = parseTimeSegment(audioUrl);
    if (!timeSegment) {
      console.error('Invalid time segment in URL:', audioUrl);
      return;
    }

    const currentIndex = playlist.findIndex(v => v.verseKey === verseKey);
    try {
      // Vérifier si l'application est en premier plan
      if (AppState.currentState !== 'active') {
        console.warn('App is not active, cannot play audio');
        return;
      }

      const currentState = audioStateRef.current;
      let sound = currentState.currentSound;

      const isSameAudio = sound &&
        currentState.timeSegment?.baseUrl === timeSegment.baseUrl;

      if (isSameAudio && sound) {
        try {
          await sound.setPositionAsync(timeSegment.start);
          await sound.playAsync();
          console.log('Playing same audio:', verseKey, " / ", timeSegment);
          setAudioState(prev => ({
            ...prev,
            isPlaying: true,
            currentVerseKey: verseKey,
            timeSegment: timeSegment,
            playlist,
            currentIndex,
          }));
        } catch (error) {
          console.error('Error playing same audio:', error);
          await stopPlayback();
        }
      } else {
        if (sound) {
          await sound.unloadAsync();
        }

        try {
          console.log('Loading new audio:', verseKey, " / ", timeSegment);
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: timeSegment.baseUrl },
            { shouldPlay: true, positionMillis: timeSegment.start }
          );

          sound = newSound;

          sound.setOnPlaybackStatusUpdate(async (status) => {
            if (!status.isLoaded) return;

            const currentState = audioStateRef.current;
            if (currentState && currentState.timeSegment)
              console.log('Playback status:', status.positionMillis, ' / ', currentState.timeSegment.end);
            // || status.didJustFinish
            if ((currentState.timeSegment && status.positionMillis >= currentState.timeSegment.end)) {
              const nextIndex = currentState.currentIndex + 1;
              console.log('Next index:', nextIndex, " / ", currentState.playlist.length);
              if (nextIndex < currentState.playlist.length) {
                const nextVerse = currentState.playlist[nextIndex];
                // Ajouter un délai court avant de charger le prochain verset
                setTimeout(async () => {
                  try {
                    if (AppState.currentState === 'active') {
                      const timeSegment = parseTimeSegment(nextVerse.audioUrl);
                      if (!timeSegment) {
                        throw new Error('Invalid time segment');
                      }
                      setAudioState(prev => ({
                        ...prev,
                        isPlaying: true,
                        currentVerseKey: nextVerse.verseKey,
                        timeSegment: timeSegment,
                        currentIndex: nextIndex,
                      }));
                      // await loadAndPlayVerse(
                      //   nextVerse.verseKey,
                      //   nextVerse.audioUrl,
                      //   currentState.playlist
                      // );
                    }
                  } catch (error) {
                    console.error('Error loading next verse:', error);
                    await stopPlayback();
                  }
                }, 100);
              } else {
                await stopPlayback();
              }
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
          console.error('Error creating new audio:', error);
          await stopPlayback();
        }
      }
    } catch (error) {
      console.error('Error in loadAndPlayVerse:', error);
      await stopPlayback();
    }
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
