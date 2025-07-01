import { useThemeColor } from '@/hooks/useThemeColor';
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

interface GomokuStartScreenProps {
  onStart: () => void;
}

export function GomokuStartScreen({ onStart }: GomokuStartScreenProps) {
  const pulseAnimation = useSharedValue(0);
  const floatAnimation = useSharedValue(0);
  
  const backgroundColor = useThemeColor({}, 'background') as string;
  const textColor = useThemeColor({}, 'text') as string;
  const primaryColor = '#8B4513';

  React.useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    floatAnimation.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

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
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.Text style={[styles.title, titleStyle, { color: primaryColor }]}>
        오목
      </Animated.Text>
      <Text style={[styles.subtitle, { color: textColor }]}>
        전략적 두뇌 게임
      </Text>
      
      <Animated.View style={buttonStyle}>
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: primaryColor }]} 
          onPress={onStart}
        >
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={[styles.instructions, { borderColor: primaryColor }]}>
        <Text style={[styles.instructionTitle, { color: primaryColor }]}>
          게임 방법
        </Text>
        <Text style={[styles.instructionText, { color: textColor }]}>
          • 흑돌과 백돌을 번갈아가며 착수하세요
        </Text>
        <Text style={[styles.instructionText, { color: textColor }]}>
          • 가로, 세로, 대각선으로 5개를 연속으로 놓으면 승리
        </Text>
        <Text style={[styles.instructionText, { color: textColor }]}>
          • 상대방의 4목을 막고 자신의 4목을 만드세요
        </Text>
        <Text style={[styles.instructionText, { color: textColor }]}>
          • 전략적 사고로 승리를 노려보세요
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 60,
    opacity: 0.8,
  },
  startButton: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 60,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  instructions: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
}); 