import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import VerseItem from '../components/VerseItem';
import { searchVerses } from '../utils/api';
import ResultItem from '../components/ResultItem';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const req = {
      size: 20,
      query: {
        nested: {
          path: "verses",
          query: {
            query_string: {
              default_field: "verses.verse",
              query: query,
              analyze_wildcard: true,
            },
          },
          inner_hits: {
            highlight: {
              order: "score",
              fields: {
                "verses.verse": { type: "plain" },
              },
              pre_tags: ["<mark>"],
              post_tags: ["</mark>"],
              boundary_scanner_locale: "ar-Ar",
              number_of_fragments: 1,
              fragment_size: 400,
            },
          },
        },
      }
    };

    searchVerses(req).then(data => {
      const formattedResults = data.map(hit => {
        // console.log("Hit:", JSON.stringify(hit.inner_hits));
        const innerHits = hit.inner_hits?.verses?.hits?.hits || [];
        const highlightedVerses = innerHits.map(innerHit => ({
          ...innerHit._source,
          surahName: hit._source.titleAr,
          verseNumber: innerHit._nested.offset,
          highlightedText: innerHit.highlight?.['verses.verse']?.[0] || null
        }));
        return highlightedVerses;
      });
      // console.log("Formatted Results:", formattedResults);
      setResults(formattedResults);
    });
  };

  const renderVerse = ({ item }) => {

    if (!item) return null;
    
    return (
      <ResultItem 
        verse={item[0]}
        highlightedText={item[0].highlightedText}
      />
    );
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
        renderItem={renderVerse}
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
