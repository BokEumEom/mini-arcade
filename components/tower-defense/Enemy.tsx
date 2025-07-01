import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ENEMY_CONFIGS, Enemy as EnemyType } from '../../types/games/variants/tower-defense';

interface EnemyProps {
  enemy: EnemyType;
  isDamaged: boolean;
}

export function Enemy({ enemy, isDamaged }: EnemyProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const damageGlow = useSharedValue(0);
  const bounceY = useSharedValue(0);

  const config = ENEMY_CONFIGS[enemy.type];
  const healthPercentage = enemy.health / enemy.maxHealth;

  const enemyStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateY: bounceY.value },
      ],
    };
  });

  const damageStyle = useAnimatedStyle(() => {
    return {
      opacity: damageGlow.value,
    };
  });

  // Walking animation
  useEffect(() => {
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Damage animation
  useEffect(() => {
    if (isDamaged) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 100, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 100, easing: Easing.out(Easing.ease) })
      );
      
      rotation.value = withSequence(
        withTiming(15, { duration: 100, easing: Easing.out(Easing.ease) }),
        withTiming(-15, { duration: 100, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 100, easing: Easing.out(Easing.ease) })
      );

      damageGlow.value = withSequence(
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
      );
    }
  }, [isDamaged]);

  return (
    <View style={styles.container}>
      {/* Damage glow effect */}
      <Animated.View
        style={[
          styles.damageGlow,
          {
            left: enemy.position.x - 20,
            top: enemy.position.y - 20,
            backgroundColor: '#FF4444',
          },
          damageStyle,
        ]}
      />
      
      {/* Enemy */}
      <Animated.View
        style={[
          styles.enemy,
          {
            left: enemy.position.x - 15,
            top: enemy.position.y - 15,
          },
          enemyStyle,
        ]}
      >
        <Text style={styles.enemyIcon}>{config.icon}</Text>
        
        {/* Health bar */}
        <View style={styles.healthBar}>
          <View
            style={[
              styles.healthFill,
              {
                width: `${healthPercentage * 100}%`,
                backgroundColor: healthPercentage > 0.5 ? '#4CAF50' : healthPercentage > 0.25 ? '#FF9800' : '#F44336',
              },
            ]}
          />
        </View>
        
        {/* Health text */}
        <Text style={styles.healthText}>
          {enemy.health}/{enemy.maxHealth}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  damageGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0,
  },
  enemy: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enemyIcon: {
    fontSize: 24,
  },
  healthBar: {
    position: 'absolute',
    top: -8,
    left: -5,
    right: -5,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 2,
  },
  healthFill: {
    height: '100%',
    borderRadius: 2,
  },
  healthText: {
    position: 'absolute',
    bottom: -20,
    left: -5,
    right: -5,
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
}); 