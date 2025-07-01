import { COLORS, Direction } from '@/constants/pac-man/constants';
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

interface PacmanProps {
  size?: number;
  direction?: Direction;
}

export function Pacman({ size = 16, direction = 'RIGHT' }: PacmanProps) {
  const pacmanSize = size * 0.8;
  
  // 애니메이션 값들
  const pulseAnimation = useSharedValue(0);
  const moveAnimation = useSharedValue(0);
  const mouthAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    // 맥박 효과
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // 움직임 효과
    moveAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1
    );

    // 입 벌리기 효과
    mouthAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 200 })
      ),
      -1
    );
  }, []);
  
  // 방향에 따른 회전 각도
  const getRotation = () => {
    switch (direction) {
      case 'UP': return '270deg';
      case 'DOWN': return '90deg';
      case 'LEFT': return '180deg';
      case 'RIGHT': return '0deg';
      default: return '0deg';
    }
  };

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.1]);
    return {
      transform: [{ scale }],
    };
  });
  
  const moveStyle = useAnimatedStyle(() => {
    const translateY = interpolate(moveAnimation.value, [0, 1], [0, -1]);
    return {
      transform: [{ translateY }],
    };
  });

  const mouthStyle = useAnimatedStyle(() => {
    const mouthOpen = interpolate(mouthAnimation.value, [0, 1], [0.3, 0.7]);
    return {
      transform: [{ scale: mouthOpen }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[
        styles.pacmanContainer, 
        { 
          width: pacmanSize, 
          height: pacmanSize,
          transform: [{ rotate: getRotation() }]
        },
        pulseStyle,
        moveStyle
      ]}>
        <View style={[styles.pacman, { width: pacmanSize, height: pacmanSize }]}>
          <Animated.View style={[styles.mouth, mouthStyle]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pacmanContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pacman: {
    backgroundColor: COLORS.PACMAN,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mouth: {
    width: '60%',
    height: '60%',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 50,
  },
}); 