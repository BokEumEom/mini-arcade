import { Link } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/common/Header';
import { GameCard } from '@/components/games/GameCard';
import { GameSection } from '@/components/games/GameSection';
import { ThemedView } from '@/components/ThemedView';
import { APP_THEME } from '@/constants/appTheme';
import { findGameById, GAMES, getNewGames, getRecommendedGames } from '@/constants/Games';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameHistory } from '@/hooks/useGameHistory';

export default function GameListScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? APP_THEME.dark : APP_THEME.light;
  const { getRecentGames, isLoading } = useGameHistory();

  const recommendedGames = getRecommendedGames();
  const newGames = getNewGames();
  
  // 실제 플레이 기록에서 게임 정보 가져오기
  const recentGameHistory = getRecentGames();
  const recentGames = recentGameHistory
    .map(historyItem => findGameById(historyItem.gameId))
    .filter(Boolean) // undefined 제거
    .map(game => ({
      id: game!.id,
      title: game!.title,
      description: game!.description,
      icon: game!.icon,
      isNew: game!.isNew,
    }));

  const renderAllGames = () => (
    <View style={styles.allGamesSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>모든 게임</Text>
      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/games/${item.id}`} asChild>
            <GameCard
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          </Link>
        )}
        contentContainerStyle={styles.gameGrid}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Header title="소란 Games" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 추천 게임 섹션 */}
        <GameSection
          title="추천 게임"
          games={recommendedGames}
          showViewAll={true}
        />

        {/* 최근 플레이 섹션 */}
        {!isLoading && recentGames.length > 0 && (
          <GameSection
            title="최근 플레이"
            games={recentGames}
            showViewAll={true}
          />
        )}

        {/* 신규 게임 섹션 */}
        <GameSection
          title="신규 게임"
          games={newGames}
          showViewAll={true}
        />

        {/* 모든 게임 섹션 */}
        {renderAllGames()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 85,
  },
  allGamesSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  gameGrid: {
    alignItems: 'center',
  },
});
