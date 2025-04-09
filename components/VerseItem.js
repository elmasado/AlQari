import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AudioPlayer from './AudioPlayer';

export default function VerseItem({ verse }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'borderColor');

  // Get the first available audio URL
  const audioUrl = verse.linkmp3?.[0]?.source || '';
  
  // Create a unique ID for the verse using verse_key or verse_number
  const verseId = verse.verse_key || `verse-${verse.verse_number}`;

  // Extract verse number (assuming it's part of verse_key like "1:1")
  const verseNumber = verse.verse_number || ''; // Fallback if verse_key format differs or verse_number exists

  return (
    <View style={[styles.container, { backgroundColor: cardBackgroundColor, borderColor }]}>
      <View style={styles.headerContainer}>
        {audioUrl && (
          <AudioPlayer
            audioUrl={audioUrl}
            verseId={verseId}
            isPlaying={isPlaying}
            onPlayPause={setIsPlaying}
          />
        )}
        <View style={styles.arabicContainer}>
          <Text style={[styles.arabic, { color: textColor }]}>
            {verse.verse}
            {verseNumber && (
              <Text style={[styles.verseNumber, { color: secondaryTextColor }]}>
                {' '}({verseNumber})
              </Text>
            )}
          </Text>
        </View>
      </View>
      <Text style={[styles.translation, { color: secondaryTextColor }]}>{verse.enTranslation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  arabicContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  arabic: {
    fontSize: 22,
    fontFamily: 'Roboto-Regular',
    textAlign: 'right',
    lineHeight: 32,
    flexShrink: 1,
  },
  verseNumber: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 5,
    lineHeight: 32,
  },
  translation: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    lineHeight: 22,
    textAlign: 'left',
  },
});
