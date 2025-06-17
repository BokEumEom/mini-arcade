/**
 * App theme colors for light and dark modes.
 * These colors are used throughout the app for consistent theming.
 */

const PRIMARY_COLOR = '#1D1015';
const PRIMARY_LIGHT = '#2A1A1F';
const PRIMARY_DARK = '#150A0D';
const ACCENT_COLOR = '#FF4D6D';
const ACCENT_LIGHT = '#FF6B8B';
const ACCENT_DARK = '#E63E5C';

export const APP_THEME = {
  light: {
    text: '#FFFFFF',
    background: PRIMARY_COLOR,
    tabBar: '#282828',
    tint: ACCENT_COLOR,
    icon: '#FFFFFF',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: ACCENT_COLOR,
    border: '#2A2D2E',
    card: {
      background: PRIMARY_LIGHT,
      border: '#2A2D2E',
    },
    switch: {
      track: {
        false: '#767577',
        true: ACCENT_COLOR
      },
      thumb: {
        false: '#f4f3f4',
        true: '#FFFFFF'
      }
    }
  },
  dark: {
    text: '#FFFFFF',
    background: PRIMARY_DARK,
    tabBar: '#1A1A1A',
    tint: ACCENT_COLOR,
    icon: '#FFFFFF',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: ACCENT_COLOR,
    border: '#2A2D2E',
    card: {
      background: PRIMARY_COLOR,
      border: '#2A2D2E',
    },
    switch: {
      track: {
        false: '#767577',
        true: ACCENT_COLOR
      },
      thumb: {
        false: '#f4f3f4',
        true: '#FFFFFF'
      }
    }
  },
} as const; 