import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import VerseItem from '../components/VerseItem';
import { fetchSurah } from '../utils/api';

export default function ReadingScreen() {
  const [verses, setVerses] = useState([]);
  const [surah, setSurah] = useState(1);

  useEffect(() => {
    fetchSurah(surah).then(data => {
      setVerses(data.verses)
    });

  }, [surah]);
  return (
    <View style={styles.container}>
      <FlatList
        data={verses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <VerseItem verse={item} />}
      />
      <Button title="Next Surah" onPress={() => setSurah(surah + 1)} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
