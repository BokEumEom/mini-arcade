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

interface PowerPelletProps {
  size?: number;
}

export function PowerPellet({ size = 16 }: PowerPelletProps) {
  const pelletSize = size * 0.4;
  const rotationAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    // 회전 애니메이션
    rotationAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1
    );
    
    // 맥박 애니메이션
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotationAnimation.value, [0, 1], [0, 360]);
    const scale = interpolate(pulseAnimation.value, [0, 1], [0.8, 1.2]);
    return {
      transform: [{ rotate: `${rotate}deg` }, { scale }],
    };
  });
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View 
        style={[
          styles.powerPellet, 
          { 
            width: pelletSize, 
            height: pelletSize, 
            borderRadius: pelletSize / 2 
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
  powerPellet: {
    backgroundColor: COLORS.POWER_PELLET,
  },
}); 