export interface Card {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameScore {
  score: number;
  combo: number;
  highScore: number;
}

export interface EfficiencyRating {
  maxFlips: number;
  color: string;
  message: string;
}

export const EFFICIENCY_RATINGS: Record<string, EfficiencyRating> = {
  S: {
    maxFlips: 16,
    color: '#FFD700',
    message: '완벽한 기억력!',
  },
  A: {
    maxFlips: 20,
    color: '#FF69B4',
    message: '뛰어난 실력!',
  },
  B: {
    maxFlips: 24,
    color: '#4CAF50',
    message: '좋은 성과!',
  },
  C: {
    maxFlips: 28,
    color: '#2196F3',
    message: '평균적인 실력',
  },
  D: {
    maxFlips: 32,
    color: '#FF9800',
    message: '조금 더 노력해요',
  },
  F: {
    maxFlips: Infinity,
    color: '#F44336',
    message: '다시 도전해보세요',
  },
} as const;

export const CARD_ICONS = [
  'pets',
  'favorite',
  'star',
  'music-note',
  'sports-esports',
  'emoji-emotions',
  'local-pizza',
  'celebration',
] as const; 