import { Star, Timer, Trophy, Zap } from 'lucide-react-native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

interface AchievementAlertProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementAlert({ visible, achievement, onClose }: AchievementAlertProps) {
  if (!achievement) return null;

  const getRewardIcon = (reward: string) => {
    if (reward.includes('특수 타겟')) return <Star size={24} color="#FFC107" />;
    if (reward.includes('콤보')) return <Zap size={24} color="#FFC107" />;
    if (reward.includes('시간')) return <Timer size={24} color="#FFC107" />;
    return <Trophy size={24} color="#FFC107" />;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Trophy size={32} color="#FFC107" />
            <Text style={styles.title}>업적 달성!</Text>
          </View>

          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>

          <View style={styles.rewardContainer}>
            <Text style={styles.rewardTitle}>보상:</Text>
            <View style={styles.rewardContent}>
              {getRewardIcon(achievement.reward)}
              <Text style={styles.rewardText}>{achievement.reward}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  achievementInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  rewardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  rewardText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 