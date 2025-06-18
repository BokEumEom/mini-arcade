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