import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_THEME } from '../../constants/appTheme';
import { useTheme } from '../../contexts/ThemeContext';
import { IconName, IconSymbol } from '../ui/IconSymbol';

interface GameSectionProps {
  title: string;
  games: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isNew?: boolean;
  }>;
  showViewAll?: boolean;
  onViewAllPress?: () => void;
}

// 작은 GameCard 컴포넌트 (가로 스크롤용)
function SmallGameCard({ 
  title, 
  description, 
  icon
}: {
  title: string;
  description: string;
  icon: string;
}) {
  const { isDark } = useTheme();
  const colors = isDark ? APP_THEME.dark : APP_THEME.light;

  return (
    <View 
      style={[
        smallCardStyles.container,
        { backgroundColor: colors.card.background }
      ]}
    >
      <View style={smallCardStyles.content}>
        <View style={[smallCardStyles.iconContainer, { backgroundColor: colors.background }]}>
          <IconSymbol 
            name={icon as IconName} 
            size={20} 
            color={colors.icon} 
          />
        </View>
        <View style={smallCardStyles.textBox}>
          <Text style={[smallCardStyles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[smallCardStyles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const smallCardStyles = StyleSheet.create({
  container: {
    width: 200,
    height: 80,
    borderRadius: 12,
    shadowColor: '#f0f0f0',
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
    padding: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 14,
  },
});

export function GameSection({ 
  title, 
  games, 
  showViewAll = false,
  onViewAllPress 
}: GameSectionProps) {
  const { isDark } = useTheme();
  const colors = isDark ? APP_THEME.dark : APP_THEME.light;

  if (games.length === 0) return null;

  const handleGamePress = (gameId: string) => {
    console.log('Game pressed:', gameId);
    router.push(`/games/${gameId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {showViewAll && (
          <Text 
            style={[styles.viewAll, { color: colors.tint }]}
            onPress={onViewAllPress}
          >
            전체보기
          </Text>
        )}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {games.map((game) => (
          <View key={game.id} style={styles.gameCardContainer}>
            <Pressable onPress={() => handleGamePress(game.id)}>
              <SmallGameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
              />
            </Pressable>
            {game.isNew && (
              <View style={[styles.newBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.newText}>NEW</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  gameCardContainer: {
    width: 200,
    marginRight: 12,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  newText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
}); 