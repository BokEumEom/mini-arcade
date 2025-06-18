import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GameEffectsProps {
  isDoubleScore: boolean;
  isSlowMotion: boolean;
}

export const GameEffects = React.memo(({ isDoubleScore, isSlowMotion }: GameEffectsProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  if (!isDoubleScore && !isSlowMotion) return null;

  return (
    <View style={[styles.effectsContainer, { top: insets.top + 80 }]}>
      {isDoubleScore && (
        <View style={styles.effectBadge}>
          <MaterialCommunityIcons name="multiplication" size={20} color="#FF9800" />
          <Text style={styles.effectText}>2x 점수</Text>
        </View>
      )}
      {isSlowMotion && (
        <View style={styles.effectBadge}>
          <MaterialCommunityIcons name="timer" size={20} color="#2196F3" />
          <Text style={styles.effectText}>슬로우 모션</Text>
        </View>
      )}
    </View>
  );
});

GameEffects.displayName = 'GameEffects';

const styles = StyleSheet.create({
  effectsContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  effectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  effectText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
}); 