// 게임 설정
export const DIFFICULTY_LEVELS = {
  EASY: { targetSize: 70, spawnTime: { min: 800, max: 1200 }, duration: 1200 },
  NORMAL: { targetSize: 60, spawnTime: { min: 500, max: 1000 }, duration: 1000 },
  HARD: { targetSize: 50, spawnTime: { min: 300, max: 800 }, duration: 800 }
} as const;

export const TARGET_TYPES = {
  NORMAL: { 
    points: 1, 
    color: '#4CAF50', 
    probability: 0.6,
    timeBonus: 0,
    icon: 'target'
  },
  GOLD: { 
    points: 3, 
    color: '#FFC107', 
    probability: 0.15,
    timeBonus: 3,
    icon: 'star'
  },
  BOMB: { 
    points: -3, 
    color: '#F44336', 
    probability: 0.1,
    timeBonus: 0,
    icon: 'bomb'
  },
  RAINBOW: {
    points: 2,
    color: '#9C27B0',
    probability: 0.05,
    timeBonus: 0,
    icon: 'star-four-points'
  },
  SLOW: {
    points: 1,
    color: '#2196F3',
    probability: 0.05,
    timeBonus: 0,
    icon: 'timer'
  },
  DOUBLE: {
    points: 1,
    color: '#FF9800',
    probability: 0.05,
    timeBonus: 0,
    icon: 'multiplication'
  }
} as const;

export const MAX_COMBO_MULTIPLIER = 5;
export const COMBO_THRESHOLD = 3;
export const GAME_DURATION = 60;
export const HIGH_SCORE_KEY = 'tap_circle_high_score';

// 게임 로직 상수
export const TARGET_SIZE = 60;
export const SPAWN_INTERVAL = 1500;

// 특수 효과 지속 시간 (밀리초)
export const EFFECT_DURATIONS = {
  SLOW: 5000,    // 5초
  DOUBLE: 8000,  // 8초
} as const; 