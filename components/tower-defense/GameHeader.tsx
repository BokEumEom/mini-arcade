import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameHeaderProps {
  money: number;
  lives: number;
  currentWave: number;
  totalWaves: number;
  score: number;
}

export function GameHeader({ money, lives, currentWave, totalWaves, score }: GameHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>💰 돈</Text>
          <Text style={styles.statValue}>{money}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>❤️ 생명</Text>
          <Text style={[styles.statValue, lives <= 5 && styles.lowLives]}>{lives}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>🌊 웨이브</Text>
          <Text style={styles.statValue}>{currentWave}/{totalWaves}</Text>
        </View>
        
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>🏆 점수</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentWave / totalWaves) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          진행률: {Math.round((currentWave / totalWaves) * 100)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#34495E',
    padding: 15,
    paddingTop: 60,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statContainer: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#BDC3C7',
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lowLives: {
    color: '#E74C3C',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2C3E50',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  progressText: {
    color: '#BDC3C7',
    fontSize: 12,
  },
}); 