import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onExit: () => void;
}

export const GameOverScreen = ({
  score,
  highScore,
  onRestart,
  onExit,
}: GameOverScreenProps) => {
  const isNewHighScore = score > highScore;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>게임 오버!</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>최종 점수</Text>
          <Text style={styles.score}>{score}</Text>
          
          {isNewHighScore ? (
            <View style={styles.highScoreContainer}>
              <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.highScoreText}>새로운 최고 점수!</Text>
            </View>
          ) : (
            <Text style={styles.highScore}>
              최고 점수: {highScore}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.restartButton]}
            onPress={onRestart}
            accessibilityLabel="다시 시작"
            accessibilityHint="게임을 다시 시작합니다"
          >
            <MaterialCommunityIcons name="restart" size={24} color="#fff" />
            <Text style={styles.buttonText}>다시 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exitButton]}
            onPress={() => {
              console.log('Exit button pressed in GameOverScreen - navigating to main menu');
              onExit();
            }}
            accessibilityLabel="나가기"
            accessibilityHint="게임을 종료하고 메인 화면으로 돌아갑니다"
          >
            <MaterialCommunityIcons name="exit-to-app" size={24} color="#fff" />
            <Text style={styles.buttonText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  highScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  highScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  highScore: {
    fontSize: 18,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
  },
  exitButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 