// 업적 타입 정의
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'crown' | 'target' | 'bomb' | 'shield' | 'gamepad-variant';
  condition: (stats: GameStats) => boolean;
  reward: string;
  completed: boolean;
}

// 게임 통계 타입
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

// 게임 상태 타입
export interface GameState {
  score: number;
  highScore: number;
  timeLeft: number;
  misses: number;
  combo: number;
  comboMultiplier: number;
  isDoubleScore: boolean;
  isSlowMotion: boolean;
  isGameOver: boolean;
  achievements: Achievement[];
  stats: GameStats;
  activeRewards: {
    specialTargetChance: number;
    comboMultiplier: number;
    timeBonus: number;
  };
  targetPosition: { x: number; y: number };
  isTargetVisible: boolean;
  gameActive: boolean;
  difficulty: 'NORMAL' | 'HARD' | 'EASY';
  targetType: 'NORMAL' | 'SPECIAL' | 'BOMB';
  fastestThreeHits: number;
  lastHitTime: number;
  hitTimes: number[];
  activeEffects: {
    isDoubleScore: boolean;
    isSlowMotion: boolean;
  };
}

// 타겟 타입
export interface Target {
  id: string;
  x: number;
  y: number;
  type: 'normal' | 'special' | 'bomb';
  size: number;
}

// 파티클 타입
export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

// 점수 팝업 타입
export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
} 