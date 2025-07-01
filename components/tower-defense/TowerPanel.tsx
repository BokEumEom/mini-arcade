import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TOWER_CONFIGS, TowerType } from '../../types/games/variants/tower-defense';

interface TowerPanelProps {
  selectedTowerType: TowerType | null;
  money: number;
  onTowerSelect: (towerType: TowerType | null) => void;
}

export function TowerPanel({ selectedTowerType, money, onTowerSelect }: TowerPanelProps) {
  const towerTypes: TowerType[] = ['archer', 'cannon', 'magic', 'ice'];

  const handleTowerPress = (towerType: TowerType) => {
    if (selectedTowerType === towerType) {
      onTowerSelect(null);
    } else {
      onTowerSelect(towerType);
    }
  };

  const canAffordTower = (towerType: TowerType) => {
    return money >= TOWER_CONFIGS[towerType].baseCost;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>타워 선택</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.towerList}>
          {towerTypes.map(towerType => {
            const config = TOWER_CONFIGS[towerType];
            const isSelected = selectedTowerType === towerType;
            const canAfford = canAffordTower(towerType);

            return (
              <TouchableOpacity
                key={towerType}
                style={[
                  styles.towerButton,
                  isSelected && styles.selectedTower,
                  !canAfford && styles.unaffordableTower,
                ]}
                onPress={() => handleTowerPress(towerType)}
                disabled={!canAfford}
              >
                <Text style={styles.towerIcon}>{config.icon}</Text>
                <Text style={[styles.towerName, !canAfford && styles.unaffordableText]}>
                  {config.name}
                </Text>
                <Text style={[styles.towerCost, !canAfford && styles.unaffordableText]}>
                  {config.baseCost} 💰
                </Text>
                <Text style={[styles.towerStats, !canAfford && styles.unaffordableText]}>
                  공격력: {config.baseDamage}
                </Text>
                <Text style={[styles.towerStats, !canAfford && styles.unaffordableText]}>
                  사거리: {config.baseRange}
                </Text>
                <Text style={[styles.towerStats, !canAfford && styles.unaffordableText]}>
                  속도: {config.baseAttackSpeed.toFixed(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#34495E',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  towerList: {
    flexDirection: 'row',
    gap: 10,
  },
  towerButton: {
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTower: {
    borderColor: '#3498DB',
    backgroundColor: '#2980B9',
  },
  unaffordableTower: {
    backgroundColor: '#7F8C8D',
    opacity: 0.6,
  },
  towerIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  towerName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  towerCost: {
    color: '#F1C40F',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  towerStats: {
    color: '#BDC3C7',
    fontSize: 9,
    textAlign: 'center',
  },
  unaffordableText: {
    color: '#95A5A6',
  },
}); 