import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ENEMY_CONFIGS, GameState, Position, TOWER_CONFIGS, TowerType } from '../../types/games/variants/tower-defense';
import { DamageEffect } from './DamageEffect';
import { Enemy as EnemyComponent } from './Enemy';
import { Tower as TowerComponent } from './Tower';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_WIDTH = SCREEN_WIDTH - 20;
const BOARD_HEIGHT = SCREEN_WIDTH * 1.3;
const GRID_SIZE = 40;

// Use the same path as the game logic
const GAME_PATH = [
  { x: 0, y: BOARD_HEIGHT * 0.5 },
  { x: BOARD_WIDTH * 0.25, y: BOARD_HEIGHT * 0.5 },
  { x: BOARD_WIDTH * 0.25, y: BOARD_HEIGHT * 0.3 },
  { x: BOARD_WIDTH * 0.5, y: BOARD_HEIGHT * 0.3 },
  { x: BOARD_WIDTH * 0.5, y: BOARD_HEIGHT * 0.7 },
  { x: BOARD_WIDTH * 0.75, y: BOARD_HEIGHT * 0.7 },
  { x: BOARD_WIDTH * 0.75, y: BOARD_HEIGHT * 0.2 },
  { x: BOARD_WIDTH, y: BOARD_HEIGHT * 0.2 },
  { x: BOARD_WIDTH, y: BOARD_HEIGHT * 0.8 },
];

interface DamageEffectData {
  id: string;
  damage: number;
  position: Position;
}

interface GameBoardProps {
  gameState: GameState;
  damageEffects: DamageEffectData[];
  isTowerAttacking: (towerId: string) => boolean;
  isEnemyDamaged: (enemyId: string) => boolean;
  onTilePress: (x: number, y: number) => void;
  selectedPosition: { x: number; y: number } | null;
  money: number;
  onTowerPlace: (towerType: TowerType, position: Position) => void;
  canPlaceTower: (position: Position) => boolean;
  onDamageEffectComplete: (effectId: string) => void;
}

export function GameBoard({
  gameState,
  damageEffects,
  isTowerAttacking,
  isEnemyDamaged,
  onTilePress,
  selectedPosition,
  money,
  onTowerPlace,
  canPlaceTower,
  onDamageEffectComplete,
}: GameBoardProps) {
  const handleTilePress = (x: number, y: number) => {
    onTilePress(x, y);
  };

  const handleGridPress = (x: number, y: number) => {
    const position = { x: x * GRID_SIZE + GRID_SIZE / 2, y: y * GRID_SIZE + GRID_SIZE / 2 };
    
    if (gameState.selectedTowerType) {
      onTowerPlace(gameState.selectedTowerType, position);
    } else {
      onTilePress(x, y);
    }
  };

  const renderPath = () => {
    return (
      <View style={styles.pathContainer}>
        {GAME_PATH.map((point, index) => (
          <View
            key={index}
            style={[
              styles.pathPoint,
              {
                left: point.x - 5,
                top: point.y - 5,
              },
            ]}
          />
        ))}
        {GAME_PATH.slice(0, -1).map((point, index) => {
          const nextPoint = GAME_PATH[index + 1];
          const centerX = (point.x + nextPoint.x) / 2;
          const centerY = (point.y + nextPoint.y) / 2;
          const length = Math.sqrt(
            Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
          );
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);

          return (
            <View
              key={`path-${index}`}
              style={[
                styles.pathLine,
                {
                  left: centerX - length / 2,
                  top: centerY - 2,
                  width: length,
                  transform: [{ rotate: `${angle}rad` }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderGrid = () => {
    const cols = Math.floor(BOARD_WIDTH / GRID_SIZE);
    const rows = Math.floor(BOARD_HEIGHT / GRID_SIZE);

    return (
      <View style={styles.gridContainer}>
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => {
            const x = col * GRID_SIZE + GRID_SIZE / 2;
            const y = row * GRID_SIZE + GRID_SIZE / 2;
            const isSelected = selectedPosition && 
              Math.abs(selectedPosition.x - x) < GRID_SIZE / 2 && 
              Math.abs(selectedPosition.y - y) < GRID_SIZE / 2;
            const canPlace = gameState.selectedTowerType && canPlaceTower({ x, y });

            return (
              <TouchableOpacity
                key={`${row}-${col}`}
                style={[
                  styles.gridCell,
                  isSelected && styles.selectedCell,
                  canPlace && styles.validPlacement,
                  !canPlace && gameState.selectedTowerType && styles.invalidPlacement,
                ]}
                onPress={() => handleGridPress(col, row)}
                disabled={!gameState.selectedTowerType}
              />
            );
          })
        )}
      </View>
    );
  };

  const renderTowers = () => {
    return gameState.towers.map(tower => {
      const config = TOWER_CONFIGS[tower.type];
      return (
        <TowerComponent
          key={tower.id}
          tower={tower}
          isAttacking={isTowerAttacking(tower.id)}
        />
      );
    });
  };

  const renderEnemies = () => {
    return gameState.enemies.map(enemy => {
      const config = ENEMY_CONFIGS[enemy.type];
      const healthPercentage = enemy.health / enemy.maxHealth;
      
      return (
        <EnemyComponent
          key={enemy.id}
          enemy={enemy}
          isDamaged={isEnemyDamaged(enemy.id)}
        />
      );
    });
  };

  const renderDamageEffects = () => {
    return damageEffects.map(effect => (
      <DamageEffect
        key={effect.id}
        damage={effect.damage}
        position={effect.position}
        onComplete={() => onDamageEffectComplete(effect.id)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {renderPath()}
        {renderGrid()}
        {renderTowers()}
        {renderEnemies()}
        {renderDamageEffects()}
      </View>
      
      {gameState.selectedTowerType && (
        <View style={styles.towerInfo}>
          <Text style={styles.towerInfoText}>
            {TOWER_CONFIGS[gameState.selectedTowerType].name}
          </Text>
          <Text style={styles.towerInfoText}>
            비용: {TOWER_CONFIGS[gameState.selectedTowerType].baseCost} 💰
          </Text>
          <Text style={styles.towerInfoText}>
            보유: {money} 💰
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  pathContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pathPoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  pathLine: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#E74C3C',
    borderRadius: 2,
  },
  gridContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCell: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
    borderColor: '#3498DB',
    borderWidth: 2,
  },
  validPlacement: {
    backgroundColor: 'rgba(46, 204, 113, 0.3)',
    borderColor: '#2ECC71',
    borderWidth: 2,
  },
  invalidPlacement: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    borderColor: '#E74C3C',
    borderWidth: 2,
  },
  towerInfo: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  towerInfoText: {
    color: '#FFF',
    fontSize: 12,
    marginBottom: 2,
  },
  towerRange: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 