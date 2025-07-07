import { COLORS } from '@/constants/pac-man/constants';
import { Clock, Cpu, Target, Trophy, Users, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { GomokuExitModal } from './GomokuExitModal';
import { GameMode, GomokuStartScreenProps } from './types';

export function GomokuStartScreen({ onStart, onExit, highScore }: GomokuStartScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('human-vs-human');
  const [showExitModal, setShowExitModal] = useState(false);
  const pulseAnimation = useSharedValue(0);
  const floatAnimation = useSharedValue(0);

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

  const handleStart = () => {
    onStart(selectedMode);
  };

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  const handleExitConfirm = () => {
    onExit();
    setShowExitModal(false);
  };

  const getModeIcon = (mode: GameMode) => {
    switch (mode) {
      case 'human-vs-human':
        return <Users size={20} color="#4CAF50" />;
      case 'human-vs-cpu':
        return <Cpu size={20} color="#FF9800" />;
      case 'cpu-vs-cpu':
        return <Cpu size={20} color="#2196F3" />;
    }
  };

  const getModeText = (mode: GameMode) => {
    switch (mode) {
      case 'human-vs-human':
        return '사람 vs 사람';
      case 'human-vs-cpu':
        return '사람 vs 컴퓨터';
      case 'cpu-vs-cpu':
        return '컴퓨터 vs 컴퓨터';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.exitButton} onPress={handleExitClick}>
        <View style={styles.exitButtonBackground}>
          <X size={20} color="#FFF" />
        </View>
      </TouchableOpacity>

      <Animated.Text style={[styles.title, titleStyle]}>오목</Animated.Text>
      <Text style={styles.subtitle}>전략적 두뇌 게임</Text>
      
      <View style={styles.modeSelection}>
        <Text style={styles.modeTitle}>게임 모드 선택</Text>
        {(['human-vs-human', 'human-vs-cpu', 'cpu-vs-cpu'] as GameMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeButton,
              selectedMode === mode && styles.selectedModeButton
            ]}
            onPress={() => setSelectedMode(mode)}
          >
            <View style={styles.modeButtonContent}>
              {getModeIcon(mode)}
              <Text style={[
                styles.modeButtonText,
                selectedMode === mode && styles.selectedModeButtonText
              ]}>
                {getModeText(mode)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>게임 시작</Text>
        </TouchableOpacity>
      </Animated.View>

      {highScore > 0 && (
        <View style={styles.highScoreContainer}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.highScoreText}>최고 점수: {highScore}</Text>
        </View>
      )}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>게임 방법</Text>
        <View style={styles.instructionItem}>
          <Target size={16} color="#4CAF50" />
          <Text style={styles.instructionText}>5목을 연속으로 놓으면 승리</Text>
        </View>
        <View style={styles.instructionItem}>
          <Users size={16} color="#FFD700" />
          <Text style={styles.instructionText}>흑돌과 백돌을 번갈아가며 착수</Text>
        </View>
        <View style={styles.instructionItem}>
          <Zap size={16} color="#FF9800" />
          <Text style={styles.instructionText}>상대방의 4목을 막고 공격하세요</Text>
        </View>
        <View style={styles.instructionItem}>
          <Clock size={16} color="#2196F3" />
          <Text style={styles.instructionText}>전략적 사고로 승리를 노려보세요</Text>
        </View>
      </View>

      {showExitModal && (
        <GomokuExitModal
          onConfirm={handleExitConfirm}
          onCancel={handleExitCancel}
        />
      )}
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
    marginBottom: 30,
    opacity: 0.8,
  },
  modeSelection: {
    width: '100%',
    marginBottom: 30,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  modeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedModeButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    borderColor: '#FFC107',
  },
  modeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedModeButtonText: {
    color: '#FFC107',
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
    marginLeft: 8,
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
    color: COLORS.PACMAN,
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 8,
    lineHeight: 20,
  },
  exitButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  exitButtonBackground: {
    width: 44,
    height: 44,
    backgroundColor: 'transparent',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PACMAN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.PACMAN,
  },
}); 