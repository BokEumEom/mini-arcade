import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GomokuCellProps } from './types';

export default function GomokuCell({ value, position, onPress, disabled, isLastMove }: GomokuCellProps) {
  const borderColor = useThemeColor({}, 'border') as string;
  const backgroundColor = useThemeColor({}, 'background') as string;

  const getStoneColor = useCallback((): string => {
    if (value === 'black') return '#000';
    if (value === 'white') return '#fff';
    return 'transparent';
  }, [value]);

  const getStoneBorderColor = useCallback((): string => {
    if (value === 'white') return borderColor;
    return 'transparent';
  }, [value, borderColor]);

  const handlePress = useCallback((): void => {
    onPress(position);
  }, [onPress, position]);

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { 
          borderColor,
          backgroundColor,
        }
      ]}
      onPress={handlePress}
      disabled={disabled || value !== null}
      activeOpacity={0.7}
    >
      {value && (
        <View
          style={[
            styles.stone,
            {
              backgroundColor: getStoneColor(),
              borderColor: getStoneBorderColor(),
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
    width: 25,
    height: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stone: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
  lastMoveStone: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
}); 