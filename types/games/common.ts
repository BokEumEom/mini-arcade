import { MaterialIcons } from '@expo/vector-icons';

export type GameType = 
  | 'tap-circle'
  | 'swipe-square'
  | 'avoid-bomb'
  | 'color-rush'
  | 'memory-tap'
  | 'tap-order'
  | 'pop-bubble'
  | 'tap-beat'
  | '2048'
  | 'tetris'
  | 'othello'
  | 'number-puzzle'
  | 'quick-math'
  | 'tower-defense';

export interface Game {
  id: GameType;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export interface GameScore {
  score: number;
  highScore: number;
  combo: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentLevel: number;
  score: GameScore;
  config: GameConfig;
}

export interface GameConfig {
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  targetScore?: number;
  speed?: number;
  targetSize?: number;
}

export interface GameProps {
  config?: GameConfig;
  onGameOver?: (score: GameScore) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export const DEFAULT_CONFIG: GameConfig = {
  difficulty: 'medium',
  timeLimit: 60,
  targetScore: 100,
  speed: 1,
  targetSize: 60,
};

export const DIFFICULTY_CONFIGS: Record<GameConfig['difficulty'], GameConfig> = {
  easy: {
    difficulty: 'easy',
    timeLimit: 90,
    targetScore: 50,
    speed: 0.8,
    targetSize: 70,
  },
  medium: {
    difficulty: 'medium',
    timeLimit: 60,
    targetScore: 100,
    speed: 1,
    targetSize: 60,
  },
  hard: {
    difficulty: 'hard',
    timeLimit: 45,
    targetScore: 150,
    speed: 1.2,
    targetSize: 50,
  },
};

export default function GameTypes() {
  return null;
}

// Avoid Bomb Game Types
export type ItemType = 'bomb' | 'coin';

export interface GameItem {
  id: string;
  type: 'bomb' | 'item';
  x: number;
  y: number;
  scale: { value: number };
  opacity: { value: number };
}

export interface AvoidBombGameStats {
  score: number;
  combo: number;
  comboMultiplier: number;
  timeLeft: number;
}

export interface AvoidBombGameState extends AvoidBombGameStats {
  isPlaying: boolean;
  isGameOver: boolean;
  items: GameItem[];
}

// Tap Circle Game Types
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