import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Problem } from './types';

interface ProblemDisplayProps {
  currentProblem: Problem | null;
  userAnswer: string;
  isCorrect: boolean | null;
  feedbackMessage: string;
  problemAnimatedStyle: any;
  answerAnimatedStyle: any;
  specialEffectAnimatedStyle: any;
}

export const ProblemDisplay = React.memo(({
  currentProblem,
  userAnswer,
  isCorrect,
  feedbackMessage,
  problemAnimatedStyle,
  answerAnimatedStyle,
  specialEffectAnimatedStyle,
}: ProblemDisplayProps) => {
  return (
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
    </Animated.View>
  );
});

ProblemDisplay.displayName = 'ProblemDisplay';

const styles = StyleSheet.create({
  problemContainer: {
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  problem: {
    color: '#fff',
    fontSize: 46,
    fontWeight: 'bold',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  specialProblem: {
    color: '#FFD700',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  answer: {
    color: '#FFD700',
    fontSize: 60,
    fontWeight: 'bold',
    minHeight: 80,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 2,
  },
  correctAnswer: {
    color: '#4CAF50',
    textShadowColor: 'rgba(76, 175, 80, 0.5)',
  },
  wrongAnswer: {
    color: '#F44336',
    textShadowColor: 'rgba(244, 67, 54, 0.5)',
  },
  feedbackContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  feedbackMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
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