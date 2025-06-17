import { GAMES } from '@/constants/Games';
import { Stack } from 'expo-router';
import React from 'react';

export default function GamesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      {GAMES.map((game) => (
        <Stack.Screen
          key={game.id}
          name={`${game.id}/index`}
          options={{
            headerShown: false,
          }}
        />
      ))}
    </Stack>
  );
} 