import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'dark' | 'light' | 'system';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as ThemeType);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading theme:', error);
      setIsLoaded(true);
    }
  };

  const handleThemeChange = useCallback(async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  // Only calculate isDark after theme is loaded
  const isDark = useMemo(() => {
    if (!isLoaded) return false;
    return theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
  }, [isLoaded, theme, systemTheme]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme: handleThemeChange,
    isDark,
  }), [theme, handleThemeChange, isDark]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 