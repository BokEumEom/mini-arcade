import React from 'react';
import { View, StyleSheet } from 'react-native';
import ResultModal from '@/components/common/ResultModal';
import GameModeScreen from '@/components/reversi/GameModeScreen';
import GameScreen from '@/components/reversi/GameScreen';
import { useReversiGame } from '@/hooks/useReversiGame';

const ReversiGame = () => {
  const { 
    state, 
    dispatch, 
    animatedStyle, 
    handleCellPress, 
    startGameWithAnimation, 
    resetGame,
  } = useReversiGame();

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
          onStartGame={startGameWithAnimation}
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
          onResetGame={resetGame}
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
