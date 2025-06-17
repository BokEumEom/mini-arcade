import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameEffectsProps {
  isDoubleScore: boolean;
  isSlowMotion: boolean;
}

export const GameEffects = ({ isDoubleScore, isSlowMotion }: GameEffectsProps) => {
  if (!isDoubleScore && !isSlowMotion) return null;

  return (
    <View style={styles.effectsContainer}>
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
};

const styles = StyleSheet.create({
  effectsContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  effectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  },
}); 