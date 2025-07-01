import GomokuGame from '@/components/gomoku/GomokuGame';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function GomokuScreen() {
  const backgroundColor = useThemeColor({}, 'background') as string;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          title: '오목',
          headerStyle: {
            backgroundColor,
          },
          headerTintColor: useThemeColor({}, 'text') as string,
          headerLeft: () => (
            <Stack.Screen
              options={{
                headerBackTitle: '뒤로',
              }}
            />
          ),
        }}
      />
      <GomokuGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 