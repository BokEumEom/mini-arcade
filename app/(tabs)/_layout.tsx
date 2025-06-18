import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { APP_THEME } from '@/constants/appTheme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  console.log('TabLayout: Rendering tab layout with colorScheme:', colorScheme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: APP_THEME[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: APP_THEME[colorScheme ?? 'dark'].tabBar,
          },
          default: {
            backgroundColor: APP_THEME[colorScheme ?? 'dark'].tabBar,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '게임',
          tabBarIcon: ({ color }) => {
            console.log('TabLayout: Rendering computer icon with color:', color);
            return <IconSymbol size={28} name="computer" color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '세팅',
          tabBarIcon: ({ color }) => {
            console.log('TabLayout: Rendering wrench icon with color:', color);
            return <IconSymbol size={28} name="wrench" color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
