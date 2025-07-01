import React, { useLayoutEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface ScorePopupProps {
  score: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ 
  score, 
  x, 
  y, 
  onComplete 
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete changes
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const animation = Animated.sequence([
      // 팝업 나타나기
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // 잠시 대기
      Animated.delay(300),
      // 사라지기
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
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
        styles.container,
        {
          left: x,
          top: y,
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      <Text style={styles.scoreText}>+{score}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 