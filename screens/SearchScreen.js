import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import VerseItem from '../components/VerseItem';
import { searchVerses } from '../utils/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    searchVerses(query).then(data => setResults(data));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="بحث..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <VerseItem verse={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});
