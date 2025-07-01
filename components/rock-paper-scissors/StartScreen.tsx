import { COLORS } from '@/constants/pac-man/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const pulseAnimation = useSharedValue(0);
  const floatAnimation = useSharedValue(0);

  React.useEffect(() => {
    // 제목 맥박 효과
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // 버튼 부드러운 움직임
    floatAnimation.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const handleStart = () => {
    console.log('Start button clicked');
    onStart();
  };

  const titleStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.05]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [1, 0.8]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnimation.value, [0, 1], [0, -5]);
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, titleStyle]}>ROCK PAPER SCISSORS</Animated.Text>
      <Text style={styles.subtitle}>가위바위보로 승부를 겨루세요!</Text>
      
      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>게임 방법</Text>
        <Text style={styles.instructionText}>
          • 가위, 바위, 보 중 하나를 선택하세요
        </Text>
        <Text style={styles.instructionText}>
          • 컴퓨터와의 대결에서 승리하세요
        </Text>
        <Text style={styles.instructionText}>
          • 가위는 보를 이기고, 보는 바위를 이깁니다
        </Text>
        <Text style={styles.instructionText}>
          • 바위는 가위를 이기고, 같은 것은 비깁니다
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.PACMAN,
    marginBottom: 10,
    textShadowColor: COLORS.PACMAN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 60,
    opacity: 0.8,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.PACMAN,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 60,
    shadowColor: COLORS.PACMAN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  instructions: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PACMAN,
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 