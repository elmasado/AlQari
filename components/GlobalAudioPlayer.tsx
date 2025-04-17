import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAudio } from '../contexts/AudioContext';

interface GlobalAudioPlayerProps {
  playlist: Array<{ verseKey: string; audioUrl: string; }>;
}

export default function GlobalAudioPlayer({ playlist }: GlobalAudioPlayerProps) {
  const tintColor = useThemeColor({}, 'tint');
  const { 
    isPlaying, 
    currentVerseKey,
    loadAndPlayVerse,
    pausePlayback,
    resumePlayback 
  } = useAudio();

  const handlePress = async () => {
    try {
      if (!currentVerseKey) {
        // Start playing from the first verse
        const firstVerse = playlist[0];
        await loadAndPlayVerse(firstVerse.verseKey, firstVerse.audioUrl, playlist);
      } else if (isPlaying) {
        await pausePlayback();
      } else {
        await resumePlayback();
      }
    } catch (error) {
      console.error('Error handling global audio playback:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <FontAwesome
        name={isPlaying ? 'pause' : 'play'}
        size={24}
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
