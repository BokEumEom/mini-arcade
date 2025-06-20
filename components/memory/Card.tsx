import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Card as CardType } from '../../types/games/variants/memory';
import { getMemoryIconsForCategory, IconSymbol, MemoryIconCategory } from '../ui/IconSymbol';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 80) / 4;

interface CardProps {
  card: CardType;
  category: MemoryIconCategory;
  onPress: () => void;
  onMatch?: (x: number, y: number) => void;
}

export const Card: React.FC<CardProps> = ({ card, category, onPress, onMatch }) => {
  const cardRef = useRef<View>(null);

  const flipAnimation = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: withTiming(card.isFlipped ? '180deg' : '0deg', { duration: 500 }) }
    ]
  }));

  const icons = getMemoryIconsForCategory(category);
  const iconName = icons[card.value - 1];

  // 매칭 성공 시 파티클 효과 트리거
  React.useEffect(() => {
    if (card.isMatched && onMatch) {
      // 카드의 중앙 위치 계산
      cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const centerX = pageX + width / 2;
        const centerY = pageY + height / 2;
        onMatch(centerX, centerY);
      });
    }
  }, [card.isMatched, onMatch]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View ref={cardRef} style={[styles.card, flipAnimation]}>
        <LinearGradient
          colors={card.isMatched 
            ? ['#4CAF50', '#45a049'] 
            : card.isFlipped 
              ? ['#2196F3', '#1976D2']
              : ['#424242', '#303030']}
          style={styles.cardGradient}
        >
          {card.isFlipped ? (
            <IconSymbol 
              name={iconName as any} 
              size={40} 
              color="#fff" 
            />
          ) : (
            <IconSymbol name="help" size={32} color="#fff" />
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 