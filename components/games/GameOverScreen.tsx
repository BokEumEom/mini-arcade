import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameScore } from '../../types/games';
import { EFFICIENCY_RATINGS } from '../../types/games/memory';

interface GameOverScreenProps {
  score: GameScore;
  flipCount: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  flipCount,
  onPlayAgain,
  onExit,
}) => {
  const getEfficiencyRating = (flips: number) => {
    for (const [rating, { maxFlips }] of Object.entries(EFFICIENCY_RATINGS)) {
      if (flips <= maxFlips) return rating;
    }
    return 'F';
  };

  const rating = getEfficiencyRating(flipCount);
  const ratingInfo = EFFICIENCY_RATINGS[rating];

  return (
    <BlurView intensity={50} style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.content}
      >
        <Text style={[styles.rating, { color: ratingInfo.color }]}>
          {rating} 등급
        </Text>
        <Text style={styles.message}>{ratingInfo.message}</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>총 {flipCount}회 시도</Text>
          <Text style={styles.statsText}>최고 기록: {score.highScore}점</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.playAgainButton]} 
            onPress={onPlayAgain}
          >
            <Text style={styles.buttonText}>다시 하기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.closeButton]} 
            onPress={onExit}
          >
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  rating: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 