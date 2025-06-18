import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ComboDisplayProps {
  combo: number;
  multiplier: number;
}

export const ComboDisplay = React.memo(({ combo, multiplier }: ComboDisplayProps) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  
  if (combo === 0) return null;

  return (
    <View style={[styles.comboContainer, { top: insets.top + 80 }]}>
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
});

ComboDisplay.displayName = 'ComboDisplay';

const styles = StyleSheet.create({
  comboContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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