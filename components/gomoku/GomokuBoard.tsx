import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import GomokuCell from './GomokuCell';
import { BoardPosition, GomokuBoardProps } from './types';

export default function GomokuBoard({ board, onCellPress, gameOver, lastMove }: GomokuBoardProps) {
  const borderColor = useThemeColor({}, 'border') as string;
  const backgroundColor = useThemeColor({}, 'background') as string;

  const handleCellPress = (position: BoardPosition) => {
    onCellPress(position);
  };

  const isLastMove = (row: number, col: number): boolean => {
    return lastMove !== null && lastMove.row === row && lastMove.col === col;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.board, { borderColor }]}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <GomokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                position={{ row: rowIndex, col: colIndex }}
                onPress={handleCellPress}
                disabled={gameOver}
                isLastMove={isLastMove(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
}); 