import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAudio } from '../contexts/AudioContext';

interface AudioPlayerProps {
  audioUrl: string;
  verseKey: string;
  playlist: Array<{ verseKey: string; audioUrl: string; }>;
}

export default function AudioPlayer({ audioUrl, verseKey, playlist }: AudioPlayerProps) {
  const tintColor = useThemeColor({}, 'tint');
  const { 
    isPlaying, 
    currentVerseKey,
    loadAndPlayVerse,
    pausePlayback,
    resumePlayback 
  } = useAudio();

  const isCurrentVerse = currentVerseKey === verseKey;

  const handlePress = useCallback(async () => {
    try {
      if (!isCurrentVerse) {
        if (!audioUrl.includes('#t=')) {
          console.error('Invalid audio URL format:', audioUrl);
          return;
        }
        await loadAndPlayVerse(verseKey, audioUrl, playlist);
      } else if (isPlaying) {
        await pausePlayback();
      } else {
        await resumePlayback();
      }
    } catch (error) {
      console.error('Error handling audio playback:', error);
    }
  }, [isCurrentVerse, isPlaying, audioUrl, verseKey, playlist, loadAndPlayVerse, pausePlayback, resumePlayback]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <FontAwesome
        name={isCurrentVerse && isPlaying ? 'pause' : 'play'}
        size={20}
        color={tintColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});
