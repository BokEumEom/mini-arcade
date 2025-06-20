import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    gap: 16,
    paddingHorizontal: 24,
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  key: {
    width: (SCREEN_WIDTH - 160) / 3,
    aspectRatio: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  deleteKey: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    borderColor: 'rgba(255, 152, 0, 0.5)',
  },
  enterKey: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  keyText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
}); 