import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Header } from '@/components/common/Header';
import { GameCard } from '@/components/games/GameCard';
import { ThemedView } from '@/components/ThemedView';
import { GAMES } from '@/constants/Games';

export default function GameListScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="소란 Games" />
      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/games/${item.id}`} asChild>
            <GameCard
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          </Link>
        )}
        contentContainerStyle={styles.gameGrid}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameGrid: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 85,
    alignItems: 'center',
  },
});
