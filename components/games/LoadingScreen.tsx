import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface LoadingScreenProps {
  gameTitle: string;
  onLoadingComplete: () => void;
  duration?: number; // 로딩 시간 (밀리초)
}

export function LoadingScreen({ 
  gameTitle, 
  onLoadingComplete, 
  duration = 2000 
}: LoadingScreenProps) {
  const [loadingProgress] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState('LOADING...');
  const [percentage, setPercentage] = useState(0);
  const [titleOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    // 제목 깜빡임 효과
    const titleFlicker = Animated.loop(
      Animated.sequence([
        Animated.timing(titleOpacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    titleFlicker.start();

    // 로딩 텍스트 애니메이션
    const textInterval = setInterval(() => {
      setLoadingText(prev => prev === 'LOADING...' ? 'LOADING' : 'LOADING...');
    }, 500);

    // 퍼센트 업데이트
    const progressListener = loadingProgress.addListener(({ value }) => {
      setPercentage(Math.round(value * 100));
    });

    // 로딩 바 애니메이션
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(() => {
      titleFlicker.stop();
      clearInterval(textInterval);
      loadingProgress.removeListener(progressListener);
      // 로딩 완료 후 잠깐 대기
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    });

    return () => {
      titleFlicker.stop();
      clearInterval(textInterval);
      loadingProgress.removeListener(progressListener);
    };
  }, [loadingProgress, onLoadingComplete, titleOpacity, duration]);

  const loadingBarWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 게임 제목 */}
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          {gameTitle}
        </Animated.Text>
        
        {/* 로딩 텍스트 */}
        <Text style={styles.loadingText}>{loadingText}</Text>
        
        {/* 로딩 바 컨테이너 */}
        <View style={styles.loadingBarContainer}>
          <Animated.View 
            style={[
              styles.loadingBar, 
              { width: loadingBarWidth }
            ]} 
          />
        </View>
        
        {/* 로딩 퍼센트 */}
        <Text style={styles.percentageText}>
          {percentage}%
        </Text>
        
        {/* 고전 게임 스타일 메시지 */}
        <Text style={styles.retroText}>READY TO PLAY</Text>
        
        {/* 추가 고전 게임 요소 */}
        <View style={styles.retroElements}>
          <Text style={styles.retroElement}>* * * * *</Text>
          <Text style={styles.retroElement}>PRESS ANY KEY</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFB8FF',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  loadingBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFB8FF',
    marginBottom: 20,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 16,
    color: '#FFB8FF',
    marginBottom: 30,
    fontFamily: 'monospace',
  },
  retroText: {
    fontSize: 14,
    color: '#FFB8FF',
    fontFamily: 'monospace',
    opacity: 0.8,
    marginBottom: 20,
  },
  retroElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  retroElement: {
    fontSize: 12,
    color: '#FFB8FF',
    fontFamily: 'monospace',
    opacity: 0.6,
    marginBottom: 5,
  },
}); 