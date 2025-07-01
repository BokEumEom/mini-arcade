import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { LoadingScreen } from '../../../components/games/LoadingScreen';
import { GameBoard } from '../../../components/tower-defense/GameBoard';
import { GameHeader } from '../../../components/tower-defense/GameHeader';
import { StartScreen } from '../../../components/tower-defense/StartScreen';
import { TowerPanel } from '../../../components/tower-defense/TowerPanel';
import { useTowerDefenseGame } from '../../../hooks/useTowerDefenseGame';
import { TowerType } from '../../../types/games/variants/tower-defense';

export default function TowerDefenseGame() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    gameState,
    damageEffects,
    isTowerAttacking,
    isEnemyDamaged,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    placeTower,
    upgradeTower,
    sellTower,
    selectTowerType,
    selectPosition,
    clearSelection,
  } = useTowerDefenseGame();

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    setIsLoading(false);
    startGame();
  };

  const handleTilePress = (x: number, y: number) => {
    if (gameState.selectedTowerType) {
      placeTower(gameState.selectedTowerType, { x, y });
    } else {
      selectPosition({ x, y });
    }
  };

  const handleTowerSelect = (towerType: TowerType | null) => {
    selectTowerType(towerType);
  };

  const handleTowerUpgrade = (towerId: string) => {
    upgradeTower(towerId);
  };

  const handleTowerSell = (towerId: string) => {
    sellTower(towerId);
  };

  const handleGameOver = () => {
    Alert.alert(
      '게임 오버',
      `점수: ${gameState.score}\n생명: ${gameState.lives}\n웨이브: ${gameState.currentWave}`,
      [
        { text: '다시 시작', onPress: () => setIsLoading(true) },
        { text: '종료', onPress: () => endGame() },
      ]
    );
  };

  // 로딩 화면 표시
  if (isLoading) {
    return (
      <LoadingScreen 
        gameTitle="TOWER DEFENSE"
        onLoadingComplete={handleLoadingComplete}
        duration={2200}
      />
    );
  }

  if (!gameState.isPlaying) {
    return <StartScreen onStart={() => setIsLoading(true)} onExit={endGame} highScore={gameState.score} />;
  }

  // Handle game over
  if (gameState.isGameOver) {
    handleGameOver();
    return null;
  }

  return (
    <View style={styles.container}>
      <GameHeader
        lives={gameState.lives}
        money={gameState.money}
        score={gameState.score}
        currentWave={gameState.currentWave}
        totalWaves={gameState.totalWaves}
      />
      
      <GameBoard
        gameState={gameState}
        damageEffects={damageEffects}
        isTowerAttacking={isTowerAttacking}
        isEnemyDamaged={isEnemyDamaged}
        onTilePress={handleTilePress}
        selectedPosition={gameState.selectedPosition}
        money={gameState.money}
        onTowerPlace={placeTower}
        canPlaceTower={(position) => {
          // Check if position is valid for tower placement
          const isOnPath = false; // Add path checking logic
          const hasEnoughMoney = gameState.selectedTowerType ? 
            gameState.money >= 100 : true; // Add tower cost checking
          return !isOnPath && hasEnoughMoney;
        }}
        onDamageEffectComplete={(effectId) => {
          // Handle damage effect completion - this is now handled automatically in the hook
        }}
      />
      
      <TowerPanel
        selectedTowerType={gameState.selectedTowerType}
        money={gameState.money}
        onTowerSelect={handleTowerSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
}); 