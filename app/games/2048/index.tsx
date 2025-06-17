import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { GameProvider, useGame } from '@/contexts/TileContext';
import GameBoard from '@/components/puzzle/GameBoard';
import ScoreBoard from '@/components/puzzle/ScoreBoard';
import { Button } from '@/components/common/Button';
import KeyboardControls from '@/components/puzzle/KeyboardControls';
import ConfirmationModal from '@/components/common/Modal';
import { useTileGestures } from '@/hooks/useTileGestures';

const PuzzleScreen = () => {
  return (
    <GameProvider>
      <PuzzleGame />
    </GameProvider>
  );
};

const PuzzleGame = () => {
  const { moveTiles, gameOver, restartGame } = useGame();
  const [showModal, setShowModal] = useState(false);
  
  // 커스텀 훅 사용
  const { panResponder, animatedStyle } = useTileGestures(moveTiles);

  // Handler for "New Game" button
  const handleNewGamePress = () => {
    setShowModal(true);
  };

  const confirmNewGame = () => {
    setShowModal(false);
    restartGame();
  };

  const cancelNewGame = () => {
    setShowModal(false);
  };

  // Move tiles function for keyboard controls
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    moveTiles(direction);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gameContainer, animatedStyle]} {...panResponder.panHandlers}>
        <ScoreBoard />
        <GameBoard />

        {/* New Game button always displayed */}
        <View style={styles.newGameContainer}>
          {gameOver && <Text style={styles.gameOverText}>Game Over</Text>}
          <Button
            title="New Game"
            onPress={handleNewGamePress}
            gradientColors={['#bbada0', '#bbada0']}
            style={styles.newGameButton}
            textStyle={styles.newGameButtonText}
          />
        </View>
      </Animated.View>

      {/* Control Keyboard */}
      <KeyboardControls onMove={handleMove} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showModal}
        onConfirm={confirmNewGame}
        onCancel={cancelNewGame}
        message="Are you sure you want to start a new game? All progress will be lost."
        confirmText="Start New Game"
        cancelText="Cancel"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f0',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGameContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  newGameButton: {
    paddingHorizontal: 40,
  },
  newGameButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PuzzleScreen;
