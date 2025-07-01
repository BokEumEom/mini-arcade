import React, { useLayoutEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface ScreenShakeProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({ isActive, children }) => {
  const shakeValue = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    if (isActive) {
      // 화면 흔들림 애니메이션
      const shakeAnimation = Animated.sequence([
        Animated.timing(shakeValue, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeValue, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeValue, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeValue, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeValue, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeValue, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeValue, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]);

      shakeAnimation.start();

      // Cleanup function
      return () => {
        shakeAnimation.stop();
      };
    }
  }, [isActive, shakeValue]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: shakeValue }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 