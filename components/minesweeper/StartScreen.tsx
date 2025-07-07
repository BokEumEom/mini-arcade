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
  onModeSelect: () => void;
  onExit: () => void;
  highScore: number;
}

export function StartScreen({ onModeSelect, onExit, highScore }: StartScreenProps) {
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

  const handleModeSelect = () => {
    console.log('Mode select button clicked');
    onModeSelect();
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
      <Animated.Text style={[styles.title, titleStyle]}>지뢰찾기</Animated.Text>
      <Text style={styles.subtitle}>지뢰를 피해서 모든 안전한 칸을 열어보세요</Text>
      
      <View style={styles.highScoreContainer}>
        <Text style={styles.highScoreText}>🏆 최고 기록: {highScore}초</Text>
      </View>
      
      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.startButton} onPress={handleModeSelect}>
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>게임 방법</Text>
        <Text style={styles.instructionText}>
          • 터치하여 셀을 열어보세요
        </Text>
        <Text style={styles.instructionText}>
          • 숫자는 주변 지뢰의 개수입니다
        </Text>
        <Text style={styles.instructionText}>
          • 길게 터치하여 깃발을 놓으세요
        </Text>
        <Text style={styles.instructionText}>
          • 지뢰를 피해 모든 안전한 칸을 열면 승리!
        </Text>
        <Text style={styles.instructionText}>
          • 난이도를 선택하여 게임을 시작하세요
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>나가기</Text>
        </TouchableOpacity>
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#95E1D3',
    marginBottom: 10,
    textShadowColor: '#95E1D3',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 30,
    opacity: 0.8,
    textAlign: 'center',
  },
  highScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  startButton: {
    backgroundColor: '#95E1D3',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#95E1D3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
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
    color: '#95E1D3',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  exitButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
}); 