// app/game/numberpuz.tsx
import ResultModal from '@/components/common/ResultModal';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import NumberGrid from '@/components/numberpuz/NumberGrid';
import NumberPuzzleMenu from '@/components/numberpuz/NumberPuzzleMenu';
import { useNumberPuzzle } from '@/hooks/useNumberPuzzle';
import { LayoutGrid, RotateCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.4;
const BUTTON_HEIGHT = 50;

const MESSAGES = ["안녕! 난 소란", "잘했어! 문제없을 거야!", "멋진데? 계속 도전해봐!", "최고야! 네 실력이 빛나고 있어!", "좋아, 여기서 멈추지 말고 계속 가보자!"];

const NumberPuzzleGame = () => {
  const [puzzleSize, setPuzzleSize] = useState<number | null>(null);
  const [modalResult, setModalResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const size = puzzleSize || 16; // 기본값: 4x4
  const { numbers, isCompleted, handlePress, resetGame } = useNumberPuzzle(size);

  const transition = useSharedValue(0); // 애니메이션 전환 상태 (0: 메뉴, 1: 게임)

  const [messageIndex, setMessageIndex] = useState(0);

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    resetGame();
    transition.value = withTiming(1, { duration: 200 }); // 메뉴 -> 게임 화면
  };

  useEffect(() => {
    if (isCompleted) {
      setModalResult(`${Math.sqrt(size)}x${Math.sqrt(size)} 퍼즐 완료!`);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (puzzleSize !== null && !isLoading) {
      resetGame();
      transition.value = withTiming(1, { duration: 200 }); // 메뉴 -> 게임 화면
    } else if (puzzleSize === null) {
      transition.value = withTiming(0, { duration: 200 }); // 게임 -> 메뉴 화면
    }
  }, [puzzleSize, isLoading]);

  // 응원 메시지 인터벌 설정
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000); // 3초마다 다음 메시지
    return () => clearInterval(intervalId);
  }, []);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(transition.value === 0 ? 0 : -width) }],
    opacity: withTiming(transition.value === 0 ? 1 : 0),
  }));

  const gameStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(transition.value === 1 ? 0 : width) }],
    opacity: withTiming(transition.value === 1 ? 1 : 0),
  }));

  const handleSelectSize = (selectedSize: number) => {
    setPuzzleSize(selectedSize);
    setIsLoading(true);
  };

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="NUMBER PUZZLE"
        onLoadingComplete={handleLoadingComplete}
        duration={1600}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* ResultModal */}
      <ResultModal result={modalResult} onClose={() => setModalResult(null)} />

      {/* 메뉴 화면 */}
      <Animated.View style={[styles.animatedContainer, menuStyle]}>
        <NumberPuzzleMenu onSelectSize={handleSelectSize} />
      </Animated.View>

      {/* 게임 화면 */}
      <Animated.View style={[styles.animatedContainer, gameStyle]}>
        <Text style={styles.title}>{`${Math.sqrt(size)}x${Math.sqrt(size)} 숫자 퍼즐 게임`}</Text>
        <NumberGrid numbers={numbers} onPress={handlePress} />
        
        {/* 버튼을 한 줄에 배치 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => setIsLoading(true)}>
            <View style={styles.buttonContent}>
              <RotateCw color="#333" size={20} />
              <Text style={styles.buttonText}>다시 시작</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={() => setPuzzleSize(null)}
          >
            <View style={styles.buttonContent}>
              <LayoutGrid color="#333" size={20} />
              <Text style={styles.buttonText}>메뉴</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 캐릭터 왼쪽에 응원 메세지 표시 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{MESSAGES[messageIndex]}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default NumberPuzzleGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  animatedContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: '#B3E5FC',
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: '#fff',
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#B3E5FC',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  messageContainer: {
    position: 'absolute',
    bottom: 70,
    right: width * 0.29, // 캐릭터 이미지 폭 + 약간의 여백
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 20,
    borderRadius: 12,
  },
  messageText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 16,
  },
});
