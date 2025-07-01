import { Dimensions } from 'react-native';
import { PACMAN_MAP_LAYOUT } from './mapLayout';

// 화면 크기 가져오기
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 게임 보드 크기 (mapLayout 기반)
export const BOARD_SIZE = {
  WIDTH: PACMAN_MAP_LAYOUT[0].length,
  HEIGHT: PACMAN_MAP_LAYOUT.length,
} as const;

// 반응형 셀 크기 계산
export const getCellSize = () => {
  const maxBoardWidth = screenWidth * 0.9; // 화면 너비의 90%
  const maxBoardHeight = screenHeight * 0.5; // 화면 높이의 50%
  
  const cellSizeByWidth = maxBoardWidth / BOARD_SIZE.WIDTH;
  const cellSizeByHeight = maxBoardHeight / BOARD_SIZE.HEIGHT;
  
  // 더 작은 값으로 제한하여 화면에 맞춤
  return Math.min(cellSizeByWidth, cellSizeByHeight, 24); // 최대 24px
};

// 기본 셀 크기 (fallback)
export const CELL_SIZE = getCellSize();

// 게임 속도 (밀리초)
export const GAME_SPEED = {
  PACMAN: 150,
  GHOST: 300,
  POWER_PELLET_DURATION: 10000, // 10초
} as const;

// 점수
export const SCORES = {
  DOT: 10,
  POWER_PELLET: 50,
  GHOST: 200,
} as const;

// 방향
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;

export type Direction = keyof typeof DIRECTIONS;

// 게임 상태
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete',
} as const;

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];

// 색상
export const COLORS = {
  PACMAN: '#FFD700',
  GHOST_RED: '#FF0000',
  GHOST_PINK: '#FFB8FF',
  GHOST_CYAN: '#00FFFF',
  GHOST_ORANGE: '#FFB852',
  GHOST_FRIGHTENED: '#2121FF',
  DOT: '#FFB8FF',
  POWER_PELLET: '#FFB8FF',
  WALL: '#2121FF',
  BACKGROUND: '#000000',
} as const; 