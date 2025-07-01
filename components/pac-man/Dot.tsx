import { COLORS } from '@/constants/pac-man/constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

interface DotProps {
  size?: number;
}

export function Dot({ size = 16 }: DotProps) {
  const dotSize = size * 0.2;
  const pulseAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.6, 1]);
    const scale = interpolate(pulseAnimation.value, [0, 1], [0.8, 1]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View 
        style={[
          styles.dot, 
          { 
            width: dotSize, 
            height: dotSize, 
            borderRadius: dotSize / 2 
          },
          animatedStyle
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: COLORS.DOT,
  },
}); 