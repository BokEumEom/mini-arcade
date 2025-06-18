import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface ScorePopupProps {
  score: number;
  x: number;
  y: number;
}

export const ScorePopup = React.memo(({ score, x, y }: ScorePopupProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease)
      }),
      withDelay(
        200,
        withTiming(0, {
          duration: 200,
          easing: Easing.in(Easing.ease)
        })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [0, -50]
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.8, 1],
      [0, 1, 0]
    );
    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.5, 1.2, 1]
    );

    return {
      transform: [
        { translateY },
        { scale }
      ],
      opacity
    };
  });

  return (
    <Animated.Text
      style={[
        styles.scorePopup,
        {
          left: x,
          top: y,
          color: score > 0 ? '#4CAF50' : '#F44336'
        },
        style
      ]}
    >
      {score > 0 ? `+${score}` : score}
    </Animated.Text>
  );
});

ScorePopup.displayName = 'ScorePopup';

const styles = StyleSheet.create({
  scorePopup: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 