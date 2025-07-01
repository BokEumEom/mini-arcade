import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ENEMY_CONFIGS, TOWER_CONFIGS } from '../../types/games/variants/tower-defense';

interface StartScreenProps {
  onStart: () => void;
  onExit: () => void;
  highScore: number;
}

export function StartScreen({ onStart, onExit, highScore }: StartScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏰 타워 디펜스</Text>
        <Text style={styles.subtitle}>적을 막아라!</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>최고 점수</Text>
          <Text style={styles.highScore}>{highScore}</Text>
        </View>

        <ScrollView style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>게임 방법</Text>
          
          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>🎯 목표</Text>
            <Text style={styles.instructionText}>
              적들이 경로를 따라 이동하는 것을 막아라! 타워를 건설하여 적들을 공격하고, 
              모든 웨이브를 클리어하면 승리!
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>🏗️ 타워</Text>
            {Object.values(TOWER_CONFIGS).map(tower => (
              <View key={tower.type} style={styles.towerInfo}>
                <Text style={styles.towerIcon}>{tower.icon}</Text>
                <View style={styles.towerDetails}>
                  <Text style={styles.towerName}>{tower.name}</Text>
                  <Text style={styles.towerDescription}>{tower.description}</Text>
                  <Text style={styles.towerCost}>비용: {tower.baseCost} 💰</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>⚔️ 적</Text>
            {Object.values(ENEMY_CONFIGS).map(enemy => (
              <View key={enemy.type} style={styles.enemyInfo}>
                <Text style={styles.enemyIcon}>{enemy.icon}</Text>
                <View style={styles.enemyDetails}>
                  <Text style={styles.enemyName}>{enemy.name}</Text>
                  <Text style={styles.enemyStats}>
                    체력: {enemy.health} | 속도: {enemy.speed} | 보상: {enemy.reward} 💰
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>💡 팁</Text>
            <Text style={styles.instructionText}>
              • 경로 근처에 타워를 배치하세요{'\n'}
              • 다양한 타워를 조합하여 사용하세요{'\n'}
              • 돈을 모아서 타워를 업그레이드하세요{'\n'}
              • 생명이 0이 되면 게임 오버!
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>게임 시작</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.exitButton} onPress={onExit}>
            <Text style={styles.exitButtonText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  content: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#BDC3C7',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    color: '#BDC3C7',
    marginBottom: 5,
  },
  highScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  instructionsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#BDC3C7',
    lineHeight: 20,
  },
  towerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 6,
  },
  towerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  towerDetails: {
    flex: 1,
  },
  towerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  towerDescription: {
    fontSize: 12,
    color: '#BDC3C7',
    marginBottom: 2,
  },
  towerCost: {
    fontSize: 12,
    color: '#F1C40F',
  },
  enemyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 6,
  },
  enemyIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  enemyDetails: {
    flex: 1,
  },
  enemyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  enemyStats: {
    fontSize: 12,
    color: '#BDC3C7',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 