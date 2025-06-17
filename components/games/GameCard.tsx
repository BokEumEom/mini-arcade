import { IconName, IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { APP_THEME } from '../../constants/appTheme';
import { useTheme } from '../../contexts/ThemeContext';

interface GameCardProps {
  title: string;
  description: string;
  icon: IconName;
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 16;
const CARD_HEIGHT = SCREEN_WIDTH * 0.17;
const ICON_SIZE = 24;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GameCard({ 
  title, 
  description, 
  icon,
  onPress 
}: GameCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? APP_THEME.dark : APP_THEME.light;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.05),
      withSpring(1)
    );
  };

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: colors.card.background },
        animatedStyle
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
          <IconSymbol 
            name={icon} 
            size={ICON_SIZE} 
            color={colors.icon} 
          />
        </View>
        <View style={styles.textBox}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.text, opacity: 0.8 }]}>{description}</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - (PADDING * 2),
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },
}); 