import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createInitialGameState, makeMove } from './gameLogic';
import GomokuBoard from './GomokuBoard';
import { GomokuGameOverModal } from './GomokuGameOverModal';
import GomokuHeader from './GomokuHeader';
import { GomokuStartScreen } from './GomokuStartScreen';
import { BoardPosition, GameState } from './types';

type GamePhase = 'start' | 'playing' | 'gameOver';

export default function GomokuGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('start');
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  const backgroundColor = useThemeColor({}, 'background') as string;

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setGamePhase('playing');
  }, []);

  const startGame = useCallback(() => {
    setGamePhase('playing');
  }, []);

  const exitGame = useCallback(() => {
    setGamePhase('start');
    setGameState(createInitialGameState());
  }, []);

  const handleCellPress = useCallback((position: BoardPosition) => {
    setGameState((prevState: GameState) => {
      const newState = makeMove(prevState, position);
      
      if (newState === null) {
        return prevState; // 유효하지 않은 수
      }

      // 게임 종료 처리
      if (newState.gameStatus === 'won' || newState.gameStatus === 'draw') {
        setGamePhase('gameOver');
      }

      return newState;
    });
  }, []);

  // Start Screen
  if (gamePhase === 'start') {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <GomokuStartScreen onStart={startGame} />
      </View>
    );
  }

  // Game Over Modal
  if (gamePhase === 'gameOver') {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <GomokuHeader 
          currentPlayer={gameState.currentPlayer}
          moveCount={gameState.moveCount}
          gameStatus={gameState.gameStatus}
          onReset={resetGame}
        />
        <GomokuBoard
          board={gameState.board}
          onCellPress={handleCellPress}
          gameOver={true}
          lastMove={gameState.lastMove}
        />
        <GomokuGameOverModal
          winner={gameState.winner}
          gameStatus={gameState.gameStatus}
          moveCount={gameState.moveCount}
          onPlayAgain={resetGame}
          onExit={exitGame}
        />
      </View>
    );
  }

  // Playing Game
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GomokuHeader 
        currentPlayer={gameState.currentPlayer}
        moveCount={gameState.moveCount}
        gameStatus={gameState.gameStatus}
        onReset={resetGame}
      />
      <GomokuBoard
        board={gameState.board}
        onCellPress={handleCellPress}
        gameOver={false}
        lastMove={gameState.lastMove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
}); 