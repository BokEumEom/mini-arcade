import { COLORS } from '@/constants/pac-man/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameHeaderProps {
  score: number;
  lives: number;
  level: number;
}

export function GameHeader({ score, lives, level }: GameHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
      </View>
      
      <View style={styles.centerContainer}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelValue}>{level}</Text>
        </View>
        
        <View style={styles.livesContainer}>
          <Text style={styles.livesLabel}>LIVES</Text>
          <View style={styles.lives}>
            {Array.from({ length: lives }, (_, i) => (
              <View key={i} style={styles.life} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.WALL,
  },
  scoreContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  levelContainer: {
    alignItems: 'center',
  },
  livesContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreValue: {
    color: COLORS.PACMAN,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: COLORS.PACMAN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  levelLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 1,
  },
  levelValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: COLORS.WALL,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  livesLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  lives: {
    flexDirection: 'row',
    gap: 3,
  },
  life: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.PACMAN,
    borderRadius: 8,
    shadowColor: COLORS.PACMAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
}); 