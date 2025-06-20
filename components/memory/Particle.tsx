import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const Particle: React.FC<ParticleProps> = ({ x, y, color, onComplete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = 50 + Math.random() * 100;
    const targetX = Math.cos(randomAngle) * randomDistance;
    const targetY = Math.sin(randomAngle) * randomDistance;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: targetX,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: targetY,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          left: x,
          top: y,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 