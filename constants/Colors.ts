/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * These palettes aim for a soothing and elegant reading experience.
 */

// Light Mode Palette
const lightBackground = '#F8F5F2'; // Soft off-white/beige
const lightText = '#4A443F'; // Dark, warm gray
const lightPrimary = '#6D8B74'; // Muted green
const lightSecondary = '#A89E96'; // Lighter warm gray
const lightAccent = '#D4AC87'; // Soft gold/tan

// Dark Mode Palette
const darkBackground = '#2C2A28'; // Very dark, warm gray
const darkText = '#EAE3DC'; // Light off-white/beige
const darkPrimary = '#A3C9A8'; // Lighter muted green
const darkSecondary = '#8A817A'; // Medium warm gray
const darkAccent = '#E8CBAA'; // Lighter soft gold/tan

export const Colors = {
  light: {
    text: lightText,
    background: lightBackground,
    tint: lightPrimary,
    icon: lightSecondary,
    tabIconDefault: lightSecondary,
    tabIconSelected: lightPrimary,
    secondaryText: lightSecondary,
    accent: lightAccent,
    cardBackground: '#FFFFFF', // Slightly brighter card background for contrast
    borderColor: '#E0D8D1', // Subtle border color
  },
  dark: {
    text: darkText,
    background: darkBackground,
    tint: darkPrimary,
    icon: darkSecondary,
    tabIconDefault: darkSecondary,
    tabIconSelected: darkPrimary,
    secondaryText: darkSecondary,
    accent: darkAccent,
    cardBackground: '#3A3734', // Slightly lighter card background for contrast
    borderColor: '#4F4A45', // Subtle border color
  },
};
