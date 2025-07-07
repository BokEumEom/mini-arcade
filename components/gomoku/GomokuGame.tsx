import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createInitialGameState, getAIMove, makeMove } from './gameLogic';
import GomokuBoard from './GomokuBoard';
import { GomokuExitModal } from './GomokuExitModal';
import { GomokuGameOverModal } from './GomokuGameOverModal';
import GomokuHeader from './GomokuHeader';
import { GomokuStartScreen } from './GomokuStartScreen';
import { BoardPosition, GameMode, GameState } from './types';

type GamePhase = 'start' | 'playing' | 'gameOver';

export default function GomokuGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('start');
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [showExitModal, setShowExitModal] = useState(false);

  const backgroundColor = useThemeColor({}, 'background') as string;

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState(gameState.gameMode));
    setGamePhase('playing');
  }, [gameState.gameMode]);

  const startGame = useCallback((mode: GameMode) => {
    const initialState = createInitialGameState(mode);
    setGameState(initialState);
    setGamePhase('playing');
  }, []);

  const exitGame = useCallback(() => {
    router.replace('/(tabs)');
  }, []);

  const handleExitClick = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const handleExitCancel = useCallback(() => {
    setShowExitModal(false);
  }, []);

  const handleExitConfirm = useCallback(() => {
    exitGame();
  }, [exitGame]);

  const handleCellPress = useCallback((position: BoardPosition) => {
    // AI 턴이거나 게임이 끝났으면 무시
    if (gameState.isAITurn) {
      return;
    }

    if (gameState.gameStatus !== 'playing') {
      return;
    }

    // 상태 업데이트를 더 안전하게 처리
    setGameState((prevState: GameState) => {
      // 현재 상태가 이미 변경되었는지 확인
      if (prevState.isAITurn || prevState.gameStatus !== 'playing') {
        return prevState;
      }
      
      const newState = makeMove(prevState, position);
      
      if (newState === null) {
        return prevState; // 유효하지 않은 수
      }

      // 게임 종료 처리
      if (newState.gameStatus === 'won' || newState.gameStatus === 'draw') {
        // 비동기로 게임 페이즈 변경
        setTimeout(() => setGamePhase('gameOver'), 100);
      }

      return newState;
    });
  }, [gameState.isAITurn, gameState.gameStatus, gameState.currentPlayer, gameState.gameMode]);

  // AI 턴 처리
  useEffect(() => {
    if (gameState.isAITurn && gameState.gameStatus === 'playing') {
      const aiPlayer = gameState.currentPlayer;
      const aiMove = getAIMove(gameState.board, aiPlayer);
      
      if (aiMove) {
        // AI 수를 두기 전에 잠시 대기 (시각적 효과)
        const timer = setTimeout(() => {
          setGameState((prevState: GameState) => {
            // AI 턴이 아니거나 게임이 끝났으면 무시
            if (!prevState.isAITurn || prevState.gameStatus !== 'playing') {
              return prevState;
            }
            
            const newState = makeMove(prevState, aiMove);
            
            if (newState === null) {
              return prevState;
            }

            // 게임 종료 처리
            if (newState.gameStatus === 'won' || newState.gameStatus === 'draw') {
              // 비동기로 게임 페이즈 변경
              setTimeout(() => setGamePhase('gameOver'), 100);
            }

            return newState;
          });
        }, 800); // 0.8초 대기 (AI가 생각하는 시간)

        return () => clearTimeout(timer);
      }
    }
  }, [gameState.isAITurn, gameState.gameStatus, gameState.board, gameState.currentPlayer]);

  // Start Screen
  if (gamePhase === 'start') {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <GomokuStartScreen 
          onStart={startGame} 
          onExit={exitGame}
          highScore={0} // TODO: 실제 최고 점수 구현 필요
        />
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
          gameMode={gameState.gameMode}
          onExit={handleExitClick}
        />
        <GomokuBoard
          board={gameState.board}
          onCellPress={handleCellPress}
          gameOver={true}
          lastMove={gameState.lastMove}
        />
        <GomokuGameOverModal
          winner={gameState.winner}
          gameStatus={gameState.gameStatus as 'won' | 'draw'}
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
        gameMode={gameState.gameMode}
        onExit={handleExitClick}
      />
      <GomokuBoard
        board={gameState.board}
        onCellPress={handleCellPress}
        gameOver={false}
        lastMove={gameState.lastMove}
      />
      
      {/* 나가기 확인 모달 */}
      {showExitModal && (
        <GomokuExitModal
          onConfirm={handleExitConfirm}
          onCancel={handleExitCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 