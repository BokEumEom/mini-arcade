import ResultModal from '@/components/common/ResultModal';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import GameModeScreen from '@/components/reversi/GameModeScreen';
import GameScreen from '@/components/reversi/GameScreen';
import { useReversiGame } from '@/hooks/useReversiGame';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ReversiGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    state, 
    dispatch, 
    animatedStyle, 
    handleCellPress, 
    startGameWithAnimation, 
    resetGame,
  } = useReversiGame();

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    startGameWithAnimation();
  };

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="OTHELLO"
        onLoadingComplete={handleLoadingComplete}
        duration={1800}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ResultModal
        result={state.resultMessage}
        onClose={() => dispatch({ type: 'SET_RESULT_MESSAGE', payload: null })}
      />
      
      {!state.gameStarted ? (
        <GameModeScreen 
          animatedStyle={animatedStyle}
          selectedMode={{ singlePlayer: state.isSinglePlayer, aiAs: state.aiPlayer }}
          onModeSelect={(singlePlayer, aiAs) => resetGame(singlePlayer, aiAs)}
          onStartGame={() => setIsLoading(true)}
        />
      ) : (
        <GameScreen 
          animatedStyle={animatedStyle}
          score={state.score}
          turn={state.turn}
          discs={state.discs}
          blockedCells={state.blockedCells}
          playableCells={state.playableCells}
          gameOver={state.gameOver}
          onCellPress={handleCellPress}
          onResetGame={() => setIsLoading(true)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#014421',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReversiGame;
