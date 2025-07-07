import { useThemeColor } from '@/hooks/useThemeColor';
import { Cpu, RefreshCw, User, X } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GomokuHeaderProps } from './types';

export default function GomokuHeader({ currentPlayer, moveCount, gameStatus, onReset, gameMode, onExit }: GomokuHeaderProps) {
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

  const getModeText = useCallback((): string => {
    switch (gameMode) {
      case 'human-vs-human':
        return '사람 vs 사람';
      case 'human-vs-cpu':
        return '사람 vs 컴퓨터';
      case 'cpu-vs-cpu':
        return '컴퓨터 vs 컴퓨터';
    }
  }, [gameMode]);

  const getModeIcon = useCallback(() => {
    switch (gameMode) {
      case 'human-vs-human':
        return <User size={18} color="#4CAF50" />;
      case 'human-vs-cpu':
        return <Cpu size={18} color="#FF9800" />;
      case 'cpu-vs-cpu':
        return <Cpu size={18} color="#2196F3" />;
    }
  }, [gameMode]);

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.container, { backgroundColor: 'rgba(255,255,255,0.85)', borderColor, shadowColor: borderColor }]}> 
        <View style={styles.leftBlock}>
          <Text style={styles.title}>오목</Text>
          <View style={styles.modeContainer}>
            {getModeIcon()}
            <Text style={styles.modeText}>{getModeText()}</Text>
          </View>
        </View>
        <View style={styles.centerBlock}>
          <View style={styles.playerInfo}>
            <View style={[styles.playerIndicator, { backgroundColor: currentPlayer === 'black' ? '#000' : '#fff', borderColor }]} />
            <Text style={[styles.playerText, { color: getStatusColor() }]}>{getStatusText()}</Text>
          </View>
          <Text style={styles.moveCount}>수순: {moveCount}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <RefreshCw size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton} onPress={onExit}>
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  leftBlock: {
    flex: 1.2,
    justifyContent: 'center',
  },
  centerBlock: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    letterSpacing: 2,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  modeText: {
    fontSize: 13,
    marginLeft: 6,
    color: '#333',
    fontWeight: '600',
    opacity: 0.85,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 8,
    borderColor: '#888',
  },
  playerText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  moveCount: {
    fontSize: 13,
    color: '#666',
    opacity: 0.8,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 10,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 10,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 