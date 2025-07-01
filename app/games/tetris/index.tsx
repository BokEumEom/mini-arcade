// app/game/tetris.tsx
import { LoadingScreen } from '@/components/games/LoadingScreen';
import Board from '@/components/tetris/Board';
import GameControls from '@/components/tetris/GameControls';
import MainMenu from '@/components/tetris/MainMenu';
import NextBlock from '@/components/tetris/NextBlock';
import Scoreboard from '@/components/tetris/Scoreboard';
import { useTetrisLogic } from '@/hooks/useTetrisLogic';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const TetrisGame = () => {
  const [isGameStarted, setIsGameStarted] = useState(false); // State to track if the game is started
  const [isLoading, setIsLoading] = useState(false);
  const { 
    board, 
    currentPiece,
    nextPiece, 
    score, 
    level, 
    isGameOver, 
    updateGame, 
    handleKeyPress 
  } = useTetrisLogic();

  // Shared value for animations
  const animationProgress = useSharedValue(0); // 0: MainMenu, 1: Game

  // Animated styles
  const menuStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - animationProgress.value, { duration: 500 }),
    transform: [
      {
        translateY: withTiming(animationProgress.value * -height, { duration: 500 }),
      },
    ],
  }));

  const gameStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animationProgress.value, { duration: 500 }),
    transform: [
      {
        translateY: withTiming((1 - animationProgress.value) * height, { duration: 500 }),
      },
    ],
  }));

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const interval = setInterval(() => {
      updateGame();
    }, 1000 / level);

    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, level, updateGame]);

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // 로딩 완료 후 게임 시작 애니메이션
    animationProgress.value = 1;
    setTimeout(() => setIsGameStarted(true), 500);
  };

  // Handle game start with loading screen
  const startGame = () => {
    setIsLoading(true);
  };

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="TETRIS"
        onLoadingComplete={handleLoadingComplete}
        duration={2000}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screen, menuStyle]}>
        <MainMenu onStartGame={startGame} />
      </Animated.View>
      <Animated.View style={[styles.screen, gameStyle]}>
        <View style={styles.header}>
          <Scoreboard score={score} level={level} />
          <NextBlock nextPiece={nextPiece} />
        </View>
        <View style={styles.gameArea}>
          <Board board={board} currentPiece={currentPiece} />
        </View>
        <View style={styles.controlsContainer}>
          <GameControls
            onMoveLeft={() => handleKeyPress('ArrowLeft')}
            onMoveRight={() => handleKeyPress('ArrowRight')}
            onRotate={() => handleKeyPress('ArrowUp')}
            onMoveDown={() => handleKeyPress('ArrowDown')}
            onDropDown={() => handleKeyPress(' ')}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
    overflow: 'hidden', // Prevent animation overflow
  },
  screen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});

export default TetrisGame;
