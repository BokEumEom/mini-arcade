import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GameId, findGameById } from '@/constants/Games';
import { useGameHistory } from '@/hooks/useGameHistory';
import { GameScore } from '@/types/games/common';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Game2048 from './2048';
import AvoidBombGame from './avoid-bomb';
import MemoryGame from './memory';
import NumberPuzzleGame from './number-puzzle';
import OthelloGame from './othello';
import PacManGame from './pac-man';
import QuickMathGame from './quick-math';
import RockPaperScissorsGame from './rock-paper-scissors';
import SwipeSquareGame from './swipe-square';
import TapCircleGame from './tap-circle';
import TetrisGame from './tetris';
import TowerDefenseGame from './tower-defense';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recordGamePlay } = useGameHistory();

  console.log('=== GAME SCREEN RENDERED ===');
  console.log('ID from params:', id);
  console.log('Current file: app/games/[id].tsx');

  // 게임 시작 시 플레이 기록 저장
  useEffect(() => {
    console.log('=== GAME SCREEN useEffect TRIGGERED ===');
    if (id) {
      console.log('Game screen mounted with id:', id);
      
      // 유효한 게임 ID인지 확인
      const game = findGameById(id as GameId);
      if (game) {
        console.log('Valid game found, recording play:', game.title);
        // 게임 화면 진입 시점에 기록 (사용자의 게임 선택 행동 반영)
        recordGamePlay(id as GameId);
      } else {
        console.warn('Invalid game ID:', id);
      }
    } else {
      console.warn('No ID provided to GameScreen');
    }
  }, [id, recordGamePlay]);

  const handleGameOver = (score: GameScore) => {
    console.log('=== GAME ROUTER HANDLE GAME OVER ===');
    console.log('Game ID:', id);
    console.log('Score:', score);
    console.log('Navigating back...');
    router.back();
  };

  const renderGame = () => {
    switch (id) {
      case 'memory':
        return <MemoryGame onGameOver={handleGameOver} />;
      case 'rock-paper-scissors':
        return <RockPaperScissorsGame />;
      case 'tower-defense':
        return <TowerDefenseGame />;
      case 'avoid-bomb':
        return <AvoidBombGame />;
      case 'pac-man':
        return <PacManGame />;
      case 'quick-math':
        return <QuickMathGame />;
      case 'swipe-square':
        return <SwipeSquareGame />;
      case 'tap-circle':
        return <TapCircleGame />;
      case 'number-puzzle':
        return <NumberPuzzleGame />;
      case 'othello':
        return <OthelloGame />;
      case '2048':
        return <Game2048 />;
      case 'tetris':
        return <TetrisGame />;
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