import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ScoreDisplayProps {
  score: number;
  combo: number;
  flipCount: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, combo, flipCount }) => {
  const comboAnimation = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(combo > 1 ? 1.2 : 1) }
    ]
  }));

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      <View style={styles.scoreItem}>
        <Text style={styles.scoreLabel}>Flips</Text>
        <Text style={styles.scoreValue}>{flipCount}</Text>
      </View>
      {combo > 1 && (
        <Animated.View style={[styles.comboContainer, comboAnimation]}>
          <Text style={styles.comboText}>{combo}x Combo!</Text>
        </Animated.View>
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  comboContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comboText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 