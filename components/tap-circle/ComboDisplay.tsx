import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ComboDisplayProps {
  combo: number;
  multiplier: number;
}

export const ComboDisplay = ({ combo, multiplier }: ComboDisplayProps) => {
  if (combo === 0) return null;

  return (
    <View style={styles.comboContainer}>
      <Text style={styles.comboText}>
        {combo} Combo!
      </Text>
      {multiplier > 1 && (
        <Text style={styles.multiplierText}>
          x{multiplier}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  comboContainer: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    alignItems: 'center',
  },
  comboText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  multiplierText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 