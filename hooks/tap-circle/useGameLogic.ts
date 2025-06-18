import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  COMBO_THRESHOLD,
  EFFECT_DURATIONS,
  GAME_DURATION,
  MAX_COMBO_MULTIPLIER,
  SPAWN_INTERVAL,
  TARGET_SIZE
} from '../../constants/tap-circle/constants';
import { Particle, ScorePopup, TapCircleGameState, Target } from '../../types/games/variants/tap-circle';

interface UseGameLogicProps {
  gameState: TapCircleGameState;
  onScoreChange: (score: number) => void;
  onComboChange: (combo: number, multiplier: number) => void;
  onMiss: () => void;
  onGameOver: () => void;
  onTimeChange: (timeLeft: number) => void;
  onEffectChange: (effect: 'isDoubleScore' | 'isSlowMotion', value: boolean) => void;
}

export function useGameLogic({
  gameState,
  onScoreChange,
  onComboChange,
  onMiss,
  onGameOver,
  onTimeChange,
  onEffectChange,
}: UseGameLogicProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const effectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHitTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(GAME_DURATION);

  const getRandomPosition = useCallback(() => {
    const { width, height } = Dimensions.get('window');
    console.log('Screen dimensions:', { width, height, TARGET_SIZE });
    
    // 안전 영역을 고려한 타겟 생성 (헤더와 하단 영역 제외)
    const safeAreaTop = 150; // 헤더 높이 + 여백 증가
    const safeAreaBottom = 200; // 하단 안전 영역 증가
    const safeAreaLeft = 50; // 좌측 안전 영역
    const safeAreaRight = 50; // 우측 안전 영역
    
    const availableWidth = width - safeAreaLeft - safeAreaRight - TARGET_SIZE;
    const availableHeight = height - safeAreaTop - safeAreaBottom - TARGET_SIZE;
    
    const x = safeAreaLeft + Math.random() * availableWidth;
    const y = safeAreaTop + Math.random() * availableHeight;
    
    console.log('Generated position:', { x, y, availableWidth, availableHeight });
    return { x, y };
  }, []);

  const getRandomTargetType = useCallback(() => {
    const rand = Math.random();
    // 특수 효과가 활성화된 경우 특수 타겟 확률 증가
    const specialChance = gameState.activeEffects.isDoubleScore ? 0.4 : 0.3;
    const bombChance = gameState.activeEffects.isSlowMotion ? 0.05 : 0.1;
    
    if (rand < bombChance) return 'bomb';
    if (rand < specialChance) return 'special';
    return 'normal';
  }, [gameState.activeEffects]);

  const spawnTarget = useCallback(() => {
    console.log('Spawning target');
    const { x, y } = getRandomPosition();
    const type = getRandomTargetType();
    const size = TARGET_SIZE;

    const newTarget: Target = {
      id: Date.now().toString(),
      x,
      y,
      type,
      size,
    };

    console.log('New target created:', newTarget);
    setTargets((prev) => {
      const newTargets = [...prev, newTarget];
      console.log('Total targets:', newTargets.length);
      return newTargets;
    });
    
    // 타겟 자동 제거 (4초 후)
    setTimeout(() => {
      console.log('Removing target:', newTarget.id);
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
    }, 4000);
  }, [getRandomPosition, getRandomTargetType]);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x,
      y,
      color,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    
    // 파티클 자동 제거 (메모리 누수 방지)
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  }, []);

  const createScorePopup = useCallback((x: number, y: number, score: number) => {
    const popup = {
      id: Date.now().toString(),
      x,
      y,
      score,
    };
    setScorePopups((prev) => [...prev, popup]);
    
    // 스코어 팝업 자동 제거 (메모리 누수 방지)
    setTimeout(() => {
      setScorePopups((prev) => prev.filter(p => p.id !== popup.id));
    }, 1500);
  }, []);

  const calculateCombo = useCallback((currentTime: number) => {
    const timeDiff = currentTime - lastHitTimeRef.current;
    const comboThreshold = gameState.activeEffects.isSlowMotion ? 2000 : 1000; // 슬로우 모션 시 콤보 유지 시간 증가
    
    if (timeDiff < comboThreshold) {
      return gameState.combo + 1;
    }
    return 1;
  }, [gameState.combo, gameState.activeEffects.isSlowMotion]);

  const calculateMultiplier = useCallback((combo: number) => {
    if (combo < COMBO_THRESHOLD) return 1;
    return Math.min(MAX_COMBO_MULTIPLIER, Math.floor(combo / COMBO_THRESHOLD) + 1);
  }, []);

  const handleTargetPress = useCallback(
    (target: Target) => {
      console.log('handleTargetPress called for target:', target.id);
      const currentTime = Date.now();
      
      if (target.type === 'bomb') {
        console.log('Bomb target hit');
        onMiss();
        createParticles(target.x, target.y, '#ff4444');
        onComboChange(0, 1); // 콤보 리셋
      } else {
        console.log('Normal/Special target hit');
        // 콤보 계산
        const newCombo = calculateCombo(currentTime);
        const multiplier = calculateMultiplier(newCombo);
        onComboChange(newCombo, multiplier);
        
        // 점수 계산 (더블 스코어 효과 적용)
        let baseScore = target.type === 'special' ? 20 : 10;
        if (gameState.activeEffects.isDoubleScore) {
          baseScore *= 2;
        }
        const finalScore = baseScore * multiplier;
        
        onScoreChange(finalScore);
        createParticles(target.x, target.y, target.type === 'special' ? '#ffd700' : '#4caf50');
        createScorePopup(target.x, target.y, finalScore);
        
        // 특수 타겟 효과 처리
        if (target.type === 'special') {
          const effectType = Math.random() < 0.5 ? 'isDoubleScore' : 'isSlowMotion';
          onEffectChange(effectType, true);
          
          // 효과 지속 시간 설정
          const duration = effectType === 'isDoubleScore' ? EFFECT_DURATIONS.DOUBLE : EFFECT_DURATIONS.SLOW;
          setTimeout(() => {
            onEffectChange(effectType, false);
          }, duration);
        }
        
        lastHitTimeRef.current = currentTime;
      }

      console.log('Removing target from state:', target.id);
      setTargets((prev) => {
        const newTargets = prev.filter((t) => t.id !== target.id);
        console.log('Targets after removal:', newTargets.length);
        return newTargets;
      });
    },
    [
      onScoreChange, 
      onMiss, 
      onComboChange, 
      onEffectChange,
      createParticles, 
      createScorePopup, 
      calculateCombo, 
      calculateMultiplier,
      gameState.activeEffects
    ]
  );

  const handleMiss = useCallback(() => {
    onMiss();
    onComboChange(0, 1); // 콤보 리셋
  }, [onMiss, onComboChange]);

  const endGame = useCallback(() => {
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (effectTimerRef.current) {
      clearTimeout(effectTimerRef.current);
      effectTimerRef.current = null;
    }
    setTargets([]);
    setParticles([]);
    setScorePopups([]);
  }, []);

  // 게임 상태에 따른 타이머 조정
  useEffect(() => {
    console.log('Timer effect:', {
      isPlaying: gameState.isPlaying,
      gameActive: gameState.gameActive,
      hasGameTimer: !!gameTimerRef.current,
      hasSpawnTimer: !!spawnTimerRef.current
    });
    
    if (gameState.isPlaying && gameState.gameActive) {
      // 게임이 활성화되면 타이머 시작
      if (!gameTimerRef.current) {
        console.log('Starting game timer');
        currentTimeRef.current = gameState.timeLeft;
        gameTimerRef.current = setInterval(() => {
          currentTimeRef.current -= 1;
          if (currentTimeRef.current <= 0) {
            onGameOver();
          } else {
            onTimeChange(currentTimeRef.current);
          }
        }, 1000);
      }
      
      if (!spawnTimerRef.current) {
        console.log('Starting spawn timer');
        const spawnInterval = gameState.activeEffects.isSlowMotion ? SPAWN_INTERVAL * 1.5 : SPAWN_INTERVAL;
        spawnTimerRef.current = setInterval(spawnTarget, spawnInterval);
      }
    } else if (gameState.isPlaying && !gameState.gameActive) {
      // 게임이 일시정지되면 타이머만 정지 (타겟은 유지)
      console.log('Pausing timers');
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    } else {
      // 게임이 종료되면 모든 것을 정리
      console.log('Ending game');
      endGame();
    }

    return () => {
      if (!gameState.isPlaying) {
        endGame();
      }
    };
  }, [gameState.isPlaying, gameState.gameActive, gameState.activeEffects.isSlowMotion, spawnTarget, onTimeChange, onGameOver, endGame]);

  // 특수 효과 변경 시 스폰 간격 조정
  useEffect(() => {
    if (spawnTimerRef.current && gameState.isPlaying && gameState.gameActive) {
      clearInterval(spawnTimerRef.current);
      const spawnInterval = gameState.activeEffects.isSlowMotion ? SPAWN_INTERVAL * 1.5 : SPAWN_INTERVAL;
      spawnTimerRef.current = setInterval(spawnTarget, spawnInterval);
    }
  }, [gameState.activeEffects.isSlowMotion, spawnTarget, gameState.isPlaying, gameState.gameActive]);

  // 게임 시작 시 타이머 초기화
  useEffect(() => {
    if (gameState.isPlaying && gameState.gameActive) {
      currentTimeRef.current = gameState.timeLeft;
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  return {
    targets,
    particles,
    scorePopups,
    handleTargetPress,
    handleMiss,
  };
} 