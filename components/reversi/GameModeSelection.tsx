import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { AIPlayerType } from '@/hooks/useReversiGame';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameModeSelectionProps {
  selectedMode: { singlePlayer: boolean; aiAs: AIPlayerType };
  onModeSelect: (singlePlayer: boolean, aiAs: AIPlayerType) => void;
  onStartGame: () => void;
}

// 최적화된 애니메이션 버튼 컴포넌트
const AnimatedButton = ({ 
  onPress, 
  isSelected, 
  children,
  testID
}: { 
  onPress: () => void; 
  isSelected: boolean; 
  children: React.ReactNode;
  testID?: string;
}) => {
  const scale = useSharedValue(1);
  
  // 더 빠른 애니메이션 설정
  const handlePressIn = () => {
    scale.value = withTiming(0.95, { 
      duration: 50,  // 더 짧은 시간
      easing: Easing.linear  // 선형 이징으로 단순화
    });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { 
      duration: 50,  // 더 짧은 시간
      easing: Easing.linear  // 선형 이징으로 단순화
    });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isSelected ? '#3CB371' : '#2E8B57',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      marginVertical: 10,
      width: SCREEN_WIDTH * 0.8,
      elevation: 4,
    };
  });
  
  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
      // 터치 반응성 향상을 위한 설정
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      pressRetentionOffset={{ top: 10, bottom: 10, left: 10, right: 10 }}
      delayPressIn={0}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const GameModeSelection: React.FC<GameModeSelectionProps> = ({
  selectedMode,
  onModeSelect,
  onStartGame,
}) => {
  // 메모이제이션된 콜백 함수
  const handlePlayAsWhite = useCallback(() => {
    onModeSelect(true, 'black');
  }, [onModeSelect]);

  const handlePlayAsBlack = useCallback(() => {
    onModeSelect(true, 'white');
  }, [onModeSelect]);

  const handleTwoPlayers = useCallback(() => {
    onModeSelect(false, null);
  }, [onModeSelect]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Othello</Text>
      <Text style={styles.subtitle}>Choose Game Mode</Text>

      <AnimatedButton
        isSelected={selectedMode.singlePlayer && selectedMode.aiAs === 'black'}
        onPress={handlePlayAsWhite}
        testID="play-as-white-button"
      >
        <Text style={styles.buttonText}>Play Against AI (You: White)</Text>
      </AnimatedButton>

      <AnimatedButton
        isSelected={selectedMode.singlePlayer && selectedMode.aiAs === 'white'}
        onPress={handlePlayAsBlack}
        testID="play-as-black-button"
      >
        <Text style={styles.buttonText}>Play Against AI (You: Black)</Text>
      </AnimatedButton>

      <AnimatedButton
        isSelected={!selectedMode.singlePlayer}
        onPress={handleTwoPlayers}
        testID="two-players-button"
      >
        <Text style={styles.buttonText}>Two Players</Text>
      </AnimatedButton>

      <TouchableOpacity 
        style={styles.startButton} 
        onPress={onStartGame} 
        activeOpacity={0.7}
        testID="start-game-button"
        // 터치 반응성 향상을 위한 설정
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        pressRetentionOffset={{ top: 10, bottom: 10, left: 10, right: 10 }}
        delayPressIn={0}
      >
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 30,
    width: SCREEN_WIDTH * 0.8,
    elevation: 4,
  },
  startButtonText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default React.memo(GameModeSelection);
