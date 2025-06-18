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