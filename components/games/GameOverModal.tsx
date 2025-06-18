import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameScore } from '../../types/games/common';

interface GameOverModalProps {
  score: GameScore;
  onPlayAgain: () => void;
  onExit: () => void;
}

export function GameOverModal({ score, onPlayAgain, onExit }: GameOverModalProps) {
  const getRating = (score: number) => {
    if (score >= 50) return { grade: 'S', color: '#FFD700', message: 'Amazing! You\'re a bomb dodging master!' };
    if (score >= 40) return { grade: 'A', color: '#FF6B6B', message: 'Excellent! You\'re really good at this!' };
    if (score >= 30) return { grade: 'B', color: '#4ECDC4', message: 'Great job! Keep practicing!' };
    if (score >= 20) return { grade: 'C', color: '#45B7D1', message: 'Not bad! You can do better!' };
    if (score >= 10) return { grade: 'D', color: '#96CEB4', message: 'Keep trying! You\'ll get better!' };
    return { grade: 'F', color: '#FF9999', message: 'Don\'t give up! Try again!' };
  };

  const rating = getRating(score.score);

  const handleExit = () => {
    onExit();
    router.replace('/');
  };

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Over!</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: rating.color }]}>
            {rating.grade} 등급
          </Text>
          <Text style={styles.ratingMessage}>{rating.message}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreColumn}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreValue}>{score.score}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Best Score</Text>
              <Text style={styles.scoreValue}>{score.highScore}</Text>
            </View>
          </View>
          <View style={styles.scoreColumn}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Max Combo</Text>
              <Text style={styles.scoreValue}>{score.combo}x</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.playAgainButton]} 
            onPress={onPlayAgain}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.exitButton]} 
            onPress={handleExit}
          >
            <Text style={styles.buttonText}>Exit</Text>
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
    marginBottom: 24,
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
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  scoreContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
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