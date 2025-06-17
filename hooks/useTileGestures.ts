import { useRef } from 'react';
import { PanResponder } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * 타일 게임의 제스처 및 애니메이션을 관리하는 커스텀 훅
 * @param moveTiles 타일 이동 함수
 * @returns 팬 제스처 핸들러와 애니메이션 스타일
 */
export const useTileGestures = (moveTiles: (direction: Direction) => void) => {
  // Shared values for animating the game container
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // 스프링 애니메이션 설정
  const springConfig = {
    damping: 10,
    stiffness: 100,
  };

  // 제스처 핸들러 생성
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Fix to prevent flickering
      onMoveShouldSetPanResponder: () => false,
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        
        // 제스처 방향 감지 및 타일 이동
        if (Math.abs(dx) > Math.abs(dy)) {
          // 수평 스와이프
          if (dx > 0) {
            moveTiles('right');
            translateX.value = withSpring(10, springConfig, () => (translateX.value = 0));
          } else {
            moveTiles('left');
            translateX.value = withSpring(-10, springConfig, () => (translateX.value = 0));
          }
        } else {
          // 수직 스와이프
          if (dy > 0) {
            moveTiles('down');
            translateY.value = withSpring(10, springConfig, () => (translateY.value = 0));
          } else {
            moveTiles('up');
            translateY.value = withSpring(-10, springConfig, () => (translateY.value = 0));
          }
        }
      },
    })
  ).current;

  // 애니메이션 스타일 정의
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value }, 
        { translateY: translateY.value }
      ],
    };
  });

  return { 
    panResponder, 
    animatedStyle 
  };
}; 