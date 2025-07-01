import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Export screen dimensions
export { SCREEN_HEIGHT, SCREEN_WIDTH };

// Game Configuration
export const GAME_CONFIG = {
  DURATION_SECONDS: 30,
  PLAYER_SIZE_RATIO: 0.25, // 화면 너비 대비 플레이어 크기
  PLAYER_BOTTOM_MARGIN: 100,
  OBJECT_SPAWN_CHANCE: 0.03, // 3% chance per frame (폭탄 수 줄이기)
  FRAME_RATE: 60,
  INITIAL_LIVES: 3, // 초기 생명력
  MAX_LIVES: 5, // 최대 생명력
} as const;

// 난이도 시스템
export const DIFFICULTY_CONFIG = {
  EASY_DURATION: 10, // 0-10초: 쉬운 난이도
  NORMAL_DURATION: 20, // 10-20초: 보통 난이도
  HARD_DURATION: 30, // 20-30초: 어려운 난이도
} as const;

// 시간에 따른 난이도별 설정 - 폭탄 비율을 크게 줄임
export const DIFFICULTY_LEVELS = {
  EASY: {
    BOMB_WEIGHT: 0.1, // 10%로 크게 감소
    BOMB_SPEED: { MIN: 2, MAX: 4 }, // 느린 속도
    SPAWN_CHANCE: 0.02, // 2%로 조정
  },
  NORMAL: {
    BOMB_WEIGHT: 0.15, // 15%로 크게 감소
    BOMB_SPEED: { MIN: 3, MAX: 5 }, // 보통 속도
    SPAWN_CHANCE: 0.025, // 2.5%로 조정
  },
  HARD: {
    BOMB_WEIGHT: 0.2, // 20%로 크게 감소
    BOMB_SPEED: { MIN: 4, MAX: 6 }, // 빠른 속도
    SPAWN_CHANCE: 0.03, // 3%로 조정
  },
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

// Object Generation (기본값 - 난이도에 따라 동적으로 변경됨)
export const OBJECT_WEIGHTS = {
  BOMB: 0.6,   // 60% (기본값)
  STAR: 0.3,   // 30% (기본값)
  SPEED: 0.05, // 5%
  SHIELD: 0.05, // 5%
} as const;

export const OBJECT_SPEEDS = {
  BOMB: { MIN: 3, MAX: 5 }, // 기본값
  OTHER: { MIN: 2, MAX: 4 }, // 기본값
} as const;

// Power-up durations
export const POWER_UP_DURATIONS = {
  SHIELD: 15, // 15초
  SPEED: 10,  // 10초
} as const;

// Visual Constants
export const VISUAL_CONFIG = {
  OBJECT_SIZE: 40,
  CONTROL_BUTTON_SIZE: 80,
  CONTROL_BUTTON_GAP: 130,
  SHIELD_SCALE: 1.5,
  STAR_EFFECT_SCALE: 2,
  BOMB_EFFECT_SCALE: 1.3,
  SPEED_EFFECT_SCALE: 1.2,
} as const;

// Calculated Values
export const PLAYER_SIZE = SCREEN_WIDTH * GAME_CONFIG.PLAYER_SIZE_RATIO;
export const PLAYER_Y = SCREEN_HEIGHT - 50 - PLAYER_SIZE / 2;
export const PLAYER_START_X = SCREEN_WIDTH / 2;

// Object Types
export const OBJECT_TYPES = ['bomb', 'food', 'speed', 'shield'] as const;
export type ObjectType = typeof OBJECT_TYPES[number];

// 음식/음료 아이콘 배열
export const FOOD_ICONS = [
  '🍕', // 피자
  '🍔', // 햄버거
  '🍟', // 감자튀김
  '🌭', // 핫도그
  '🌮', // 타코
  '🍜', // 라면
  '🍣', // 스시
  '🍙', // 주먹밥
  '🍪', // 쿠키
  '🍰', // 케이크
  '🍦', // 아이스크림
  '🍩', // 도넛
  '☕', // 커피
  '🥤', // 탄산음료
  '🧃', // 주스
  '🍺', // 맥주
  '🍷', // 와인
  '🥛', // 우유
  '🍵', // 차
] as const;

// 기본 Emoji Mapping (food는 동적으로 생성됨)
export const OBJECT_EMOJIS: Record<ObjectType, string> = {
  bomb: '💣',
  food: '🍕', // 기본값 (실제로는 동적으로 변경됨)
  speed: '⚡',
  shield: '🛡️',
} as const; 