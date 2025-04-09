import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAudio } from '../contexts/AudioContext';

interface AudioPlayerProps {
  audioUrl: string;
  verseId: string;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
}

export default function AudioPlayer({ audioUrl, verseId, isPlaying, onPlayPause }: AudioPlayerProps) {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const tintColor = useThemeColor({}, 'tint');
  const { activeVerse, activeSound, setActiveVerse, setActiveSound } = useAudio();

  async function playSound() {
    // If there's an active sound and it's not this verse, stop it
    if (activeSound && activeVerse !== verseId) {
      await activeSound.stopAsync();
      setActiveSound(null);
      setActiveVerse(null);
    }

    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        onPlayPause(false);
        setActiveVerse(null);
        setActiveSound(null);
      } else {
        await sound.playAsync();
        onPlayPause(true);
        setActiveVerse(verseId);
        setActiveSound(sound);
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setActiveSound(newSound);
      setActiveVerse(verseId);
      onPlayPause(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          onPlayPause(false);
          setActiveVerse(null);
          setActiveSound(null);
        }
      });
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableOpacity onPress={playSound} style={styles.button}>
      <FontAwesome
        name={isPlaying ? 'pause' : 'play'}
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
