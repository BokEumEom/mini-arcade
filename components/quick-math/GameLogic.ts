import { Difficulty, Problem } from './types';

const GAME_DURATION = 60;

export const generateProblem = (difficulty: Difficulty): Problem => {
  const operators = ['+', '-', '*', '/'] as const;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let num1: number;
  let num2: number;
  let answer: number;
  let isSpecial = Math.random() < 0.2; // 20% chance for special problem
  let specialType: 'double' | 'time' | 'combo' | undefined;

  if (isSpecial) {
    const types: ('double' | 'time' | 'combo')[] = ['double', 'time', 'combo'];
    specialType = types[Math.floor(Math.random() * types.length)];
  }

  // Adjust number ranges based on difficulty
  const maxNum = difficulty === 'easy' ? 30 : difficulty === 'normal' ? 50 : 100;
  const maxMult = difficulty === 'easy' ? 8 : difficulty === 'normal' ? 12 : 20;

  switch (operator) {
    case '+':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * maxMult) + 1;
      num2 = Math.floor(Math.random() * maxMult) + 1;
      answer = num1 * num2;
      break;
    case '/':
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * answer;
      break;
  }

  return { num1, num2, operator, answer, isSpecial, specialType };
};

export const getInitialGameState = (highScore: number = 0) => ({
  isPlaying: false,
  isGameOver: false,
  score: 0,
  combo: 0,
  highScore,
  timeLeft: GAME_DURATION,
  currentProblem: null as Problem | null,
  userAnswer: '',
  isCorrect: null as boolean | null,
  feedbackMessage: '',
  difficulty: 'normal' as Difficulty,
  bonusTime: 0,
});

export const GAME_DURATION_CONSTANT = GAME_DURATION; 