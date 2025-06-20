import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { GameHeader } from '../../../components/quick-math/GameHeader';
import { generateProblem, getInitialGameState } from '../../../components/quick-math/GameLogic';
import { Keypad } from '../../../components/quick-math/Keypad';
import { ProblemDisplay } from '../../../components/quick-math/ProblemDisplay';
import { StartScreen } from '../../../components/quick-math/StartScreen';
import { DEFAULT_CONFIG, GameProps } from '../../../types/games/common';

export default function QuickMathGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const [gameState, setGameState] = useState(getInitialGameState(0));
  const router = useRouter();

  // Animation values
  const problemScale = useSharedValue(1);
  const answerScale = useSharedValue(1);
  const comboScale = useSharedValue(1);
  const specialEffectScale = useSharedValue(1);

  const handleStart = () => {
    setGameState(prev => ({
      ...getInitialGameState(prev.highScore),
      isPlaying: true,
      currentProblem: generateProblem(prev.difficulty),
    }));
  };

  const handlePlayAgain = () => {
    setGameState(prev => ({
      ...getInitialGameState(prev.highScore),
      isPlaying: true,
      currentProblem: generateProblem(prev.difficulty),
    }));
  };

  const handleExit = () => {
    console.log('=== QuickMath: handleExit called ===');
    console.log('QuickMath: onGameOver prop available:', !!onGameOver);
    console.log('QuickMath: Current game state:', {
      score: gameState.score,
      combo: gameState.combo,
      highScore: gameState.highScore
    });
    
    // onGameOver prop이 있으면 호출
    if (onGameOver) {
      console.log('QuickMath: Calling onGameOver prop');
      onGameOver({ 
        score: gameState.score, 
        combo: gameState.combo, 
        highScore: gameState.highScore 
      });
    } else {
      console.log('QuickMath: onGameOver prop not available, using direct navigation');
      // 직접 네비게이션으로 메인 화면으로 돌아가기
      router.replace('/(tabs)');
    }
  };

  const handleAnswer = () => {
    if (!gameState.currentProblem) return;

    const isAnswerCorrect = parseInt(gameState.userAnswer) === gameState.currentProblem.answer;
    
    // 피드백 메시지 설정
    let feedbackMessage = '';
    if (isAnswerCorrect) {
      feedbackMessage = '정답입니다! 🎉';
    } else {
      feedbackMessage = `오답입니다. 정답: ${gameState.currentProblem.answer} ❌`;
    }
    
    // Animate problem change
    problemScale.value = withSequence(
      withTiming(0.8, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );

    // Handle special problems
    if (isAnswerCorrect && gameState.currentProblem.isSpecial) {
      specialEffectScale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );
    }

    // Update score
    let newScore = gameState.score;
    let newCombo = gameState.combo;
    let newBonusTime = gameState.bonusTime;

    if (isAnswerCorrect) {
      if (gameState.currentProblem.isSpecial) {
        switch (gameState.currentProblem.specialType) {
          case 'double':
            newScore += 2;
            newCombo += 1;
            break;
          case 'time':
            newBonusTime += 5;
            newScore += 1;
            newCombo += 1;
            break;
          case 'combo':
            newScore += 1;
            newCombo += 2;
            break;
        }
      } else {
        newScore += 1;
        newCombo += 1;
      }

      // Animate combo
      comboScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
    } else {
      newCombo = 0;
    }

    setGameState(prev => ({
      ...prev,
      score: newScore,
      combo: newCombo,
      bonusTime: newBonusTime,
      highScore: Math.max(prev.highScore, newScore),
      isCorrect: isAnswerCorrect,
      feedbackMessage,
      userAnswer: '',
    }));

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentProblem: generateProblem(prev.difficulty),
        isCorrect: null,
        feedbackMessage: '',
      }));
    }, 800);
  };

  const handleNumberPress = (num: string) => {
    answerScale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
    setGameState(prev => ({
      ...prev,
      userAnswer: prev.userAnswer + num,
    }));
  };

  const handleDelete = () => {
    setGameState(prev => ({
      ...prev,
      userAnswer: prev.userAnswer.slice(0, -1),
    }));
  };

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => {
          const newTime = prev.timeLeft - 1;
          if (prev.bonusTime > 0) {
            return {
              ...prev,
              timeLeft: newTime + 1,
              bonusTime: prev.bonusTime - 1,
            };
          }
          return {
            ...prev,
            timeLeft: newTime,
          };
        });
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        isPlaying: false,
      }));
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft, gameState.bonusTime]);

  const problemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: problemScale.value }],
  }));

  const answerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: answerScale.value }],
  }));

  const comboAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  const specialEffectAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: specialEffectScale.value }],
  }));

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {!gameState.isPlaying && !gameState.isGameOver && (
        <StartScreen
          onStart={handleStart}
          onExit={handleExit}
          highScore={gameState.highScore}
        />
      )}

      {gameState.isPlaying && (
        <>
          <GameHeader
            score={gameState.score}
            timeLeft={gameState.timeLeft}
            combo={gameState.combo}
            bonusTime={gameState.bonusTime}
            comboAnimatedStyle={comboAnimatedStyle}
          />

          <ProblemDisplay
            currentProblem={gameState.currentProblem}
            userAnswer={gameState.userAnswer}
            isCorrect={gameState.isCorrect}
            feedbackMessage={gameState.feedbackMessage}
            problemAnimatedStyle={problemAnimatedStyle}
            answerAnimatedStyle={answerAnimatedStyle}
            specialEffectAnimatedStyle={specialEffectAnimatedStyle}
          />

          <Keypad
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
            onEnter={handleAnswer}
          />
        </>
      )}

      {gameState.isGameOver && (
        <GameOverModal
          score={{ 
            score: gameState.score, 
            combo: gameState.combo, 
            highScore: gameState.highScore 
          }}
          onPlayAgain={handlePlayAgain}
          onExit={handleExit}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
}); 