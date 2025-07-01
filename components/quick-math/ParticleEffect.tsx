import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { QUICK_MATH_THEME } from '../../constants/quick-math/gameTheme';

interface ParticleEffectProps {
  isVisible: boolean;
  isCorrect: boolean;
  onAnimationComplete?: () => void;
}

export const ParticleEffect = React.memo(({ 
  isVisible, 
  isCorrect, 
  onAnimationComplete 
}: ParticleEffectProps) => {
  const containerOpacity = useSharedValue(0);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    console.log('=== ParticleEffect: useEffect triggered ===');
    console.log('isVisible:', isVisible);
    console.log('isCorrect:', isCorrect);
    
    if (isVisible) {
      console.log('=== ParticleEffect: Starting animation ===');
      // 컨테이너 페이드 인
      containerOpacity.value = withTiming(1, { duration: 200 });
      
      // 애니메이션 진행도 시작
      animationProgress.value = withTiming(1, { 
        duration: isCorrect ? 1200 : 800 
      }, () => {
        console.log('=== ParticleEffect: Animation completed ===');
        // 애니메이션 완료 후 페이드 아웃
        containerOpacity.value = withTiming(0, { duration: 300 }, () => {
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        });
      });
    }
  }, [isVisible]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  // 정답/오답에 따른 색상
  const particleColor = isCorrect ? QUICK_MATH_THEME.colors.success : QUICK_MATH_THEME.colors.error;

  const ParticleComponent = ({ index }: { index: number }) => {
    const particleAnimatedStyle = useAnimatedStyle(() => {
      const progress = animationProgress.value;
      
      // 파티클 이동 애니메이션
      const angle = (Math.PI * 2 * index) / (isCorrect ? 15 : 10);
      const speed = 200 + index * 20;
      const distance = interpolate(progress, [0, 1], [0, speed], 'clamp');
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      // 투명도 애니메이션
      const opacity = interpolate(progress, [0, 0.7, 1], [1, 1, 0], 'clamp');
      
      // 스케일 애니메이션
      const scale = interpolate(progress, [0, 0.3, 1], [0, 1, 0.5], 'clamp');

      return {
        transform: [
          { translateX: x },
          { translateY: y },
          { scale },
        ],
        opacity,
      };
    });

    return (
      <Animated.View style={[styles.particle, particleAnimatedStyle]}>
        <View style={[styles.circle, { backgroundColor: particleColor }]} />
      </Animated.View>
    );
  };

  if (!isVisible) {
    console.log('=== ParticleEffect: Not visible, returning null ===');
    return null;
  }

  const particleCount = isCorrect ? 15 : 10;
  console.log('=== ParticleEffect: Rendering particles ===');
  console.log('Particle count:', particleCount);
  console.log('Particle color:', particleColor);

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {Array.from({ length: particleCount }, (_, index) => (
        <ParticleComponent key={index} index={index} />
      ))}
    </Animated.View>
  );
});

ParticleEffect.displayName = 'ParticleEffect';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    ...QUICK_MATH_THEME.shadows.light,
  },
}); 