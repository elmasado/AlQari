import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AudioPlayer from '../AudioPlayer';

interface InvocationItemProps {
  text: string;
  audioUrl: string;
  id: number;
  playlist: Array<{ verseKey: string; audioUrl: string }>;
}

export default function InvocationItem({ text, audioUrl, id, playlist }: InvocationItemProps) {
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'borderColor');

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBackgroundColor, borderColor },
      ]}
    >
      <View style={styles.content}>
        <AudioPlayer
          audioUrl={audioUrl}
          verseKey={`invocation-${id}`}
          playlist={playlist}
        />
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  content: {
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'right',
    marginRight: 12,
    lineHeight: 24,
  },
});
