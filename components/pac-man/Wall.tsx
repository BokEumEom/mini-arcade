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

interface WallProps {
  size?: number;
}

export function Wall({ size = 16 }: WallProps) {
  const animatedValue = useSharedValue(0);
  
  React.useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [0.7, 1]);
    return {
      opacity,
    };
  });

  return (
    <View style={[styles.wallContainer, { width: size, height: size }]}>
      <Animated.View style={[styles.wall, animatedStyle]} />
      <View style={styles.brickPattern}>
        <View style={styles.brickRow}>
          <View style={styles.brick} />
          <View style={styles.brick} />
        </View>
        <View style={styles.brickRow}>
          <View style={styles.brick} />
          <View style={styles.brick} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wallContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  wall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.WALL,
    borderRadius: 2,
  },
  brickPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  brickRow: {
    flex: 1,
    flexDirection: 'row',
  },
  brick: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
  },
}); 