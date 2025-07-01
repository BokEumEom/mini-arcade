import { IconSymbol } from '@/components/ui/IconSymbol';
import { COLORS } from '@/constants/pac-man/constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface GhostProps {
  color: string;
  isFrightened: boolean;
  size?: number;
  position?: { x: number; y: number };
}

export function Ghost({ color, isFrightened, size = 16, position }: GhostProps) {
  const ghostColor = isFrightened ? COLORS.GHOST_FRIGHTENED : color;
  const iconSize = size * 0.8;
  
  // 애니메이션 값들
  const floatAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const frightenedAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    // 부드러운 위아래 움직임
    floatAnimation.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // 맥박 효과
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // 겁에 질렸을 때 깜빡임
    if (isFrightened) {
      frightenedAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 200 })
        ),
        -1
      );
    } else {
      frightenedAnimation.value = 0;
    }
  }, [isFrightened]);
  
  const floatStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnimation.value, [0, 1], [0, -2]);
    return {
      transform: [{ translateY }],
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.05]);
    return {
      transform: [{ scale }],
    };
  });
  
  const frightenedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(frightenedAnimation.value, [0, 1], [1, 0.3]);
    return {
      opacity,
    };
  });
  
  return (
    <View style={[styles.ghost, { width: size, height: size }]}>
      <Animated.View style={[floatStyle, pulseStyle, frightenedStyle]}>
        <IconSymbol 
          name="ghost" 
          size={iconSize} 
          color={ghostColor}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ghost: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 