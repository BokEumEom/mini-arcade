import { BOARD_SIZE, COLORS, Direction, getCellSize } from '@/constants/pac-man/constants';
import { GameBoard as GameBoardType } from '@/types/games/pac-man';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Dot } from './Dot';
import { Ghost } from './Ghost';
import { Pacman } from './Pacman';
import { PowerPellet } from './PowerPellet';
import { Wall } from './Wall';

interface GameBoardProps {
  board: GameBoardType;
  pacmanPosition: { x: number; y: number };
  pacmanDirection?: Direction;
  ghosts: Array<{ id: string; position: { x: number; y: number }; color: string; isFrightened: boolean }>;
}

export function GameBoard({ board, pacmanPosition, pacmanDirection = 'RIGHT', ghosts }: GameBoardProps) {
  const [cellSize, setCellSize] = useState(getCellSize());

  useEffect(() => {
    const updateCellSize = () => {
      setCellSize(getCellSize());
    };

    const subscription = Dimensions.addEventListener('change', updateCellSize);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const boardWidth = BOARD_SIZE.WIDTH * cellSize;
  const boardHeight = BOARD_SIZE.HEIGHT * cellSize;

  return (
    <View style={styles.container}>
      <View style={[styles.boardContainer, { width: boardWidth, height: boardHeight }]}>
        {board.map((row, y) => (
          <View key={y} style={[styles.row, { height: cellSize }]}>
            {row.map((cell, x) => (
              <View key={`${x}-${y}`} style={[styles.cell, { width: cellSize, height: cellSize }]}>
                {cell === 'wall' && <Wall size={cellSize} />}
                {cell === 'dot' && <Dot size={cellSize} />}
                {cell === 'power-pellet' && <PowerPellet size={cellSize} />}
                {x === pacmanPosition.x && y === pacmanPosition.y && (
                  <Pacman size={cellSize} direction={pacmanDirection} />
                )}
                {ghosts.map(ghost => 
                  ghost.position.x === x && ghost.position.y === y ? (
                    <Ghost key={ghost.id} color={ghost.color} isFrightened={ghost.isFrightened} size={cellSize} />
                  ) : null
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  boardContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 3,
    borderColor: COLORS.WALL,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 