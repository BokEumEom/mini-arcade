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

export type GameMode = 'easy' | 'normal' | 'hard';

interface GameModeConfig {
  width: number;
  height: number;
  mineCount: number;
  title: string;
  description: string;
  color: string;
}

const GAME_MODES: Record<GameMode, GameModeConfig> = {
  easy: {
    width: 8,
    height: 12,
    mineCount: 10,
    title: '쉬움',
    description: '8x12 보드, 10개 지뢰',
    color: '#4CAF50',
  },
  normal: {
    width: 12,
    height: 18,
    mineCount: 40,
    title: '보통',
    description: '12x18 보드, 40개 지뢰',
    color: '#FF9800',
  },
  hard: {
    width: 15,
    height: 22,
    mineCount: 99,
    title: '어려움',
    description: '15x22 보드, 99개 지뢰',
    color: '#F44336',
  },
};

interface ModeSelectionScreenProps {
  onModeSelect: (mode: GameMode) => void;
  onBack: () => void;
}

export function ModeSelectionScreen({ onModeSelect, onBack }: ModeSelectionScreenProps) {
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

  const titleStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.05]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [1, 0.8]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnimation.value, [0, 1], [0, -3]);
    return {
      transform: [{ translateY }],
    };
  });

  const handleModeSelect = (mode: GameMode) => {
    console.log('Mode selected:', mode);
    onModeSelect(mode);
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, titleStyle]}>난이도 선택</Animated.Text>
      <Text style={styles.subtitle}>원하는 난이도를 선택하세요</Text>
      
      <View style={styles.modeContainer}>
        {Object.entries(GAME_MODES).map(([mode, config]) => (
          <Animated.View key={mode} style={[styles.modeButton, buttonStyle]}>
            <TouchableOpacity
              style={[styles.modeTouchable, { backgroundColor: config.color }]}
              onPress={() => handleModeSelect(mode as GameMode)}
              activeOpacity={0.8}
            >
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>{config.title}</Text>
                <Text style={styles.modeDescription}>{config.description}</Text>
                <View style={styles.modeStats}>
                  <Text style={styles.modeStatsText}>보드: {config.width}x{config.height}</Text>
                  <Text style={styles.modeStatsText}>지뢰: {config.mineCount}개</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>뒤로 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0c0c0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 10,
    textShadowColor: '#000080',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 50,
    opacity: 0.8,
    textAlign: 'center',
  },
  modeContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  modeButton: {
    width: '100%',
  },
  modeTouchable: {
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modeContent: {
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 12,
    opacity: 0.9,
  },
  modeStats: {
    flexDirection: 'row',
    gap: 20,
  },
  modeStatsText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  backButton: {
    backgroundColor: '#c0c0c0',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
}); 