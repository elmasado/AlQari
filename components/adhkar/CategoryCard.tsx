import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AudioPlayer from '../AudioPlayer';

interface CategoryCardProps {
  category: string;
  audioSource: string;
  onPress: () => void;
}

export default function CategoryCard({ category, audioSource, onPress }: CategoryCardProps) {
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'borderColor');

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBackgroundColor, borderColor }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{category}</Text>
        <AudioPlayer
          audioUrl={audioSource}
          verseKey={`category-${category}`}
          playlist={[{ verseKey: `category-${category}`, audioUrl: audioSource }]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    flex: 1,
    textAlign: 'right',
  },
});
