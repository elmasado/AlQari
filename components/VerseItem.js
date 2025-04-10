import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AudioPlayer from './AudioPlayer';
import { useAudio } from '../contexts/AudioContext';

export default function VerseItem({ verse, playlist }) {
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'borderColor');
  const tintColor = useThemeColor({}, 'tint');

  const { isPlaying, currentVerseKey } = useAudio();
  console.log("isPlaying: ", isPlaying);
  console.log("currentVerseKey: ", currentVerseKey);
  // Get the first available audio URL
  const audioUrl = verse.linkmp3?.[1]?.source || '';
  const verseKey = verse.verse_key || `verse-${verse.verse_number}`;
  const isCurrentVerse = currentVerseKey === verseKey && isPlaying;

  return (
    <View style={[styles.container, { 
        backgroundColor: cardBackgroundColor, 
        borderColor: isCurrentVerse ? tintColor : borderColor,
        borderWidth: isCurrentVerse ? 2 : StyleSheet.hairlineWidth,
      }]}>
      <View style={styles.headerContainer}>
        {audioUrl && (
          <AudioPlayer
            audioUrl={audioUrl}
            verseKey={verseKey}
            playlist={playlist}
          />
        )}
        <View style={styles.arabicContainer}>
          <Text style={[styles.arabic, { color: textColor }]}>
            {verse.verse}
            {verse.verse_number && (
              <Text style={[styles.verseNumber, { color: secondaryTextColor }]}>
                {' '}({verse.verse_number})
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
