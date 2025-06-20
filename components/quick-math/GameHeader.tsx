import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  combo: number;
  bonusTime: number;
  comboAnimatedStyle: any;
}

export const GameHeader = React.memo(({ 
  score, 
  timeLeft, 
  combo, 
  bonusTime, 
  comboAnimatedStyle 
}: GameHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{timeLeft}s</Text>
        {bonusTime > 0 && (
          <Text style={styles.bonusTime}>+{bonusTime}s</Text>
        )}
      </View>
      <Animated.View style={[styles.comboContainer, comboAnimatedStyle]}>
        <Text style={styles.comboLabel}>Combo</Text>
        <Text style={styles.combo}>{combo}x</Text>
      </Animated.View>
    </View>
  );
});

GameHeader.displayName = 'GameHeader';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '600',
  },
  score: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timer: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bonusTime: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  comboContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  comboLabel: {
    color: '#FFD700',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: '600',
  },
  combo: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
}); 