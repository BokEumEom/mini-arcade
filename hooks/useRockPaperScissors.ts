import { useRouter } from 'expo-router';
import { useState } from 'react';
import { GameProps, GameScore } from '../types/games/common';

export type Choice = 'rock' | 'paper' | 'scissors';

export const useRockPaperScissors = ({ onGameOver }: GameProps) => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState<GameScore>({ score: 0, combo: 0, highScore: 0 });
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [round, setRound] = useState(1);
  const [computerScore, setComputerScore] = useState(0);

  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: Choice, computer: Choice) => {
    if (player === computer) return 0; // Tie
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 1; // Player wins
    }
    return -1; // Computer wins
  };

  const handleChoice = (choice: Choice) => {
    if (result) return; // Prevent new choice while result is showing

    const computer = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computer);

    const gameResult = determineWinner(choice, computer);

    if (gameResult === 1) {
      setResult('YOU WIN!');
      setScore(prev => ({
        score: prev.score + 1,
        combo: prev.combo + 1,
        highScore: Math.max(prev.highScore, prev.score + 1),
      }));
    } else if (gameResult === -1) {
      setResult('YOU LOSE!');
      setComputerScore(s => s + 1);
      setScore(prev => ({ ...prev, combo: 0 }));
    } else {
      setResult('TIE!');
      setScore(prev => ({ ...prev, combo: 0 }));
    }
    
    setTimeout(() => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setResult('');
      if(gameResult !== -1) {
        setRound(r => r + 1);
      }
    }, 1500);
  };

  const handleStart = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore({ score: 0, combo: 0, highScore: score.highScore });
    setComputerScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setRound(1);
  };
  
  const handlePlayAgain = () => {
    handleStart();
  };

  const handleExit = () => {
    if (onGameOver) {
      onGameOver(score);
    } else {
      router.back();
    }
  };

  return {
    isPlaying,
    isGameOver,
    score,
    computerScore,
    playerChoice,
    computerChoice,
    result,
    round,
    handlers: {
      handleStart,
      handleChoice,
      handlePlayAgain,
      handleExit,
    },
  };
}; 