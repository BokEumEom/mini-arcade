import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { GameState } from '../../types/games/tap-circle';

const TARGET_SIZE = 60;
const SPAWN_INTERVAL = 1000;
const GAME_DURATION = 60;

interface Target {
  id: string;
  x: number;
  y: number;
  type: 'normal' | 'special' | 'bomb';
  size: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
}

interface UseGameLogicProps {
  gameState: GameState;
  onScoreChange: (score: number) => void;
  onMiss: () => void;
  onGameOver: () => void;
}

export function useGameLogic({
  gameState,
  onScoreChange,
  onMiss,
  onGameOver,
}: UseGameLogicProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRandomPosition = useCallback(() => {
    const { width, height } = Dimensions.get('window');
    const x = Math.random() * (width - TARGET_SIZE);
    const y = Math.random() * (height - TARGET_SIZE);
    return { x, y };
  }, []);

  const getRandomTargetType = useCallback(() => {
    const rand = Math.random();
    if (rand < 0.1) return 'bomb';
    if (rand < 0.3) return 'special';
    return 'normal';
  }, []);

  const spawnTarget = useCallback(() => {
    const { x, y } = getRandomPosition();
    const type = getRandomTargetType();
    const size = TARGET_SIZE;

    setTargets((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        x,
        y,
        type,
        size,
      },
    ]);
  }, [getRandomPosition, getRandomTargetType]);

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x,
      y,
      color,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  const createScorePopup = useCallback((x: number, y: number, score: number) => {
    setScorePopups((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        x,
        y,
        score,
      },
    ]);
  }, []);

  const handleTargetPress = useCallback(
    (target: Target) => {
      if (target.type === 'bomb') {
        onMiss();
        createParticles(target.x, target.y, '#ff4444');
      } else {
        const score = target.type === 'special' ? 20 : 10;
        onScoreChange(score);
        createParticles(target.x, target.y, target.type === 'special' ? '#ffd700' : '#4caf50');
        createScorePopup(target.x, target.y, score);
      }

      setTargets((prev) => prev.filter((t) => t.id !== target.id));
    },
    [onScoreChange, onMiss, createParticles, createScorePopup]
  );

  const handleMiss = useCallback(() => {
    onMiss();
  }, [onMiss]);

  const startGame = useCallback(() => {
    spawnTimerRef.current = setInterval(spawnTarget, SPAWN_INTERVAL);
    gameTimerRef.current = setTimeout(() => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
      onGameOver();
    }, GAME_DURATION * 1000);
  }, [spawnTarget, onGameOver]);

  const endGame = useCallback(() => {
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
    }
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current);
    }
    setTargets([]);
    setParticles([]);
    setScorePopups([]);
  }, []);

  useEffect(() => {
    startGame();
    return () => {
      endGame();
    };
  }, [startGame, endGame]);

  return {
    targets,
    particles,
    scorePopups,
    handleTargetPress,
    handleMiss,
  };
} 