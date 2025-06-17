import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  misses: number;
}

export const GameHeader = ({ score, timeLeft, misses }: GameHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.score}>점수: {score}</Text>
      <Text style={styles.timer}>시간: {timeLeft}초</Text>
      <Text style={styles.misses}>실수: {misses}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  misses: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
  },
}); 