import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import ReadingScreen from './screens/ReadingScreen';
import SearchScreen from './screens/SearchScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Regular: require('./assets/fonts/Roboto-Regular.ttf'),
    Bold: require('./assets/fonts/Roboto-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
  }

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1E90FF',
      background: '#FFFFFF',
      card: '#F8F8F8',
      text: '#000000',
      border: '#E0E0E0',
    },
    fonts: {
      regular: 'Regular',
      bold: 'Bold',
    },
  };

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#1E90FF',
      background: '#000000',
      card: '#1C1C1C',
      text: '#FFFFFF',
      border: '#333333',
    },
    fonts: {
      regular: 'Regular',
      bold: 'Bold',
    },
  };

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
      <Tab.Navigator>
        <Tab.Screen 
          name="Read" 
          component={ReadingScreen} 
          options={{ title: 'قراءة' }} 
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'بحث' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
