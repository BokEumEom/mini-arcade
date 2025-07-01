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

interface AvoidBombStartScreenProps {
  onStart: () => void;
  onExit: () => void;
  highScore: number;
}

export function AvoidBombStartScreen({ onStart, onExit, highScore }: AvoidBombStartScreenProps) {
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

  const handleExit = () => {
    console.log('Exit button clicked');
    onExit();
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
      <Animated.Text style={[styles.title, titleStyle]}>AVOID BOMB!</Animated.Text>
      <Text style={styles.subtitle}>폭탄을 피하고 별을 모으세요!</Text>
      
      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>
      </Animated.View>

      {highScore > 0 && (
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreText}>🏆 최고 점수: {highScore}</Text>
        </View>
      )}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>게임 방법</Text>
        <Text style={styles.instructionText}>
          • 💣 폭탄에 닿으면 게임 오버
        </Text>
        <Text style={styles.instructionText}>
          • 🍕 음식을 모아서 점수 획득
        </Text>
        <Text style={styles.instructionText}>
          • 🛡️ 방패 아이템으로 폭탄 한 번 막기
        </Text>
        <Text style={styles.instructionText}>
          • ⚡ 스피드 업으로 빠르게 이동
        </Text>
      </View>

      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.exitButtonText}>나가기</Text>
      </TouchableOpacity>
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
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.PACMAN,
    marginBottom: 10,
    textShadowColor: COLORS.PACMAN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 60,
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: COLORS.PACMAN,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 30,
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
  highScoreContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  highScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  instructions: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
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
  exitButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
}); 