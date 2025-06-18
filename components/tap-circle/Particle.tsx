import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
}

export const Particle = React.memo(({ x, y, color }: ParticleProps) => {
  const progress = useSharedValue(0);
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 50;

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease)
    });
  }, []);

  const style = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, Math.cos(angle) * distance]
    );
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [0, Math.sin(angle) * distance]
    );
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [1, 0]
    );
    const scale = interpolate(
      progress.value,
      [0, 1],
      [1, 0]
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { scale }
      ],
      opacity
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          backgroundColor: color
        },
        style
      ]}
    />
  );
});

Particle.displayName = 'Particle';

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 