import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface TargetProps {
  x: number;
  y: number;
  type: 'normal' | 'special' | 'bomb';
  size: number;
  onPress?: () => void;
}

export const Target = React.memo(({ x, y, type, size, onPress }: TargetProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    console.log('Target pressed:', { id: `${x}-${y}`, type, x, y, size });
    
    // 탭 시 스케일 애니메이션
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      console.log('Calling onPress callback for target:', { type, x, y });
      onPress();
    }
  };

  const handlePressIn = (event: any) => {
    // 이벤트 전파를 막아서 배경 Pressable이 호출되지 않도록 함
    event.stopPropagation();
    console.log('Target press in:', { type, x, y });
  };

  const getTargetColor = () => {
    switch (type) {
      case 'special':
        return '#FFD700';
      case 'bomb':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };

  const getTargetIcon = () => {
    switch (type) {
      case 'special':
        return 'star';
      case 'bomb':
        return 'bomb';
      default:
        return 'circle';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      activeOpacity={0.8}
      style={[
        styles.target,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          backgroundColor: getTargetColor(),
        },
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[
          styles.targetContent,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={getTargetIcon()}
          size={size * 0.6}
          color="#fff"
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

Target.displayName = 'Target';

const styles = StyleSheet.create({
  target: {
    position: 'absolute',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  targetContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 