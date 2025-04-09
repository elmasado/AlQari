import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VerseItem({ verse }) {
  return (
    <View style={styles.container}>
      <Text style={styles.arabic}>{verse.verse}</Text>
      <Text style={styles.translation}>{verse.enTranslation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  arabic: {
    fontSize: 18,
    textAlign: 'right',
  },
  translation: {
    fontSize: 14,
    color: '#555',
  },
});
