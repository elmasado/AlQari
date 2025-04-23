import React from 'react';
import { Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  html: string;
  style?: any;
}

export const HTMLText: React.FC<Props> = ({ html, style }) => {
  const tintColor = useThemeColor({}, 'tint');
  
  const parts = html.split(/(<mark>.*?<\/mark>)/);
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.startsWith('<mark>') && part.endsWith('</mark>')) {
          const text = part.replace(/<\/?mark>/g, '');
          return (
            <Text key={index} style={{ backgroundColor: tintColor + '40' }}>
              {text}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};
