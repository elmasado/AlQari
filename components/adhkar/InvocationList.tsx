import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import GlobalAudioPlayer from '../GlobalAudioPlayer';
import InvocationItem from './InvocationItem';

interface InvocationListProps {
  category: string;
  invocations: Array<{
    id: number;
    texte: string;
    audio: string;
  }>;
  categoryAudio: string;
  onBack: () => void;
}

export default function InvocationList({
  category,
  invocations,
  categoryAudio,
  onBack,
}: InvocationListProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'borderColor');

  const playlist = invocations.map(item => ({
    verseKey: `invocation-${item.id}`,
    audioUrl: item.audio,
  }));

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <FontAwesome name="arrow-right" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>{category}</Text>
        <GlobalAudioPlayer playlist={playlist} />
      </View>

      <FlatList
        data={invocations}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <InvocationItem
            text={item.texte}
            audioUrl={item.audio}
            id={item.id}
            playlist={playlist}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginRight: 40,
  },
  listContent: {
    padding: 16,
  },
});
