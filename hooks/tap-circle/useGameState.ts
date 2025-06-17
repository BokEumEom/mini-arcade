import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../../constants/tap-circle/achievements';
import { GAME_DURATION } from '../../constants/tap-circle/constants';
import { Achievement, GameState } from '../../types/games/tap-circle';

const INITIAL_STATE: GameState = {
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
  isGameOver: false
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  useEffect(() => {
    loadHighScore();
    loadAchievements();
  }, []);

  const loadHighScore = async () => {
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
  };

  const loadAchievements = async () => {
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
  };

  const updateHighScore = async (newScore: number) => {
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
  };

  const updateAchievements = async (newAchievements: Achievement[]) => {
    try {
      await AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));
      setGameState((prev) => ({
        ...prev,
        achievements: newAchievements,
      }));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  };

  return {
    gameState,
    updateHighScore,
    updateAchievements,
  };
} 