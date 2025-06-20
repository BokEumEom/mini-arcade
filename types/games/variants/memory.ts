export interface Card {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryGameState {
  cards: Card[];
  flippedCards: number[];
  flipCount: number;
}

export const CARD_ICONS = [
  'cake',
  'pets',
  'sports-soccer',
  'music-note',
  'favorite',
  'star',
  'emoji-emotions',
  'celebration',
] as const; 