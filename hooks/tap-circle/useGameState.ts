import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../../constants/tap-circle/achievements';
import { GAME_DURATION } from '../../constants/tap-circle/constants';
import { Achievement, TapCircleGameState } from '../../types/games/variants/tap-circle';

const INITIAL_STATE: TapCircleGameState = {
  score: 0,
  highScore: 0,
  timeLeft: GAME_DURATION,
  misses: 0,
  combo: 0,
  comboMultiplier: 1,
  isDoubleScore: false,
  isSlowMotion: false,
  achievements: ACHIEVEMENTS,
  targetPosition: { x: 0, y: 0 },
  isTargetVisible: false,
  gameActive: false,
  difficulty: 'NORMAL',
  targetType: 'NORMAL',
  fastestThreeHits: Infinity,
  lastHitTime: 0,
  hitTimes: [],
  activeEffects: {
    isDoubleScore: false,
    isSlowMotion: false
  },
  stats: {
    totalGames: 0,
    totalScore: 0,
    highestScore: 0,
    highestCombo: 0,
    specialTargetsHit: 0,
    bombsAvoided: 0,
    perfectGames: 0,
    targetsHit: 0,
    targetsMissed: 0
  },
  activeRewards: {
    specialTargetChance: 0,
    comboMultiplier: 0,
    timeBonus: 0
  },
  isGameOver: false,
  isPlaying: false,
  targets: []
};

export function useGameState() {
  const [gameState, setGameState] = useState<TapCircleGameState>(INITIAL_STATE);

  const loadHighScore = useCallback(async () => {
    try {
      const highScore = await AsyncStorage.getItem('highScore');
      if (highScore) {
        setGameState((prev) => ({
          ...prev,
          highScore: parseInt(highScore, 10),
        }));
      }
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  }, []);

  const loadAchievements = useCallback(async () => {
    try {
      const achievements = await AsyncStorage.getItem('achievements');
      if (achievements) {
        setGameState((prev) => ({
          ...prev,
          achievements: JSON.parse(achievements),
        }));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const stats = await AsyncStorage.getItem('gameStats');
      if (stats) {
        setGameState((prev) => ({
          ...prev,
          stats: JSON.parse(stats),
        }));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  useEffect(() => {
    loadHighScore();
    loadAchievements();
    loadStats();
  }, [loadHighScore, loadAchievements, loadStats]);

  const updateHighScore = useCallback(async (newScore: number) => {
    if (newScore > gameState.highScore) {
      try {
        await AsyncStorage.setItem('highScore', newScore.toString());
        setGameState((prev) => ({
          ...prev,
          highScore: newScore,
        }));
      } catch (error) {
        console.error('Failed to save high score:', error);
      }
    }
  }, [gameState.highScore]);

  const updateAchievements = useCallback(async (newAchievements: Achievement[]) => {
    try {
      await AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));
      setGameState((prev) => ({
        ...prev,
        achievements: newAchievements,
      }));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  }, []);

  const updateStats = useCallback(async (newStats: TapCircleGameState['stats']) => {
    try {
      await AsyncStorage.setItem('gameStats', JSON.stringify(newStats));
      setGameState((prev) => ({
        ...prev,
        stats: newStats,
      }));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }, []);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...INITIAL_STATE,
      highScore: prev.highScore,
      achievements: prev.achievements,
      stats: prev.stats,
      isPlaying: true,
      gameActive: true,
      timeLeft: GAME_DURATION,
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      isGameOver: true,
      gameActive: false,
    }));
  }, []);

  const updateScore = useCallback((newScore: number) => {
    setGameState((prev) => ({
      ...prev,
      score: newScore,
    }));
  }, []);

  const updateCombo = useCallback((combo: number, multiplier: number) => {
    setGameState((prev) => ({
      ...prev,
      combo,
      comboMultiplier: multiplier,
    }));
  }, []);

  const updateTimeLeft = useCallback((timeLeft: number) => {
    setGameState((prev) => ({
      ...prev,
      timeLeft,
    }));
  }, []);

  const updateMisses = useCallback((misses: number) => {
    setGameState((prev) => ({
      ...prev,
      misses,
    }));
  }, []);

  const setEffect = useCallback((effect: 'isDoubleScore' | 'isSlowMotion', value: boolean) => {
    setGameState((prev) => ({
      ...prev,
      [effect]: value,
      activeEffects: {
        ...prev.activeEffects,
        [effect]: value,
      },
    }));
  }, []);

  const setGameActive = useCallback((active: boolean) => {
    setGameState((prev) => ({
      ...prev,
      gameActive: active,
    }));
  }, []);

  return {
    gameState,
    updateHighScore,
    updateAchievements,
    updateStats,
    startGame,
    endGame,
    updateScore,
    updateCombo,
    updateTimeLeft,
    updateMisses,
    setEffect,
    setGameActive,
  };
} 