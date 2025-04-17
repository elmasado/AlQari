import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import VerseItem from '../components/VerseItem';
import { fetchSurah } from '../utils/api';
import { useThemeColor } from '@/hooks/useThemeColor'; // Using alias setup
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';

export default function ReadingScreen() {
  const [verses, setVerses] = useState([]);
  const [title, setTitle] = useState("");
  const [surah, setSurah] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Set loading true when fetching starts
    fetchSurah(surah).then(data => {
      // Ensure data and data.verses exist before setting state
      if (data && data.verses) {
        const verses = data.verses.map((verse, index) => ({
          ...verse,
          verse_number: index + 1
        }));
        setTitle(data.titleAr);
        setVerses(verses);
        setLoading(false); // Set loading false when data is fetched
      }
    }).catch(error => {
      console.error("Failed to fetch surah:", error);
      setVerses([]); // Clear verses on error
      setLoading(false); // Also set loading false on error
    });
  }, [surah]);

  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'borderColor');

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  const playlist = verses.map(verse => ({
    verseKey: verse.verse_key || `verse-${verse.verse_number}`,
    audioUrl: verse.linkmp3?.[1]?.source || '',
  })).filter(item => item.audioUrl);
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleContainer}>
        <GlobalAudioPlayer playlist={playlist} />
        <Text style={[styles.surahTitle, { color: textColor }]}>سورة {title}</Text>
      </View>
      <FlatList
        data={verses}
        keyExtractor={(item) => item.verse_key ?? `verse-${item.verse_number}`}
        renderItem={({ item }) => <VerseItem verse={item} playlist={playlist} />}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: borderColor }]} />}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: secondaryTextColor }]}>No verses found for this Surah.</Text>} // Handle empty state
      />
      <View style={[styles.buttonContainer, { borderTopColor: borderColor }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: cardBackgroundColor, borderColor }]}
          onPress={() => setSurah(Math.max(1, surah - 1))}
          disabled={surah === 1 || loading} // Disable during load or at first surah
        >
          <Text style={[styles.buttonText, { color: (surah === 1 || loading) ? secondaryTextColor : tintColor }]}>السابق</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: cardBackgroundColor, borderColor }]}
          onPress={() => setSurah(Math.min(114, surah + 1))} // Assuming 114 Surahs
          disabled={surah === 114 || loading} // Disable if it's the last Surah or loading
        >
          <Text style={[styles.buttonText, { color: (surah === 114 || loading) ? secondaryTextColor : tintColor }]}>التالي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  surahTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 20, // Consistent horizontal padding
    paddingBottom: 20, // Add padding at the bottom of the list
  },
  separator: {
    height: StyleSheet.hairlineWidth, // Use hairline width for subtle separator
    marginVertical: 10, // Add some vertical space around separators
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth, // Use hairline width for subtle border
    backgroundColor: 'transparent', // Ensure background doesn't interfere
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25, // Increased horizontal padding
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    flex: 1, // Allow buttons to share space
    marginHorizontal: 10, // Add space between buttons
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold', // Use custom font
    fontWeight: '600', // Keep font weight for emphasis
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontFamily: 'Roboto-Regular', // Use regular font for empty state
  }
});
