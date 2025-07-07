import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GomokuCellProps } from './types';

export default function GomokuCell({ value, position, onPress, disabled, isLastMove, cellSize = 25 }: GomokuCellProps) {
  const borderColor = useThemeColor({}, 'border') as string;
  const backgroundColor = useThemeColor({}, 'background') as string;

  const getStoneColor = useCallback((): string => {
    if (value === 'black') return '#000';
    if (value === 'white') return '#fff';
    return 'transparent';
  }, [value]);

  const getStoneBorderColor = useCallback((): string => {
    if (value === 'white') return '#8B4513';
    return 'transparent';
  }, [value]);

  const handlePress = () => {
    if (!disabled) {
      onPress(position);
    }
  };

  // 격자점 위치 계산 (격자선 교차점에 정확히 위치)
  const stoneSize = cellSize * 0.75; // 돌 크기를 격자선을 고려하여 조정
  const stoneOffset = (cellSize - stoneSize) / 2;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { 
          width: cellSize,
          height: cellSize,
        }
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`${position.row}행 ${position.col}열${value ? `, ${value === 'black' ? '흑돌' : '백돌'}` : ', 빈 칸'}`}
      accessibilityRole="button"
    >
      {value && (
        <View
          style={[
            styles.stone,
            {
              width: stoneSize,
              height: stoneSize,
              borderRadius: stoneSize / 2,
              backgroundColor: getStoneColor(),
              borderColor: getStoneBorderColor(),
              borderWidth: value === 'white' ? 2 : 0,
              left: stoneOffset,
              top: stoneOffset,
              ...(isLastMove && styles.lastMoveStone),
            }
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // 터치 영역을 명확히 하기 위한 배경색 (디버깅용, 나중에 제거)
    // backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  stone: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    // 디버깅용: 바둑돌 위치 확인 (나중에 제거)
    // borderWidth: 1,
    // borderColor: 'red',
  },
  lastMoveStone: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.6,
  },
}); 