import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { StartScreen } from '../../../components/games/StartScreen';
import { DEFAULT_CONFIG, GameProps, GameScore } from '../../../types/games/common';

type Choice = 'rock' | 'paper' | 'scissors';

export default function RockPaperScissorsGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState<GameScore>({ score: 0, combo: 0, highScore: 0 });
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);

  const handlePlayAgain = () => {
    setIsGameOver(false);
    setScore({ score: 0, combo: 0, highScore: score.highScore });
    setIsPlaying(true);
  };

  const handleExit = () => {
    onGameOver?.(score);
  };

  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: Choice, computer: Choice): number => {
    if (player === computer) return 0;
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 1;
    }
    return -1;
  };

  const handleChoice = (choice: Choice) => {
    const computer = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computer);

    const result = determineWinner(choice, computer);
    if (result === 1) {
      setScore(prev => ({ 
        score: prev.score + 1, 
        combo: prev.combo + 1,
        highScore: Math.max(prev.highScore, prev.score + 1)
      }));
    } else if (result === -1) {
      setScore(prev => ({ 
        score: prev.score, 
        combo: 0,
        highScore: prev.highScore
      }));
      setIsGameOver(true);
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.header}>
        <Text style={styles.score}>Score: {score.score}</Text>
        <Text style={styles.combo}>Combo: {score.combo}x</Text>
      </BlurView>

      <View style={styles.gameArea}>
        {playerChoice && computerChoice && (
          <View style={styles.choices}>
            <Text style={styles.choiceText}>You: {playerChoice}</Text>
            <Text style={styles.choiceText}>Computer: {computerChoice}</Text>
          </View>
        )}
        <View style={styles.buttons}>
          <Text style={styles.button} onPress={() => handleChoice('rock')}>✊</Text>
          <Text style={styles.button} onPress={() => handleChoice('paper')}>✋</Text>
          <Text style={styles.button} onPress={() => handleChoice('scissors')}>✌️</Text>
        </View>
      </View>

      {!isPlaying && (
        <StartScreen
          onStart={() => setIsPlaying(true)}
          title="Rock Paper Scissors!"
          buttonText="Start Game"
        />
      )}

      {isGameOver && (
        <GameOverModal
          score={score}
          onPlayAgain={handlePlayAgain}
          onExit={handleExit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    color: '#fff',
    fontSize: 18,
  },
  combo: {
    color: '#fff',
    fontSize: 18,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choices: {
    marginBottom: 40,
  },
  choiceText: {
    color: '#fff',
    fontSize: 24,
    marginVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    fontSize: 50,
    padding: 20,
  },
}); 