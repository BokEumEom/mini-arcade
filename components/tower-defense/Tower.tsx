import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { TOWER_CONFIGS, Tower as TowerType } from '../../types/games/variants/tower-defense';

interface TowerProps {
  tower: TowerType;
  isAttacking: boolean;
}

export function Tower({ tower, isAttacking }: TowerProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const config = TOWER_CONFIGS[tower.type];

  const towerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  useEffect(() => {
    if (isAttacking) {
      // Attack animation
      scale.value = withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
      );
      
      rotation.value = withSequence(
        withTiming(10, { duration: 100, easing: Easing.out(Easing.ease) }),
        withTiming(-10, { duration: 100, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 100, easing: Easing.out(Easing.ease) })
      );

      // Glow effect
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
      );
    }
  }, [isAttacking]);

  return (
    <View style={styles.container}>
      {/* Attack glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            backgroundColor: config.color,
            left: tower.position.x - 30,
            top: tower.position.y - 30,
          },
          glowStyle,
        ]}
      />
      
      {/* Tower range indicator */}
      <View
        style={[
          styles.towerRange,
          {
            left: tower.position.x - tower.range,
            top: tower.position.y - tower.range,
            width: tower.range * 2,
            height: tower.range * 2,
            borderColor: config.color,
          },
        ]}
      />
      
      {/* Tower */}
      <Animated.View
        style={[
          styles.tower,
          {
            left: tower.position.x - 20,
            top: tower.position.y - 20,
            backgroundColor: config.color,
          },
          towerStyle,
        ]}
      >
        <Text style={styles.towerIcon}>{config.icon}</Text>
        <Text style={styles.towerLevel}>{tower.level}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  glowEffect: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0,
  },
  towerRange: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tower: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  towerIcon: {
    fontSize: 20,
  },
  towerLevel: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFF',
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
}); 