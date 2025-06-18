import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StartScreenProps {
  onStart: () => void;
  onExit: () => void;
  highScore: number;
}

export const StartScreen = React.memo(({ onStart, onExit, highScore }: StartScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="target" size={64} color="#4CAF50" />
          <Text style={styles.title}>Tap Circle</Text>
          <Text style={styles.subtitle}>타겟을 빠르게 터치하세요!</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="circle" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>일반 타겟: 10점</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.infoText}>특수 타겟: 20점 + 효과</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="bomb" size={24} color="#F44336" />
            <Text style={styles.infoText}>폭탄: 실수 +1</Text>
          </View>
        </View>

        {highScore > 0 && (
          <View style={styles.highScoreContainer}>
            <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.highScoreText}>최고 점수: {highScore}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={onStart}
            accessibilityLabel="게임 시작"
            accessibilityHint="게임을 시작합니다"
          >
            <MaterialCommunityIcons name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>게임 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exitButton]}
            onPress={() => {
              console.log('Exit button pressed in StartScreen - navigating to main menu');
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
});

StartScreen.displayName = 'StartScreen';

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
    width: '85%',
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  highScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  highScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
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
  startButton: {
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