import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface DamageEffectProps {
  damage: number;
  position: { x: number; y: number };
  onComplete: () => void;
}

export function DamageEffect({ damage, position, onComplete }: DamageEffectProps) {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  useEffect(() => {
    // Animate the damage effect
    opacity.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(-60, { duration: 1000, easing: Easing.out(Easing.ease) });
    scale.value = withSequence(
      withTiming(1.3, { duration: 200, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) })
    );

    // Clean up after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Animated.Text
      style={[
        styles.damageText,
        {
          left: position.x,
          top: position.y - 20,
        },
        animatedStyle,
      ]}
    >
      -{damage}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  damageText: {
    position: 'absolute',
    color: '#FF4444',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    zIndex: 1000,
  },
}); 