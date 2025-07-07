import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BoardPosition, GomokuBoardProps } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOARD_MARGIN = 20;
const BOARD_SIZE = Math.min(SCREEN_WIDTH - BOARD_MARGIN * 2, SCREEN_HEIGHT * 0.7);
const CELL_SIZE = BOARD_SIZE / 15; // 15x15 보드

export default function GomokuBoard({ board, onCellPress, gameOver, lastMove }: GomokuBoardProps) {
  const borderColor = useThemeColor({}, 'border') as string;
  const backgroundColor = useThemeColor({}, 'background') as string;

  const handleCellPress = (position: BoardPosition) => {
    onCellPress(position);
  };

  const isLastMove = (row: number, col: number): boolean => {
    return lastMove !== null && lastMove.row === row && lastMove.col === col;
  };

  // 격자점 위치 계산 (격자선 교차점)
  const getGridPointPosition = (row: number, col: number) => {
    return {
      left: col * CELL_SIZE,
      top: row * CELL_SIZE,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.board, { borderColor }]}>
        {/* 바둑판 격자선 */}
        <View style={styles.gridLines}>
          {/* 가로선 */}
          {Array.from({ length: 15 }, (_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLine,
                {
                  top: i * CELL_SIZE,
                  width: BOARD_SIZE,
                  height: 1,
                }
              ]}
              pointerEvents="none"
            />
          ))}
          {/* 세로선 */}
          {Array.from({ length: 15 }, (_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLine,
                {
                  left: i * CELL_SIZE,
                  width: 1,
                  height: BOARD_SIZE,
                }
              ]}
              pointerEvents="none"
            />
          ))}
        </View>

        {/* 격자점들 (별점) */}
        <View style={styles.starPoints} pointerEvents="none">
          {[3, 7, 11].map(row => 
            [3, 7, 11].map(col => (
              <View
                key={`star-${row}-${col}`}
                style={[
                  styles.starPoint,
                  getGridPointPosition(row, col)
                ]}
              />
            ))
          )}
        </View>

        {/* 바둑돌들 - 격자점에 정확히 배치 */}
        <View style={styles.stonesContainer}>
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              if (!cell) return null; // 빈 칸은 렌더링하지 않음
              
              const gridPos = getGridPointPosition(rowIndex, colIndex);
              return (
                <View
                  key={`stone-${rowIndex}-${colIndex}`}
                  style={[
                    styles.stone,
                    {
                      left: gridPos.left - 12, // 돌 크기의 절반만큼 조정
                      top: gridPos.top - 12,
                      backgroundColor: cell === 'black' ? '#000' : '#fff',
                      borderColor: cell === 'white' ? '#8B4513' : 'transparent',
                      borderWidth: cell === 'white' ? 2 : 0,
                      ...(isLastMove(rowIndex, colIndex) && styles.lastMoveStone),
                    }
                  ]}
                />
              );
            })
          ))}
        </View>

        {/* 터치 영역 - 격자점 중심으로 조정 */}
        <View style={styles.touchAreas}>
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`touch-${rowIndex}-${colIndex}`}
                style={[
                  styles.touchArea,
                  getGridPointPosition(rowIndex, colIndex)
                ]}
                onPress={() => handleCellPress({ row: rowIndex, col: colIndex })}
                disabled={gameOver}
                activeOpacity={0.7}
              />
            ))
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: BOARD_MARGIN,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#DEB887',
    borderRadius: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gridLines: {
    position: 'absolute',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    zIndex: 1,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#8B4513',
  },
  starPoints: {
    position: 'absolute',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    zIndex: 2,
  },
  starPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B4513',
    marginLeft: -3,
    marginTop: -3,
  },
  stonesContainer: {
    position: 'absolute',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    zIndex: 3,
  },
  stone: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lastMoveStone: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.6,
  },
  touchAreas: {
    position: 'absolute',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    zIndex: 4,
  },
  touchArea: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    // 디버깅용: 터치 영역 확인 (나중에 제거)
    // backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
}); 