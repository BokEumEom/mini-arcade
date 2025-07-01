import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GomokuPlayer } from './types';

interface GomokuGameOverModalProps {
  winner: GomokuPlayer | null;
  gameStatus: 'won' | 'draw';
  moveCount: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export function GomokuGameOverModal({ 
  winner, 
  gameStatus, 
  moveCount, 
  onPlayAgain, 
  onExit 
}: GomokuGameOverModalProps) {
  const getResultText = () => {
    if (gameStatus === 'draw') {
      return {
        title: '무승부!',
        message: '모든 칸이 찼습니다. 실력이 비등하네요!',
        color: '#FFD93D'
      };
    }
    
    const playerText = winner === 'black' ? '흑돌' : '백돌';
    return {
      title: '게임 종료!',
      message: `${playerText}이 승리했습니다!`,
      color: winner === 'black' ? '#000' : '#fff'
    };
  };

  const getRating = (moves: number) => {
    if (moves <= 50) return { grade: 'S', color: '#FFD700', message: '완벽한 전략! 오목의 달인!' };
    if (moves <= 80) return { grade: 'A', color: '#FF6B6B', message: '훌륭한 실력! 정말 잘했어요!' };
    if (moves <= 120) return { grade: 'B', color: '#4ECDC4', message: '좋은 게임! 더 연습해보세요!' };
    if (moves <= 150) return { grade: 'C', color: '#45B7D1', message: '괜찮아요! 실력이 늘고 있어요!' };
    if (moves <= 180) return { grade: 'D', color: '#96CEB4', message: '기본기가 있어요! 계속 도전하세요!' };
    return { grade: 'F', color: '#FF9999', message: '포기하지 마세요! 다시 시도해보세요!' };
  };

  const result = getResultText();
  const rating = getRating(moveCount);

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{result.title}</Text>
        
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: result.color }]}>
            {result.message}
          </Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: rating.color }]}>
            {rating.grade} 등급
          </Text>
          <Text style={styles.ratingMessage}>{rating.message}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>총 수순</Text>
            <Text style={styles.statValue}>{moveCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>게임 결과</Text>
            <Text style={[styles.statValue, { color: result.color }]}>
              {gameStatus === 'draw' ? '무승부' : '승리'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.playAgainButton]} 
            onPress={onPlayAgain}
          >
            <Text style={styles.buttonText}>다시 시작</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.exitButton]} 
            onPress={onExit}
          >
            <Text style={styles.buttonText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rating: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingMessage: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 