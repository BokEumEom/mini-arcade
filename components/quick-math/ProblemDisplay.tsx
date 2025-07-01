import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { QUICK_MATH_THEME } from '../../constants/quick-math/gameTheme';
import { Problem } from './types';

interface ProblemDisplayProps {
  currentProblem: Problem | null;
  userAnswer: string;
  isCorrect: boolean | null;
  feedbackMessage: string;
  answerAnimatedStyle: any;
  specialEffectAnimatedStyle: any;
}

export const ProblemDisplay = React.memo(({
  currentProblem,
  userAnswer,
  isCorrect,
  feedbackMessage,
  answerAnimatedStyle,
  specialEffectAnimatedStyle,
}: ProblemDisplayProps) => {
  return (
    <View style={styles.problemContainer}>
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
      
      {/* 피드백 메시지 */}
      <View style={styles.feedbackContainer}>
        {feedbackMessage && (
          <Animated.Text 
            style={[
              styles.feedbackMessage,
              isCorrect === true && styles.correctFeedback,
              isCorrect === false && styles.wrongFeedback
            ]}
          >
            {feedbackMessage}
          </Animated.Text>
        )}
      </View>
    </View>
  );
});

ProblemDisplay.displayName = 'ProblemDisplay';

const styles = StyleSheet.create({
  problemContainer: {
    alignItems: 'center',
    marginVertical: QUICK_MATH_THEME.spacing.sm,
    backgroundColor: QUICK_MATH_THEME.colors.background,
    paddingVertical: QUICK_MATH_THEME.spacing.xxl,
    borderRadius: QUICK_MATH_THEME.borderRadius.xxl,
    borderWidth: 2,
    borderColor: QUICK_MATH_THEME.colors.borderSecondary,
    ...QUICK_MATH_THEME.shadows.heavy,
  },
  problem: {
    color: QUICK_MATH_THEME.colors.text,
    fontSize: 46,
    fontWeight: 'bold',
    marginBottom: QUICK_MATH_THEME.spacing.md,
    ...QUICK_MATH_THEME.textShadows.heavy,
  },
  specialProblem: {
    color: QUICK_MATH_THEME.colors.primary,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: QUICK_MATH_THEME.spacing.md,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  answer: {
    color: QUICK_MATH_THEME.colors.primary,
    fontSize: 60,
    fontWeight: 'bold',
    minHeight: 80,
    ...QUICK_MATH_THEME.textShadows.heavy,
    letterSpacing: 2,
  },
  correctAnswer: {
    color: QUICK_MATH_THEME.colors.success,
    textShadowColor: 'rgba(76, 175, 80, 0.5)',
  },
  wrongAnswer: {
    color: QUICK_MATH_THEME.colors.error,
    textShadowColor: 'rgba(244, 67, 54, 0.5)',
  },
  feedbackContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: QUICK_MATH_THEME.spacing.sm,
  },
  feedbackMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    ...QUICK_MATH_THEME.textShadows.medium,
    paddingHorizontal: QUICK_MATH_THEME.spacing.lg,
    borderRadius: QUICK_MATH_THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  correctFeedback: {
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(76, 175, 80, 0.6)',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  wrongFeedback: {
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(244, 67, 54, 0.6)',
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(244, 67, 54, 0.4)',
  },
}); 