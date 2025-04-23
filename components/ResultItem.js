import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HTMLText } from './HTMLText';

export default function ResultItem({ verse, highlightedText }) {
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'borderColor');

  return (
    <View style={[styles.container, {
      backgroundColor: cardBackgroundColor,
      borderColor: borderColor,
      borderWidth: StyleSheet.hairlineWidth,
    }]}>
      <View style={styles.surahInfo}>
        <Text style={[styles.surahName, { color: secondaryTextColor }]}>
          سورة {verse.surahName}
        </Text>
        <Text style={[styles.verseNumber, { color: secondaryTextColor }]}>
          الآية {verse.verseNumber}
        </Text>
      </View>
      <View style={[styles.separator, { backgroundColor: borderColor }]} />
      <View style={styles.headerContainer}>
        <View style={styles.arabicContainer}>
          <HTMLText
            html={highlightedText}
            style={[styles.arabic, { color: textColor }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 8,
  },
  surahInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  surahName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  verseNumber: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
