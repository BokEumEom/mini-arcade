import { Direction, GameState } from '@/constants/pac-man/constants';

// 위치 타입
export interface Position {
  x: number;
  y: number;
}

// 게임 객체 기본 타입
export interface GameObject {
  position: Position;
  direction: Direction;
}

// 팩맨 타입
export interface Pacman extends GameObject {
  isAlive: boolean;
  isPoweredUp: boolean;
  powerUpTimeLeft: number;
}

// 유령 타입
export interface Ghost extends GameObject {
  id: string;
  color: string;
  isFrightened: boolean;
  isEaten: boolean;
  isWaiting: boolean;
  targetPosition: Position;
}

// 게임 보드 셀 타입
export type CellType = 
  | 'empty'
  | 'wall'
  | 'dot'
  | 'power-pellet'
  | 'pacman'
  | 'ghost';

// 게임 보드 타입
export type GameBoard = CellType[][];

// 게임 상태 타입
export interface PacmanGameState {
  gameState: GameState;
  board: GameBoard;
  pacman: Pacman;
  ghosts: Ghost[];
  score: number;
  lives: number;
  level: number;
  dotsRemaining: number;
  currentGhostIndex: number;
  ghostReleaseTimer: number;
}

// 게임 액션 타입
export type GameAction = 
  | { type: 'MOVE_PACMAN'; direction: Direction }
  | { type: 'MOVE_GHOSTS' }
  | { type: 'COLLECT_DOT'; position: Position }
  | { type: 'COLLECT_POWER_PELLET'; position: Position }
  | { type: 'EAT_GHOST'; ghostId: string }
  | { type: 'GHOST_EAT_PACMAN' }
  | { type: 'POWER_UP_EXPIRED' }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }; 