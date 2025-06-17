import { BlurView } from 'expo-blur';
import { Trophy } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StartScreenProps {
  onStart: () => void;
  title?: string;
  buttonText?: string;
  highScore?: number;
  onShowAchievements?: () => void;
}

export function StartScreen({ 
  onStart, 
  title = "Tap to Start", 
  buttonText = "게임 시작",
  highScore,
  onShowAchievements
}: StartScreenProps) {
  return (
    <BlurView intensity={20} style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.overlayTitle}>{title}</Text>
        {highScore !== undefined && highScore >= 0 && (
          <Text style={styles.highScore}>최고 점수: {highScore}</Text>
        )}
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={buttonText}
        >
          <Text style={styles.startButtonText}>{buttonText}</Text>
        </TouchableOpacity>
        {onShowAchievements && (
          <TouchableOpacity 
            style={styles.achievementButton} 
            onPress={onShowAchievements}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="업적 보기"
          >
            <View style={styles.achievementButtonContent}>
              <Trophy size={24} color="#fff" />
              <Text style={styles.achievementButtonText}>업적</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  overlayTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '5%',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  achievementButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: '10%',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  highScore: {
    fontSize: 18,
    color: '#000',
    marginBottom: '5%',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: '10%',
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 