export type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-' | '*' | '/';
  answer: number;
  isSpecial?: boolean;
  specialType?: 'double' | 'time' | 'combo';
};

export type Difficulty = 'easy' | 'normal' | 'hard';

export type GameState = {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  combo: number;
  highScore: number;
  timeLeft: number;
  currentProblem: Problem | null;
  userAnswer: string;
  isCorrect: boolean | null;
  feedbackMessage: string;
  difficulty: Difficulty;
  bonusTime: number;
}; 