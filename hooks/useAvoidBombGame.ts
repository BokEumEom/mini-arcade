import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { AvoidBombGameLogic } from '../utils/gameLogic';
import { GameState } from '../types/games/variants/avoid-bomb';

interface ScorePopupData {
  id: string;
  score: number;
  x: number;
  y: number;
}

export function useAvoidBombGame() {
  const [gameState, setGameState] = useState<GameState>(AvoidBombGameLogic.getInitialState());

  // 애니메이션 값들
  const starEffect = useRef(new Animated.Value(0)).current;
  const shieldEffect = useRef(new Animated.Value(0)).current;
  const speedEffect = useRef(new Animated.Value(0)).current;
  const bombEffect = useRef(new Animated.Value(0)).current;

  // 게임 루프 ref
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const isPlayingRef = useRef(false);

  // 효과 상태들
  const [explosionEffect, setExplosionEffect] = useState({
    isActive: false,
    centerX: 0,
    centerY: 0,
  });
  const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([]);
  const [isScreenShaking, setIsScreenShaking] = useState(false);

  const playStarEffect = useCallback(() => {
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
  }, [starEffect]);

  const playShieldEffect = useCallback(() => {
    shieldEffect.setValue(0);
    Animated.timing(shieldEffect, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [shieldEffect]);

  const playSpeedEffect = useCallback(() => {
    speedEffect.setValue(0);
    Animated.timing(speedEffect, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [speedEffect]);

  const playBombEffect = useCallback(() => {
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
  }, [bombEffect]);

  const triggerExplosion = useCallback((x: number, y: number) => {
    setExplosionEffect({
      isActive: true,
      centerX: x,
      centerY: y,
    });
  }, []);

  const triggerScreenShake = useCallback(() => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 400);
  }, []);

  const createScorePopup = useCallback((score: number, x: number, y: number) => {
    const newPopup: ScorePopupData = {
      id: Date.now().toString(),
      score,
      x,
      y,
    };
    setScorePopups(prev => [...prev, newPopup]);
  }, []);

  const removeScorePopup = useCallback((id: string) => {
    setScorePopups(prev => prev.filter(popup => popup.id !== id));
  }, []);

  const updateGame = useCallback(() => {
    if (!isPlayingRef.current) return;

    setGameState(prev => {
      // 현재 난이도 계산
      const currentDifficulty = AvoidBombGameLogic.getCurrentDifficulty(prev.timeLeft);
      
      // Update existing objects
      const updatedObjects = AvoidBombGameLogic.updateObjects(prev.objects);

      // Generate new objects based on current difficulty
      if (AvoidBombGameLogic.shouldSpawnNewObject(currentDifficulty)) {
        const newObject = AvoidBombGameLogic.generateObject(currentDifficulty);
        updatedObjects.push(newObject);
      }

      // Check collisions
      let newScore = prev.score;
      let newHasShield = prev.hasShield;
      let newHasSpeedBoost = prev.hasSpeedBoost;
      let newShieldTimeLeft = prev.shieldTimeLeft;
      let newSpeedBoostTimeLeft = prev.speedBoostTimeLeft;
      let newLives = prev.lives;
      const objectsToRemove: string[] = [];

      for (const obj of updatedObjects) {
        const collisionResult = AvoidBombGameLogic.handleCollision(obj, prev);
        
        if (collisionResult.hasCollision) {
          // 충돌이 발생한 오브젝트를 제거 목록에 추가
          objectsToRemove.push(obj.id);
          
          // Play effects
          switch (obj.type) {
            case 'food':
              playStarEffect();
              createScorePopup(1, obj.x, obj.y);
              break;
            case 'shield':
              playShieldEffect();
              break;
            case 'speed':
              playSpeedEffect();
              break;
            case 'bomb':
              if (!prev.hasShield) {
                playBombEffect();
                triggerExplosion(obj.x, obj.y);
                triggerScreenShake();
              }
              break;
          }

          // Update state based on collision result
          if (collisionResult.shouldEndGame) {
            isPlayingRef.current = false;
            return { ...prev, isGameOver: true, isPlaying: false };
          }

          if (collisionResult.newScore) {
            newScore = collisionResult.newScore;
          }
          if (collisionResult.newHasShield !== undefined) {
            newHasShield = collisionResult.newHasShield;
          }
          if (collisionResult.newHasSpeedBoost !== undefined) {
            newHasSpeedBoost = collisionResult.newHasSpeedBoost;
          }
          if (collisionResult.newShieldTimeLeft !== undefined) {
            newShieldTimeLeft = collisionResult.newShieldTimeLeft;
          }
          if (collisionResult.newSpeedBoostTimeLeft !== undefined) {
            newSpeedBoostTimeLeft = collisionResult.newSpeedBoostTimeLeft;
          }
          if (collisionResult.newLives !== undefined) {
            newLives = collisionResult.newLives;
          }
        }
      }

      // 충돌이 발생한 오브젝트들을 제거
      const finalObjects = updatedObjects.filter(obj => !objectsToRemove.includes(obj.id));

      // Update power-ups
      const powerUpUpdate = AvoidBombGameLogic.updatePowerUps(
        newHasShield, 
        newShieldTimeLeft,
        newHasSpeedBoost, 
        newSpeedBoostTimeLeft
      );

      return {
        ...prev,
        objects: finalObjects,
        score: newScore,
        hasShield: powerUpUpdate.hasShield,
        hasSpeedBoost: powerUpUpdate.hasSpeedBoost,
        shieldTimeLeft: powerUpUpdate.shieldTimeLeft,
        speedBoostTimeLeft: powerUpUpdate.speedBoostTimeLeft,
        lives: newLives,
        currentDifficulty,
      };
    });
  }, [playStarEffect, playShieldEffect, playSpeedEffect, playBombEffect, triggerExplosion, triggerScreenShake, createScorePopup]);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    if (!isPlayingRef.current) return;
    
    setGameState(prev => ({
      ...prev,
      playerX: AvoidBombGameLogic.movePlayer(prev.playerX, direction, prev.hasSpeedBoost),
    }));
  }, []);

  const handleStart = useCallback(() => {
    setGameState(prev => ({
      ...AvoidBombGameLogic.getInitialState(),
      score: { ...AvoidBombGameLogic.getInitialState().score, highScore: prev.score.highScore },
      isPlaying: true,
    }));
    isPlayingRef.current = true;
  }, []);

  const handlePlayAgain = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const handleExit = useCallback(() => {
    // 이 함수는 이제 단순히 호출되었음을 알리는 용도
    // 실제 네비게이션은 컴포넌트에서 처리
    console.log('AvoidBomb hook: handleExit called');
  }, []);

  // Update isPlayingRef when gameState.isPlaying changes
  useEffect(() => {
    isPlayingRef.current = gameState.isPlaying;
  }, [gameState.isPlaying]);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying) {
      // 더 빠른 업데이트 빈도로 변경 (60fps에서 120fps로)
      gameLoopRef.current = setInterval(updateGame, 1000 / 120);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, updateGame]);

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
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
      isPlayingRef.current = false;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.timeLeft]);

  return {
    gameState,
    movePlayer,
    handleStart,
    handlePlayAgain,
    handleExit,
    animations: {
      starEffect,
      shieldEffect,
      speedEffect,
      bombEffect,
    },
    effects: {
      explosionEffect,
      scorePopups,
      isScreenShaking,
    },
    handlers: {
      onExplosionComplete: () => setExplosionEffect(prev => ({ ...prev, isActive: false })),
      removeScorePopup,
    },
  };
} 