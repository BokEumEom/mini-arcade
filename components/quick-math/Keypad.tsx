import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QUICK_MATH_THEME } from '../../constants/quick-math/gameTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface KeypadProps {
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onEnter: () => void;
}

export const Keypad = React.memo(({ onNumberPress, onDelete, onEnter }: KeypadProps) => {
  const handleKeyPress = (num: string) => {
    onNumberPress(num);
  };

  return (
    <View style={styles.keypad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <TouchableOpacity
          key={num}
          style={styles.key}
          onPress={() => handleKeyPress(num.toString())}
          activeOpacity={0.8}
        >
          <Text style={styles.keyText}>{num}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.key}
        onPress={() => handleKeyPress('0')}
        activeOpacity={0.8}
      >
        <Text style={styles.keyText}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.key, styles.deleteKey]} 
        onPress={onDelete}
        activeOpacity={0.8}
      >
        <Text style={styles.keyText}>⌫</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.key, styles.enterKey]} 
        onPress={onEnter}
        activeOpacity={0.8}
      >
        <Text style={styles.keyText}>✓</Text>
      </TouchableOpacity>
    </View>
  );
});

Keypad.displayName = 'Keypad';

const styles = StyleSheet.create({
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: QUICK_MATH_THEME.spacing.lg,
    paddingHorizontal: QUICK_MATH_THEME.spacing.xxl,
    marginTop: QUICK_MATH_THEME.spacing.xl,
    backgroundColor: QUICK_MATH_THEME.colors.backgroundTertiary,
    borderRadius: QUICK_MATH_THEME.borderRadius.xl,
    paddingVertical: QUICK_MATH_THEME.spacing.xxl,
    borderWidth: 1,
    borderColor: QUICK_MATH_THEME.colors.border,
    ...QUICK_MATH_THEME.shadows.medium,
  },
  key: {
    width: (SCREEN_WIDTH - 160) / 3,
    aspectRatio: 1.5,
    backgroundColor: QUICK_MATH_THEME.colors.backgroundSecondary,
    borderRadius: QUICK_MATH_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...QUICK_MATH_THEME.shadows.light,
    borderWidth: 1,
    borderColor: QUICK_MATH_THEME.colors.borderAccent,
  },
  deleteKey: {
    backgroundColor: QUICK_MATH_THEME.colors.deleteKey,
    borderColor: QUICK_MATH_THEME.colors.deleteKeyBorder,
  },
  enterKey: {
    backgroundColor: QUICK_MATH_THEME.colors.enterKey,
    borderColor: QUICK_MATH_THEME.colors.enterKeyBorder,
  },
  keyText: {
    color: QUICK_MATH_THEME.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    ...QUICK_MATH_THEME.textShadows.medium,
  },
}); 