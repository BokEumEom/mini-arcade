import { Star, Timer, Trophy, X, Zap } from 'lucide-react-native';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

interface AchievementModalProps {
  visible: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export function AchievementModal({ visible, onClose, achievements }: AchievementModalProps) {
  const getRewardIcon = (reward: string) => {
    if (reward.includes('특수 타겟')) return <Star size={20} color="#FFC107" />;
    if (reward.includes('콤보')) return <Zap size={20} color="#FFC107" />;
    if (reward.includes('시간')) return <Timer size={20} color="#FFC107" />;
    return <Trophy size={20} color="#FFC107" />;
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
            <View style={styles.titleContainer}>
              <Trophy size={24} color="#FFC107" />
              <Text style={styles.title}>업적</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.achievementList}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  achievement.completed && styles.completedAchievement,
                ]}
              >
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  {achievement.completed && (
                    <Trophy size={20} color="#FFC107" />
                  )}
                </View>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <View style={styles.rewardContainer}>
                  {getRewardIcon(achievement.reward)}
                  <Text style={styles.rewardText}>{achievement.reward}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  achievementList: {
    maxHeight: '80%',
  },
  achievementItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  completedAchievement: {
    backgroundColor: '#e8f5e9',
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rewardText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
}); 