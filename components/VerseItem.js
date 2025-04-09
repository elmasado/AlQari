import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor'; // Using alias setup

export default function VerseItem({ verse }) {
  // Get theme colors
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'borderColor'); // Use border color for subtle separation

  // Extract verse number (assuming it's part of verse_key like "1:1")
  const verseNumber = verse.verse_number || ''; // Fallback if verse_key format differs or verse_number exists

  return (
    <View style={[styles.container, { backgroundColor: cardBackgroundColor, borderColor }]}>
      <View style={styles.arabicContainer}>
        {/* Combine Arabic text and verse number in one Text component using nesting */}
        <Text style={[styles.arabic, { color: textColor }]}>
          {verse.verse}          
          {verseNumber && (
            // Nested Text for the verse number part
            <Text style={[styles.verseNumber, { color: secondaryTextColor }]}>
              {' '} {/* Explicit space */}
              ({verseNumber})
            </Text>
          )}
        </Text>
      </View>
      <Text style={[styles.translation, { color: secondaryTextColor }]}>{ verse.enTranslation}</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, // Increased spacing between verses
    padding: 15, // Increased padding inside the verse item
    borderRadius: 8, // Rounded corners
    borderWidth: StyleSheet.hairlineWidth, // Subtle border
  },
  arabicContainer: {
    flexDirection: 'row-reverse', // Keep number to the left of Arabic text (in LTR context)
    alignItems: 'flex-start', // Align items at the top
    marginBottom: 8, // Space between Arabic and translation
  },
  arabic: {
    fontSize: 22, // Larger font size for Arabic
    fontFamily: 'Roboto-Regular', // Placeholder: Ideally use a dedicated Arabic font like Amiri or Noto Naskh Arabic
    textAlign: 'right',
    lineHeight: 32, // Improve line spacing for Arabic
    flexShrink: 1, // Allow text to wrap
  },
  verseNumber: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 5, // Space between Arabic text and number
    lineHeight: 32, // Match Arabic line height
  },
  translation: {
    fontSize: 15, // Slightly larger translation text
    fontFamily: 'Roboto-Regular', // Use custom font
    lineHeight: 22, // Improve line spacing for translation
    textAlign: 'left', // Standard alignment for translation
  },
});
