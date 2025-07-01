import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExplosionEffect } from '../../../components/avoid-bomb/ExplosionEffect';
import { ScorePopup } from '../../../components/avoid-bomb/ScorePopup';
import { ScreenShake } from '../../../components/avoid-bomb/ScreenShake';
import { AvoidBombStartScreen } from '../../../components/avoid-bomb/AvoidBombStartScreen';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { LoadingScreen } from '../../../components/games/LoadingScreen';
import {
  OBJECT_EMOJIS,
  PLAYER_SIZE,
  SCREEN_WIDTH,
  VISUAL_CONFIG
} from '../../../constants/avoid-bomb/constants';
import { useAvoidBombGame } from '../../../hooks/useAvoidBombGame';
import { DEFAULT_CONFIG, GameProps } from '../../../types/games/common';

// 이미지 프리로드
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PLAYER_IMAGE = require('../../../assets/games/images/player.png');

export default function AvoidBombGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    gameState,
    movePlayer,
    handleStart,
    handlePlayAgain,
    animations,
    effects,
    handlers,
  } = useAvoidBombGame();

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    handleStart();
  };

  const handleExit = () => {
    console.log('AvoidBomb: handleExit called');
    if (onGameOver) {
      console.log('AvoidBomb: Calling onGameOver prop');
      onGameOver(gameState.score);
    } else {
      console.log('AvoidBomb: Using direct navigation');
      router.back();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gameState.isPlaying) {
          const newX = Math.max(20, Math.min(SCREEN_WIDTH - 20, gameState.playerX + gestureState.dx));
          // Note: This would need to be integrated with the hook's movePlayer function
          // For now, we'll keep the direct state update for pan gesture
        }
      },
      onPanResponderRelease: () => true,
    })
  ).current;

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="AVOID BOMB"
        onLoadingComplete={handleLoadingComplete}
        duration={1900}
      />
    );
  }

  const renderObject = (obj: { id: string; x: number; y: number; type: string; icon?: string }) => {
    const emoji = obj.type === 'food' && obj.icon ? obj.icon : OBJECT_EMOJIS[obj.type as keyof typeof OBJECT_EMOJIS];

    return (
      <Text
        key={obj.id}
        style={[
          styles.object,
          {
            left: obj.x - VISUAL_CONFIG.OBJECT_SIZE / 2,
            top: obj.y - VISUAL_CONFIG.OBJECT_SIZE / 2,
          },
        ]}
      >
        {emoji}
      </Text>
    );
  };

  const renderLives = () => {
    return (
      <View style={styles.livesContainer}>
        <Text style={styles.livesLabel}>Lives</Text>
        <View style={styles.livesIcons}>
          {Array.from({ length: 5 }, (_, i) => (
            <Text
              key={i}
              style={[
                styles.lifeIcon,
                { opacity: i < gameState.lives ? 1 : 0.3 }
              ]}
            >
              ❤️
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderDifficulty = () => {
    const difficultyColors = {
      EASY: '#4CAF50',
      NORMAL: '#FF9800',
      HARD: '#F44336',
    };
    
    const difficultyNames = {
      EASY: 'Easy',
      NORMAL: 'Normal',
      HARD: 'Hard',
    };

    return (
      <View style={[
        styles.difficultyContainer,
        { backgroundColor: difficultyColors[gameState.currentDifficulty] }
      ]}>
        <Text style={styles.difficultyText}>
          {difficultyNames[gameState.currentDifficulty]}
        </Text>
      </View>
    );
  };

  return (
    <ScreenShake isActive={effects.isScreenShaking}>
      <View style={styles.container}>
        {!gameState.isPlaying && !gameState.isGameOver && (
          <AvoidBombStartScreen
            onStart={() => setIsLoading(true)}
            onExit={handleExit}
            highScore={gameState.score.highScore}
          />
        )}

        {gameState.isPlaying && (
          <View style={styles.gameContainer}>
            <View style={styles.header}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.score}>{gameState.score.score}</Text>
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timer}>{gameState.timeLeft}s</Text>
              </View>
              <View style={styles.comboContainer}>
                <Text style={styles.comboLabel}>Combo</Text>
                <Text style={styles.combo}>{gameState.score.combo}x</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              {renderLives()}
              {renderDifficulty()}
            </View>

            <View style={styles.gameArea} {...panResponder.panHandlers}>
              <Animated.View
                style={[
                  styles.playerContainer,
                  {
                    left: gameState.playerX - PLAYER_SIZE / 2,
                    bottom: 50,
                    transform: [{
                      scale: animations.bombEffect.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, VISUAL_CONFIG.BOMB_EFFECT_SCALE],
                      }),
                    }],
                  },
                ]}
              >
                <Image
                  source={PLAYER_IMAGE}
                  style={styles.player}
                  resizeMode="contain"
                />
                {gameState.hasShield && (
                  <Animated.View
                    style={[
                      styles.shieldEffect,
                      {
                        transform: [{
                          scale: animations.shieldEffect.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.2],
                          }),
                        }],
                      },
                    ]}
                  />
                )}
                <Animated.View
                  style={[
                    styles.starEffect,
                    {
                      opacity: animations.starEffect,
                      transform: [{
                        scale: animations.starEffect.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, VISUAL_CONFIG.STAR_EFFECT_SCALE],
                        }),
                      }],
                    },
                  ]}
                >
                  <Text style={styles.starEffectText}>⭐</Text>
                </Animated.View>
              </Animated.View>
              {gameState.objects.map(renderObject)}
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => movePlayer('left')}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => movePlayer('right')}
                activeOpacity={0.7}
              >
                <Text style={styles.controlButtonText}>→</Text>
              </TouchableOpacity>
            </View>

            {gameState.hasSpeedBoost && (
              <Animated.View
                style={[
                  styles.speedEffect,
                  {
                    transform: [{
                      scale: animations.speedEffect.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    }],
                  },
                ]}
              >
                <Text style={styles.speedText}>⚡ {Math.ceil(gameState.speedBoostTimeLeft)}s</Text>
              </Animated.View>
            )}

            {/* 점수 팝업들 */}
            {effects.scorePopups.map((popup) => (
              <ScorePopup
                key={popup.id}
                score={popup.score}
                x={popup.x}
                y={popup.y}
                onComplete={() => handlers.removeScorePopup(popup.id)}
              />
            ))}

            {/* 폭발 효과 */}
            <ExplosionEffect
              isActive={effects.explosionEffect.isActive}
              centerX={effects.explosionEffect.centerX}
              centerY={effects.explosionEffect.centerY}
              onComplete={handlers.onExplosionComplete}
            />
          </View>
        )}

        {gameState.isGameOver && (
          <GameOverModal
            score={gameState.score}
            onPlayAgain={handlePlayAgain}
            onExit={handleExit}
          />
        )}
      </View>
    </ScreenShake>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gameContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  timer: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  comboContainer: {
    alignItems: 'center',
  },
  comboLabel: {
    color: '#FF9800',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  combo: {
    color: '#FF9800',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  livesContainer: {
    alignItems: 'center',
  },
  livesLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  livesIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  lifeIcon: {
    fontSize: 20,
  },
  difficultyContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  playerContainer: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
  },
  player: {
    width: '100%',
    height: '100%',
  },
  object: {
    position: 'absolute',
    fontSize: VISUAL_CONFIG.OBJECT_SIZE,
    width: VISUAL_CONFIG.OBJECT_SIZE,
    height: VISUAL_CONFIG.OBJECT_SIZE,
    textAlign: 'center',
    lineHeight: VISUAL_CONFIG.OBJECT_SIZE,
  },
  starEffect: {
    position: 'absolute',
    top: -PLAYER_SIZE / 2,
    left: -PLAYER_SIZE / 2,
    right: -PLAYER_SIZE / 2,
    bottom: -PLAYER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starEffectText: {
    fontSize: PLAYER_SIZE,
  },
  speedEffect: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 20,
  },
  speedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    gap: VISUAL_CONFIG.CONTROL_BUTTON_GAP,
  },
  controlButton: {
    width: VISUAL_CONFIG.CONTROL_BUTTON_SIZE,
    height: VISUAL_CONFIG.CONTROL_BUTTON_SIZE,
    borderRadius: VISUAL_CONFIG.CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlButtonText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  shieldEffect: {
    position: 'absolute',
    width: PLAYER_SIZE * VISUAL_CONFIG.SHIELD_SCALE,
    height: PLAYER_SIZE * VISUAL_CONFIG.SHIELD_SCALE,
    borderRadius: PLAYER_SIZE * VISUAL_CONFIG.SHIELD_SCALE / 2,
    backgroundColor: 'rgba(100, 200, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(100, 200, 255, 0.5)',
    top: -PLAYER_SIZE * (VISUAL_CONFIG.SHIELD_SCALE - 1) / 2,
    left: -PLAYER_SIZE * (VISUAL_CONFIG.SHIELD_SCALE - 1) / 2,
  },
}); 