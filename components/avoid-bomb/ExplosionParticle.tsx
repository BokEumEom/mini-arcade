import React, { useLayoutEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface ExplosionParticleProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const ExplosionParticle: React.FC<ExplosionParticleProps> = ({ 
  x, 
  y, 
  color, 
  onComplete 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete changes
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = 60 + Math.random() * 120;
    const targetX = Math.cos(randomAngle) * randomDistance;
    const targetY = Math.sin(randomAngle) * randomDistance;

    const animation = Animated.parallel([
      Animated.timing(translateX, {
        toValue: targetX,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: targetY,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      // 콜백을 안전하게 실행
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    });

    // Cleanup function
    return () => {
      animation.stop();
    };
  }, []); // Empty dependency array to run only once

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
    width: 6,
    height: 6,
    borderRadius: 3,
  },
}); 