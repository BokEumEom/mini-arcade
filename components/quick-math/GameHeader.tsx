import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { QUICK_MATH_THEME } from '../../constants/quick-math/gameTheme';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  combo: number;
  bonusTime: number;
  comboAnimatedStyle: any;
}

export const GameHeader = React.memo(({ 
  score, 
  timeLeft, 
  combo, 
  bonusTime, 
  comboAnimatedStyle 
}: GameHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{timeLeft}s</Text>
        {bonusTime > 0 && (
          <Text style={styles.bonusTime}>+{bonusTime}s</Text>
        )}
      </View>
      <Animated.View style={[styles.comboContainer, comboAnimatedStyle]}>
        <Text style={styles.comboLabel}>Combo</Text>
        <Text style={styles.combo}>{combo}x</Text>
      </Animated.View>
    </View>
  );
});

GameHeader.displayName = 'GameHeader';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: QUICK_MATH_THEME.spacing.sm,
    paddingHorizontal: QUICK_MATH_THEME.spacing.xl,
    paddingTop: 50,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: QUICK_MATH_THEME.colors.background,
    paddingHorizontal: QUICK_MATH_THEME.spacing.lg,
    paddingVertical: QUICK_MATH_THEME.spacing.md,
    borderRadius: QUICK_MATH_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: QUICK_MATH_THEME.colors.border,
  },
  scoreLabel: {
    color: QUICK_MATH_THEME.colors.text,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: QUICK_MATH_THEME.spacing.xs,
    fontWeight: '600',
  },
  score: {
    color: QUICK_MATH_THEME.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    ...QUICK_MATH_THEME.textShadows.medium,
  },
  timerContainer: {
    backgroundColor: QUICK_MATH_THEME.colors.backgroundSecondary,
    paddingHorizontal: QUICK_MATH_THEME.spacing.xl,
    paddingVertical: QUICK_MATH_THEME.spacing.md,
    borderRadius: QUICK_MATH_THEME.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: QUICK_MATH_THEME.colors.borderAccent,
    ...QUICK_MATH_THEME.shadows.medium,
  },
  timer: {
    color: QUICK_MATH_THEME.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    ...QUICK_MATH_THEME.textShadows.medium,
  },
  bonusTime: {
    color: QUICK_MATH_THEME.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: QUICK_MATH_THEME.spacing.xs,
    ...QUICK_MATH_THEME.textShadows.light,
  },
  comboContainer: {
    alignItems: 'center',
    backgroundColor: QUICK_MATH_THEME.colors.background,
    paddingHorizontal: QUICK_MATH_THEME.spacing.lg,
    paddingVertical: QUICK_MATH_THEME.spacing.md,
    borderRadius: QUICK_MATH_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: QUICK_MATH_THEME.colors.border,
  },
  comboLabel: {
    color: QUICK_MATH_THEME.colors.primary,
    fontSize: 12,
    opacity: 0.9,
    marginBottom: QUICK_MATH_THEME.spacing.xs,
    fontWeight: '600',
  },
  combo: {
    color: QUICK_MATH_THEME.colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    ...QUICK_MATH_THEME.textShadows.medium,
  },
}); 