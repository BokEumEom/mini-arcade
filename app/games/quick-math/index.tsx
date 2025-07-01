import { APP_THEME } from '@/constants/appTheme';
import { QUICK_MATH_THEME } from '@/constants/quick-math/gameTheme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { LoadingScreen } from '../../../components/games/LoadingScreen';
import { GameHeader } from '../../../components/quick-math/GameHeader';
import { generateProblem, getInitialGameState } from '../../../components/quick-math/GameLogic';
import { Keypad } from '../../../components/quick-math/Keypad';
import { ParticleEffect } from '../../../components/quick-math/ParticleEffect';
import { ProblemDisplay } from '../../../components/quick-math/ProblemDisplay';
import { StartScreen } from '../../../components/quick-math/StartScreen';
import { DEFAULT_CONFIG, GameProps } from '../../../types/games/common';

export default function QuickMathGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const [gameState, setGameState] = useState(getInitialGameState(0));
  const [isLoading, setIsLoading] = useState(false);
  const [showParticleEffect, setShowParticleEffect] = useState(false);
  const [particleIsCorrect, setParticleIsCorrect] = useState(false);
  const router = useRouter();

  // Animation values - all hooks must be called in the same order every time
  const problemScale = useSharedValue(1);
  const answerScale = useSharedValue(1);
  const comboScale = useSharedValue(1);
  const specialEffectScale = useSharedValue(1);

  // Animated styles - all hooks must be called in the same order every time
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

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    setGameState(prev => ({
      ...getInitialGameState(prev.highScore),
      isPlaying: true,
      currentProblem: generateProblem(prev.difficulty),
    }));
  };

  const handleStart = () => {
    setIsLoading(true);
  };

  const handlePlayAgain = () => {
    setIsLoading(true);
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
    
    console.log('=== QuickMath: Answer submitted ===');
    console.log('Is correct:', isAnswerCorrect);
    console.log('User answer:', gameState.userAnswer);
    console.log('Correct answer:', gameState.currentProblem.answer);
    
    // 피드백 메시지 설정
    let feedbackMessage = '';
    if (isAnswerCorrect) {
      feedbackMessage = '정답입니다! 🎉';
    } else {
      feedbackMessage = `오답입니다. 정답: ${gameState.currentProblem.answer} ❌`;
    }
    
    // 파티클 효과 시작
    console.log('=== QuickMath: Starting particle effect ===');
    setParticleIsCorrect(isAnswerCorrect);
    setShowParticleEffect(true);
    console.log('Particle effect state set to:', true);

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

    // 파티클 애니메이션 완료 후 다음 문제로
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentProblem: generateProblem(prev.difficulty),
        isCorrect: null,
        feedbackMessage: '',
      }));
    }, isAnswerCorrect ? 1200 : 800);
  };

  // 파티클 애니메이션 완료 콜백
  const handleParticleAnimationComplete = () => {
    console.log('=== QuickMath: Particle animation completed ===');
    setShowParticleEffect(false);
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

  // Render logic - moved after all hooks are declared
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="QUICK MATH"
        onLoadingComplete={handleLoadingComplete}
        duration={1600}
      />
    );
  }

  return (
    <View style={styles.container}>
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
            answerAnimatedStyle={answerAnimatedStyle}
            specialEffectAnimatedStyle={specialEffectAnimatedStyle}
          />

          <Keypad
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
            onEnter={handleAnswer}
          />

          {/* 파티클 효과 */}
          <ParticleEffect
            isVisible={showParticleEffect}
            isCorrect={particleIsCorrect}
            onAnimationComplete={handleParticleAnimationComplete}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_THEME.light.background,
    paddingHorizontal: QUICK_MATH_THEME.spacing.xl,
    paddingVertical: QUICK_MATH_THEME.spacing.lg,
  },
}); 