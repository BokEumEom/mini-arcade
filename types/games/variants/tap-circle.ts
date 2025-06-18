export interface GameStats {
  totalGames: number;
  totalScore: number;
  highestScore: number;
  targetsHit: number;
  targetsMissed: number;
  specialTargetsHit: number;
  bombsAvoided: number;
  perfectGames: number;
  highestCombo: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'crown' | 'target' | 'bomb' | 'shield' | 'gamepad-variant';
  condition: (stats: GameStats) => boolean;
  reward: string;
  completed: boolean;
}

export interface Target {
  id: string;
  x: number;
  y: number;
  type: 'normal' | 'special' | 'bomb';
  size: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
}

export interface TapCircleGameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  combo: number;
  timeLeft: number;
  targets: Array<{
    id: string;
    x: number;
    y: number;
    radius: number;
    type: 'normal' | 'special' | 'bomb';
  }>;
  misses: number;
  comboMultiplier: number;
  isDoubleScore: boolean;
  isSlowMotion: boolean;
  achievements: Achievement[];
  targetPosition: { x: number; y: number };
  isTargetVisible: boolean;
  gameActive: boolean;
  difficulty: 'NORMAL' | 'HARD';
  targetType: 'NORMAL' | 'SPECIAL';
  fastestThreeHits: number;
  lastHitTime: number;
  hitTimes: number[];
  activeEffects: {
    isDoubleScore: boolean;
    isSlowMotion: boolean;
  };
  stats: GameStats;
  activeRewards: {
    specialTargetChance: number;
    comboMultiplier: number;
    timeBonus: number;
  };
} 