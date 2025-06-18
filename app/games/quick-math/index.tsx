import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { StartScreen } from '../../../components/games/StartScreen';
import { DEFAULT_CONFIG, GameProps, GameScore } from '../../../types/games/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAME_DURATION = 60; // 60 seconds

type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-' | '*' | '/';
  answer: number;
  isSpecial?: boolean;
  specialType?: 'double' | 'time' | 'combo';
};

type Difficulty = 'easy' | 'normal' | 'hard';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function QuickMathGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState<GameScore>({ score: 0, combo: 0, highScore: 0 });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [bonusTime, setBonusTime] = useState(0);

  // Animation values
  const problemScale = useSharedValue(1);
  const answerScale = useSharedValue(1);
  const keyScale = useSharedValue(1);
  const comboScale = useSharedValue(1);
  const specialEffectScale = useSharedValue(1);

  const generateProblem = (): Problem => {
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

  const handleStart = () => {
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore({ score: 0, combo: 0, highScore: score.highScore });
    setCurrentProblem(generateProblem());
    setBonusTime(0);
  };

  const handlePlayAgain = () => {
    setIsGameOver(false);
    handleStart();
  };

  const handleExit = () => {
    onGameOver?.(score);
  };

  const handleAnswer = () => {
    if (!currentProblem) return;

    const isAnswerCorrect = parseInt(userAnswer) === currentProblem.answer;
    setIsCorrect(isAnswerCorrect);
    
    // Animate problem change
    problemScale.value = withSequence(
      withTiming(0.8, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );

    // Handle special problems
    if (isAnswerCorrect && currentProblem.isSpecial) {
      specialEffectScale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );

      switch (currentProblem.specialType) {
        case 'double':
          setScore(prev => ({
            ...prev,
            score: prev.score + 2,
            combo: prev.combo + 1,
            highScore: Math.max(prev.highScore, prev.score + 2)
          }));
          break;
        case 'time':
          setBonusTime(prev => prev + 5);
          setScore(prev => ({
            ...prev,
            score: prev.score + 1,
            combo: prev.combo + 1,
            highScore: Math.max(prev.highScore, prev.score + 1)
          }));
          break;
        case 'combo':
          setScore(prev => ({
            ...prev,
            score: prev.score + 1,
            combo: prev.combo + 2,
            highScore: Math.max(prev.highScore, prev.score + 1)
          }));
          break;
      }
    } else {
      setScore(prev => ({
        score: prev.score + (isAnswerCorrect ? 1 : 0),
        combo: isAnswerCorrect ? prev.combo + 1 : 0,
        highScore: Math.max(prev.highScore, prev.score + (isAnswerCorrect ? 1 : 0))
      }));
    }

    // Animate combo
    if (isAnswerCorrect) {
      comboScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
    }

    setUserAnswer('');
    setTimeout(() => {
      setCurrentProblem(generateProblem());
      setIsCorrect(null);
    }, 500);
  };

  const handleNumberPress = (num: string) => {
    answerScale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
    setUserAnswer(prev => prev + num);
  };

  const handleDelete = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleKeyPress = (num: string) => {
    keyScale.value = withSequence(
      withSpring(0.9),
      withSpring(1)
    );
    handleNumberPress(num);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (bonusTime > 0) {
            setBonusTime(prev => prev - 1);
            return newTime + 1;
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, bonusTime]);

  const problemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: problemScale.value }],
  }));

  const answerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: answerScale.value }],
  }));

  const keyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: keyScale.value }],
  }));

  const comboAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  const specialEffectAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: specialEffectScale.value }],
  }));

  return (
    <View style={styles.container}>
      {!isPlaying && !isGameOver && (
        <StartScreen
          onStart={handleStart}
          title="Quick Math!"
          buttonText="Start Game"
        />
      )}

      {isPlaying && (
        <>
          <View style={styles.header}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.score}>{score.score}</Text>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timer}>{timeLeft}s</Text>
              {bonusTime > 0 && (
                <Text style={styles.bonusTime}>+{bonusTime}s</Text>
              )}
            </View>
            <Animated.View style={[styles.comboContainer, comboAnimatedStyle]}>
              <Text style={styles.comboLabel}>Combo</Text>
              <Text style={styles.combo}>{score.combo}x</Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.problemContainer, problemAnimatedStyle]}>
            {currentProblem && (
              <>
                <Text style={styles.problem}>
                  {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
                </Text>
                {currentProblem.isSpecial && (
                  <Animated.Text 
                    style={[styles.specialProblem, specialEffectAnimatedStyle]}
                  >
                    {currentProblem.specialType === 'double' && '2x Points!'}
                    {currentProblem.specialType === 'time' && '+5s Bonus!'}
                    {currentProblem.specialType === 'combo' && 'Combo Boost!'}
                  </Animated.Text>
                )}
              </>
            )}
            <Animated.Text 
              style={[
                styles.answer,
                answerAnimatedStyle,
                isCorrect === true && styles.correctAnswer,
                isCorrect === false && styles.wrongAnswer
              ]}
            >
              {userAnswer}
            </Animated.Text>
          </Animated.View>

          <Animated.View style={[styles.keypad, keyAnimatedStyle]}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <TouchableOpacity
                key={num}
                style={styles.key}
                onPress={() => handleKeyPress(num.toString())}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.key}
              onPress={() => handleKeyPress('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.key, styles.enterKey]} 
              onPress={handleDelete}
            >
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.key, styles.enterKey]} 
              onPress={handleAnswer}
            >
              <Text style={styles.keyText}>✓</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
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
    backgroundColor: '#1a1a1a',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  timer: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bonusTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  comboContainer: {
    alignItems: 'center',
  },
  comboLabel: {
    color: '#FF9800',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  combo: {
    color: '#FF9800',
    fontSize: 24,
    fontWeight: 'bold',
  },
  problemContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  problem: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  specialProblem: {
    color: '#FF9800',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answer: {
    color: '#FF9800',
    fontSize: 48,
    fontWeight: 'bold',
    minHeight: 60,
  },
  correctAnswer: {
    color: '#4CAF50',
  },
  wrongAnswer: {
    color: '#F44336',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  key: {
    width: (SCREEN_WIDTH - 120) / 3,
    aspectRatio: 1.5,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  enterKey: {
    backgroundColor: '#FF9800',
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  keyText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
}); 