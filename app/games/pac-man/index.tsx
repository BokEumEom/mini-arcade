import { GameOverModal } from '@/components/games/GameOverModal';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import { GameBoard } from '@/components/pac-man/GameBoard';
import { GameControls } from '@/components/pac-man/GameControls';
import { GameHeader } from '@/components/pac-man/GameHeader';
import { StartScreen } from '@/components/pac-man/StartScreen';
import { COLORS, GAME_STATES } from '@/constants/pac-man/constants';
import { usePacmanGame } from '@/hooks/usePacmanGame';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function PacmanGame() {
  const { state, startGame, togglePause, movePacman, resetGame } = usePacmanGame();
  const [isLoading, setIsLoading] = useState(false);

  // 디버깅을 위한 로그
  console.log('Current game state:', state.gameState);
  console.log('Pacman position:', state.pacman.position);
  console.log('Ghosts:', state.ghosts.map(g => ({ id: g.id, pos: g.position })));

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // 로딩 완료 후 게임 시작
    startGame();
  };

  // 게임 시작 버튼 클릭 처리
  const handleStartButtonClick = () => {
    setIsLoading(true);
  };

  // 게임 종료 처리
  const handleExit = () => {
    resetGame();
    router.back();
  };

  // 키보드 이벤트 처리 (웹용)
  useEffect(() => {
    // 웹 플랫폼에서만 window API 사용
    if (Platform.OS !== 'web') return;

    const handleKeyPress = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key);
      switch (event.key) {
        case 'ArrowUp':
          movePacman('UP');
          break;
        case 'ArrowDown':
          movePacman('DOWN');
          break;
        case 'ArrowLeft':
          movePacman('LEFT');
          break;
        case 'ArrowRight':
          movePacman('RIGHT');
          break;
        case ' ':
          togglePause();
          break;
      }
    };

    if (state.gameState === GAME_STATES.PLAYING) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [state.gameState, movePacman, togglePause]);

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="PAC-MAN"
        onLoadingComplete={handleLoadingComplete}
        duration={2000}
      />
    );
  }

  if (state.gameState === GAME_STATES.MENU) {
    return <StartScreen onStart={handleStartButtonClick} />;
  }

  return (
    <View style={styles.container}>
      <GameHeader 
        score={state.score} 
        lives={state.lives} 
        level={state.level} 
      />
      
      <GameBoard 
        board={state.board}
        pacmanPosition={state.pacman.position}
        pacmanDirection={state.pacman.direction}
        ghosts={state.ghosts}
      />
      
      <GameControls 
        onDirectionPress={movePacman}
        onPausePress={togglePause}
      />
      
      {state.gameState === GAME_STATES.GAME_OVER && (
        <GameOverModal 
          score={{ score: state.score, highScore: state.score, combo: 1 }}
          onPlayAgain={() => setIsLoading(true)}
          onExit={handleExit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'space-between',
  },
}); 