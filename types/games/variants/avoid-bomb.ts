import { GameScore } from '../../../types/games/common';
import { ObjectType } from '../../../constants/avoid-bomb/constants';

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
  hasShield: boolean;
  hasMagnet: boolean;
  magnetTimeLeft: number;
} 

export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: ObjectType;
  speed: number;
  icon?: string;
}

export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD';

export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: GameScore;
  timeLeft: number;
  playerX: number;
  playerY: number;
  objects: GameObject[];
  hasShield: boolean;
  hasSpeedBoost: boolean;
  speedBoostTimeLeft: number;
  shieldTimeLeft: number;
  lives: number;
  currentDifficulty: DifficultyLevel;
}

export interface GameConfig {
  duration?: number;
  difficulty?: 'easy' | 'normal' | 'hard';
  enablePowerUps?: boolean;
  initialLives?: number;
}

export interface CollisionResult {
  hasCollision: boolean;
  shouldEndGame: boolean;
  newScore?: GameScore;
  newHasShield?: boolean;
  newHasSpeedBoost?: boolean;
  newShieldTimeLeft?: number;
  newSpeedBoostTimeLeft?: number;
  newLives?: number;
} 