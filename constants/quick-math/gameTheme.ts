export const GAME_THEME = {
  primary: '#4CAF50',    // Green
  secondary: '#2196F3',  // Blue
  accent: '#FF9800',     // Orange
  success: '#4CAF50',    // Green
  error: '#F44336',      // Red
  warning: '#FFC107',    // Amber
  info: '#2196F3',       // Blue
  background: '#FFFFFF', // White
  surface: '#F5F5F5',    // Light Gray
  text: '#212121',       // Dark Gray
  textSecondary: '#757575', // Medium Gray
  border: '#E0E0E0',     // Light Gray
  disabled: '#BDBDBD',   // Gray
  overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent Black
} as const;

// Quick Math Game Theme Constants
export const QUICK_MATH_THEME = {
  // Colors
  colors: {
    primary: '#FFD700',
    success: '#4CAF50',
    error: '#F44336',
    background: 'rgba(255, 255, 255, 0.15)',
    backgroundSecondary: 'rgba(255, 255, 255, 0.2)',
    backgroundTertiary: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    borderSecondary: 'rgba(255, 255, 255, 0.25)',
    borderAccent: 'rgba(255, 255, 255, 0.3)',
    text: '#fff',
    textShadow: 'rgba(0, 0, 0, 0.3)',
    textShadowStrong: 'rgba(0, 0, 0, 0.4)',
    // Keypad specific colors
    deleteKey: 'rgba(255, 152, 0, 0.9)',
    deleteKeyBorder: 'rgba(255, 152, 0, 0.5)',
    enterKey: 'rgba(76, 175, 80, 0.9)',
    enterKeyBorder: 'rgba(76, 175, 80, 0.5)',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Border Radius
  borderRadius: {
    sm: 12,
    md: 20,
    lg: 25,
    xl: 30,
    xxl: 35,
  },
  
  // Shadows
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 15,
    },
  },
  
  // Text Shadows
  textShadows: {
    light: {
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    medium: {
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    heavy: {
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 0, height: 3 },
      textShadowRadius: 6,
    },
  },
} as const; 