import { GameScore } from '../games/common';

export interface GameOverModalProps {
  score: GameScore;
  onPlayAgain: () => void;
  onExit: () => void;
  additionalStats?: {
    label: string;
    value: string | number;
  }[];
  customMessage?: string;
  gameType?: 'memory' | 'avoid-bomb' | 'quick-math';
}

export interface StartScreenProps {
  onStart: () => void;
  title: string;
  buttonText: string;
} 