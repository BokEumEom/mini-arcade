import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GameScore } from '@/types/games/common';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import MemoryGame from './memory';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleGameOver = (score: GameScore) => {
    console.log('=== GAME SCREEN HANDLE GAME OVER ===');
    console.log('handleGameOver called in GameScreen');
    console.log('Game over with score:', score);
    console.log('Calling router.back()...');
    router.back();
    console.log('router.back() called successfully');
  };

  const renderGame = () => {
    switch (id) {
      case 'memory':
        return <MemoryGame onGameOver={handleGameOver} />;
      default:
        return (
          <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Game: {id}</ThemedText>
            <ThemedText style={styles.description}>Coming soon...</ThemedText>
          </ThemedView>
        );
    }
  };

  return renderGame();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
  },
}); 