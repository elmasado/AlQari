import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAudio } from '../contexts/AudioContext';

interface AudioPlayerProps {
  audioUrl: string;
  verseKey: string;
}

export default function AudioPlayer({ audioUrl, verseKey }: AudioPlayerProps) {
  const tintColor = useThemeColor({}, 'tint');
  const { 
    isPlaying, 
    currentVerseKey,
    loadAndPlayVerse,
    pausePlayback,
    resumePlayback 
  } = useAudio();

  const isCurrentVerse = currentVerseKey === verseKey;

  const handlePress = async () => {
    if (!isCurrentVerse) {
      await loadAndPlayVerse(verseKey, audioUrl);
    } else if (isPlaying) {
      await pausePlayback();
    } else {
      await resumePlayback();
    }
  };

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
