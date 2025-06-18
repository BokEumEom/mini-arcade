import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { CARD_ICONS, Card as CardType } from '../../types/games/variants/memory';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

interface CardProps {
  card: CardType;
  onPress: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onPress }) => {
  const flipAnimation = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: withTiming(card.isFlipped ? '180deg' : '0deg', { duration: 500 }) }
    ]
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.card, flipAnimation]}>
        <LinearGradient
          colors={card.isMatched 
            ? ['#4CAF50', '#45a049'] 
            : card.isFlipped 
              ? ['#2196F3', '#1976D2']
              : ['#424242', '#303030']}
          style={styles.cardGradient}
        >
          {card.isFlipped ? (
            <MaterialIcons 
              name={CARD_ICONS[card.value - 1]} 
              size={40} 
              color="#fff" 
            />
          ) : (
            <MaterialIcons name="help-outline" size={32} color="#fff" />
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