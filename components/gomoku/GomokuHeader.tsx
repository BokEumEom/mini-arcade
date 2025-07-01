import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GomokuHeaderProps } from './types';

export default function GomokuHeader({ currentPlayer, moveCount, gameStatus, onReset }: GomokuHeaderProps) {
  const textColor = useThemeColor({}, 'text') as string;
  const backgroundColor = useThemeColor({}, 'background') as string;
  const borderColor = useThemeColor({}, 'border') as string;

  const getStatusText = useCallback((): string => {
    switch (gameStatus) {
      case 'won':
        return '게임 종료';
      case 'draw':
        return '무승부';
      default:
        return `${currentPlayer === 'black' ? '흑돌' : '백돌'} 차례`;
    }
  }, [gameStatus, currentPlayer]);

  const getStatusColor = useCallback((): string => {
    switch (gameStatus) {
      case 'won':
        return '#FF6B6B';
      case 'draw':
        return '#FFD93D';
      default:
        return textColor;
    }
  }, [gameStatus, textColor]);

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: textColor }]}>오목</Text>
        <View style={styles.playerInfo}>
          <View style={[styles.playerIndicator, { backgroundColor: currentPlayer === 'black' ? '#000' : '#fff', borderColor }]} />
          <Text style={[styles.playerText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        <Text style={[styles.moveCount, { color: textColor }]}>
          수순: {moveCount}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.resetButton, { borderColor }]} 
        onPress={onReset}
      >
        <Text style={[styles.resetText, { color: textColor }]}>다시 시작</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  playerIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 8,
  },
  playerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  moveCount: {
    fontSize: 14,
    opacity: 0.8,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 