import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { StartScreen } from '../../../components/games/StartScreen';
import { DEFAULT_CONFIG, GameProps, GameScore } from '../../../types/games';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GAME_DURATION = 30; // 60 seconds
const PLAYER_SIZE = SCREEN_WIDTH * 0.25; // 화면 너비의 15%로 설정

// 이미지 프리로드
const PLAYER_IMAGE = require('../../../assets/games/images/player.png');
Image.prefetch(PLAYER_IMAGE);

type GameObject = {
  id: string;
  x: number;
  y: number;
  type: 'bomb' | 'star' | 'magnet' | 'shield';
  speed: number;
};

type GameState = {
  isPlaying: boolean;
  isGameOver: boolean;
  score: GameScore;
  timeLeft: number;
  playerX: number;
  playerY: number;
  objects: GameObject[];
  hasShield: boolean;
  hasMagnet: boolean;
  magnetTimeLeft: number;
};

export default function AvoidBombGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: { score: 0, combo: 0, highScore: 0 },
    timeLeft: GAME_DURATION,
    playerX: SCREEN_WIDTH / 2,
    playerY: SCREEN_HEIGHT - 100,
    objects: [],
    hasShield: false,
    hasMagnet: false,
    magnetTimeLeft: 0,
  });

  // 애니메이션 값들
  const starEffect = useRef(new Animated.Value(0)).current;
  const shieldEffect = useRef(new Animated.Value(0)).current;
  const magnetEffect = useRef(new Animated.Value(0)).current;
  const bombEffect = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gameState.isPlaying) {
          const newX = Math.max(20, Math.min(SCREEN_WIDTH - 20, gameState.playerX + gestureState.dx));
          setGameState(prev => ({ ...prev, playerX: newX }));
        }
      },
      onPanResponderRelease: () => true,
    })
  ).current;

  const movePlayer = (direction: 'left' | 'right') => {
    if (!gameState.isPlaying) return;
    
    const moveAmount = PLAYER_SIZE * 0.5; // 이동 거리
    const newX = direction === 'left' 
      ? Math.max(PLAYER_SIZE / 2, gameState.playerX - moveAmount)
      : Math.min(SCREEN_WIDTH - PLAYER_SIZE / 2, gameState.playerX + moveAmount);
    
    setGameState(prev => ({ ...prev, playerX: newX }));
  };

  const generateObject = (): GameObject => {
    const types: ('bomb' | 'star' | 'magnet' | 'shield')[] = ['bomb', 'star', 'magnet', 'shield'];
    const weights = [0.7, 0.2, 0.05, 0.05]; // 70% bomb, 20% star, 5% magnet, 5% shield
    
    let random = Math.random();
    let typeIndex = 0;
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        typeIndex = i;
        break;
      }
    }

    const type = types[typeIndex];
    const speed = type === 'bomb' ? 5 + Math.random() * 3 : 3 + Math.random() * 2;

    return {
      id: Math.random().toString(),
      x: Math.random() * (SCREEN_WIDTH - 60) + 30,
      y: -50,
      type,
      speed,
    };
  };

  const handleStart = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isGameOver: false,
      score: { score: 0, combo: 0, highScore: prev.score.highScore },
      timeLeft: GAME_DURATION,
      objects: [],
      hasShield: false,
      hasMagnet: false,
      magnetTimeLeft: 0,
    }));
  };

  const handlePlayAgain = () => {
    handleStart();
  };

  const handleExit = () => {
    onGameOver?.(gameState.score);
  };

  // 효과 애니메이션 함수들
  const playStarEffect = () => {
    starEffect.setValue(0);
    Animated.sequence([
      Animated.timing(starEffect, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(starEffect, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playShieldEffect = () => {
    shieldEffect.setValue(0);
    Animated.timing(shieldEffect, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const playMagnetEffect = () => {
    magnetEffect.setValue(0);
    Animated.timing(magnetEffect, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const playBombEffect = () => {
    bombEffect.setValue(0);
    Animated.sequence([
      Animated.timing(bombEffect, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bombEffect, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkCollision = (obj: GameObject) => {
    const distance = Math.sqrt(
      Math.pow(obj.x - gameState.playerX, 2) + 
      Math.pow(obj.y - gameState.playerY, 2)
    );

    if (distance < PLAYER_SIZE / 2) {
      switch (obj.type) {
        case 'star':
          playStarEffect();
          break;
        case 'shield':
          playShieldEffect();
          break;
        case 'magnet':
          playMagnetEffect();
          break;
        case 'bomb':
          if (!gameState.hasShield) {
            playBombEffect();
          }
          break;
      }
      return true;
    }
    return false;
  };

  const updateGame = () => {
    if (!gameState.isPlaying) return;

    setGameState(prev => {
      // Update existing objects
      const updatedObjects = prev.objects
        .map(obj => ({
          ...obj,
          y: obj.y + obj.speed,
        }))
        .filter(obj => obj.y < SCREEN_HEIGHT + 50);

      // Generate new objects
      if (Math.random() < 0.05) { // 5% chance each frame
        updatedObjects.push(generateObject());
      }

      // Check collisions
      let newScore = prev.score;
      let newHasShield = prev.hasShield;
      let newHasMagnet = prev.hasMagnet;
      let newMagnetTimeLeft = prev.magnetTimeLeft;

      updatedObjects.forEach(obj => {
        if (checkCollision(obj)) {
          switch (obj.type) {
            case 'bomb':
              if (prev.hasShield) {
                newHasShield = false;
              } else {
                return { ...prev, isGameOver: true, isPlaying: false };
              }
              break;
            case 'star':
              newScore = {
                ...newScore,
                score: newScore.score + 1,
                combo: newScore.combo + 1,
                highScore: Math.max(newScore.highScore, newScore.score + 1),
              };
              break;
            case 'magnet':
              newHasMagnet = true;
              newMagnetTimeLeft = 10; // 10 seconds
              break;
            case 'shield':
              newHasShield = true;
              break;
          }
        }
      });

      // Update magnet effect
      if (newHasMagnet) {
        newMagnetTimeLeft -= 1/60; // Assuming 60 FPS
        if (newMagnetTimeLeft <= 0) {
          newHasMagnet = false;
        }
      }

      return {
        ...prev,
        objects: updatedObjects,
        score: newScore,
        hasShield: newHasShield,
        hasMagnet: newHasMagnet,
        magnetTimeLeft: newMagnetTimeLeft,
      };
    });
  };

  useEffect(() => {
    let gameLoop: number;
    if (gameState.isPlaying) {
      gameLoop = setInterval(updateGame, 1000 / 60); // 60 FPS
    }
    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying]);

  useEffect(() => {
    let timer: number;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        isPlaying: false,
      }));
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  const renderObject = (obj: GameObject) => {
    let emoji = '💣';
    switch (obj.type) {
      case 'star':
        emoji = '⭐';
        break;
      case 'magnet':
        emoji = '🧲';
        break;
      case 'shield':
        emoji = '🛡️';
        break;
    }

    return (
      <Text
        key={obj.id}
        style={[
          styles.object,
          {
            left: obj.x - 20,
            top: obj.y - 20,
          },
        ]}
      >
        {emoji}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {!gameState.isPlaying && !gameState.isGameOver && (
        <StartScreen
          onStart={handleStart}
          title="Avoid Bomb!"
          buttonText="Start Game"
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

          <View style={styles.gameArea} {...panResponder.panHandlers}>
            <Animated.View
              style={[
                styles.playerContainer,
                {
                  left: gameState.playerX - PLAYER_SIZE / 2,
                  bottom: 50,
                  transform: [{
                    scale: bombEffect.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
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
                        scale: shieldEffect.interpolate({
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
                    opacity: starEffect,
                    transform: [{
                      scale: starEffect.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2],
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

          {gameState.hasMagnet && (
            <Animated.View
              style={[
                styles.magnetEffect,
                {
                  transform: [{
                    scale: magnetEffect.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  }],
                },
              ]}
            >
              <Text style={styles.magnetText}>🧲 {Math.ceil(gameState.magnetTimeLeft)}s</Text>
            </Animated.View>
          )}
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
    fontSize: 40,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
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
  magnetEffect: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 20,
  },
  magnetText: {
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
    gap: 130,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    width: PLAYER_SIZE * 1.5,
    height: PLAYER_SIZE * 1.5,
    borderRadius: PLAYER_SIZE * 0.75,
    backgroundColor: 'rgba(100, 200, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(100, 200, 255, 0.5)',
    top: -PLAYER_SIZE * 0.25,
    left: -PLAYER_SIZE * 0.25,
  },
}); 