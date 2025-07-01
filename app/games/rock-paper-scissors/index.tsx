import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { GameOverModal } from '../../../components/games/GameOverModal';
import { LoadingScreen } from '../../../components/games/LoadingScreen';
import { GameProps } from '../../../types/games/common';

import { Battlefield } from '../../../components/rock-paper-scissors/Battlefield';
import { Controls } from '../../../components/rock-paper-scissors/Controls';
import { Footer } from '../../../components/rock-paper-scissors/Footer';
import { Header } from '../../../components/rock-paper-scissors/Header';
import { ResultDisplay } from '../../../components/rock-paper-scissors/ResultDisplay';
import { ScoreDisplay } from '../../../components/rock-paper-scissors/ScoreDisplay';
import { StartScreen } from '../../../components/rock-paper-scissors/StartScreen';
import { useRockPaperScissors } from '../../../hooks/useRockPaperScissors';

export default function RockPaperScissorsGame(props: GameProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    isPlaying,
    isGameOver,
    score,
    computerScore,
    playerChoice,
    computerChoice,
    result,
    round,
    handlers,
  } = useRockPaperScissors(props);

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    handlers.handleStart();
  };

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="ROCK PAPER SCISSORS"
        onLoadingComplete={handleLoadingComplete}
        duration={1400}
      />
    );
  }

  if (!isPlaying) {
    return (
      <StartScreen
        onStart={() => setIsLoading(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://www.publicdomainpictures.net/pictures/30000/velka/pixel-background.jpg' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Header />
          <View style={styles.gameArea}>
            <Battlefield playerChoice={playerChoice} computerChoice={computerChoice} />
            <ResultDisplay result={result} />
            <ScoreDisplay playerScore={score.score} computerScore={computerScore} />
            <Controls onChoice={handlers.handleChoice} />
          </View>
          <Footer round={round} />
        </View>
      </ImageBackground>

      {isGameOver && (
        <GameOverModal
          score={score}
          onPlayAgain={() => setIsLoading(true)}
          onExit={handlers.handleExit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'space-between',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
}); 