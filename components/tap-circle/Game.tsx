import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useGameLogic } from '../../hooks/tap-circle/useGameLogic';
import { useGameState } from '../../hooks/tap-circle/useGameState';
import { AchievementAlert } from './AchievementAlert';
import { ComboDisplay } from './ComboDisplay';
import { GameEffects } from './GameEffects';
import { GameHeader } from './GameHeader';
import { GameOverScreen } from './GameOverScreen';
import { Particle } from './Particle';
import { ScorePopup } from './ScorePopup';
import { Target } from './Target';
import { Particle as ParticleType, ScorePopup as ScorePopupType, Target as TargetType } from '../../types/games/tap-circle';

const { width, height } = Dimensions.get('window');

export const Game = () => {
  const {
    gameState,
    updateHighScore,
    updateAchievements,
  } = useGameState();

  const {
    targets,
    particles,
    scorePopups,
    handleTargetPress,
    handleMiss,
  } = useGameLogic({
    gameState,
    onScoreChange: (newScore: number) => {
      if (newScore > gameState.highScore) {
        updateHighScore(newScore);
      }
    },
    onMiss: () => {
      // Handle miss logic here
    },
    onGameOver: () => {
      // Handle game over logic here
    },
  });

  const handleScreenPress = useCallback(
    (event: any) => {
      const { locationX, locationY } = event.nativeEvent;
      const target = targets.find((t: TargetType) => {
        const dx = t.x - locationX;
        const dy = t.y - locationY;
        return Math.sqrt(dx * dx + dy * dy) <= t.size / 2;
      });

      if (target) {
        handleTargetPress(target);
      } else {
        handleMiss();
      }
    },
    [targets, handleTargetPress, handleMiss]
  );

  if (gameState.isGameOver) {
    return (
      <GameOverScreen
        score={gameState.score}
        highScore={gameState.highScore}
        onRestart={() => {
          // Restart game logic here
        }}
        onExit={() => {
          // Exit game logic here
        }}
      />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
        <GameHeader
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          misses={gameState.misses}
        />
        <GameEffects
          isDoubleScore={gameState.isDoubleScore}
          isSlowMotion={gameState.isSlowMotion}
        />
        <ComboDisplay
          combo={gameState.combo}
          multiplier={gameState.comboMultiplier}
        />

        {targets.map((target: TargetType) => (
          <Target
            key={target.id}
            x={target.x}
            y={target.y}
            type={target.type}
            size={target.size}
          />
        ))}

        {particles.map((particle: ParticleType) => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            color={particle.color}
          />
        ))}

        {scorePopups.map((popup: ScorePopupType) => (
          <ScorePopup
            key={popup.id}
            score={popup.score}
            x={popup.x}
            y={popup.y}
          />
        ))}

        <AchievementAlert
          visible={gameState.achievements.length > 0}
          achievement={gameState.achievements[0]}
          onClose={() => {
            // Handle achievement alert close logic here
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
}); 