import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Board from '@/components/reversi/Board';
import ScoreBoard from '@/components/reversi/ScoreBoard';
import { DiscType, PlayerType, AIPlayerType } from '@/hooks/useReversiGame';
import { useRouter } from 'expo-router';

interface GameScreenProps {
  animatedStyle: any;
  score: { black: number; white: number };
  turn: PlayerType;
  discs: DiscType[][];
  blockedCells: Set<string>;
  playableCells: Set<string>;
  gameOver: boolean;
  onCellPress: (row: number, col: number) => void;
  onResetGame: (singlePlayer: boolean, aiAs: AIPlayerType) => void;
}

const GameScreen = ({ 
  animatedStyle, 
  score, 
  turn, 
  discs, 
  blockedCells, 
  playableCells, 
  gameOver, 
  onCellPress, 
  onResetGame,
}: GameScreenProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <Animated.View style={animatedStyle}>
      <ScoreBoard blackScore={score.black} whiteScore={score.white} turn={turn} />
      <Board
        discs={discs}
        blockedCells={blockedCells}
        playableCells={playableCells}
        onCellPress={onCellPress}
      />
      {gameOver && (
        <TouchableOpacity
          style={styles.restartButton}
          onPress={() => onResetGame(false, null)}
        >
          <Text style={styles.restartButtonText}>Play Again</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  restartButton: {
    marginTop: 20,
    backgroundColor: '#FF4500',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 15,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default memo(GameScreen); 