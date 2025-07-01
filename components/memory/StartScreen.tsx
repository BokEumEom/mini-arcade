import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol, MemoryIconCategory, getMemoryIconsForCategory } from '../ui/IconSymbol';

interface StartScreenProps {
  onStart: (category: MemoryIconCategory) => void;
  onExit: () => void;
  highScore: number;
}

const CATEGORIES: { key: MemoryIconCategory; name: string; description: string; color: string }[] = [
  { key: 'animals', name: '동물', description: '귀여운 동물들과 매칭', color: '#4CAF50' },
  { key: 'design', name: '디자인', description: '창의적인 디자인 도구', color: '#2196F3' },
  { key: 'gaming', name: '게임', description: '게임 관련 아이콘들', color: '#FF9800' },
  { key: 'nature', name: '자연', description: '자연의 아름다움', color: '#8BC34A' },
];

export const StartScreen = React.memo(({ onStart, onExit, highScore }: StartScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<MemoryIconCategory>('animals');
  const router = useRouter();

  const handleStart = () => {
    onStart(selectedCategory);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <IconSymbol name="tree" size={64} color="#667eea" />
          <Text style={styles.title}>Memory Game</Text>
          <Text style={styles.subtitle}>카테고리를 선택하고 기억력 게임을 즐기세요!</Text>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>카테고리 선택</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => {
              const icons = getMemoryIconsForCategory(category.key);
              const isSelected = selectedCategory === category.key;
              
              return (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryCard,
                    isSelected && { borderColor: category.color, borderWidth: 3 }
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <View style={styles.categoryIcons}>
                    {icons.slice(1, 5).map((iconName, index) => (
                      <IconSymbol
                        key={index}
                        name={iconName as any}
                        size={20}
                        color={category.color}
                      />
                    ))}
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {highScore > 0 && (
          <View style={styles.highScoreContainer}>
            <IconSymbol name="trophy" size={24} color="#FFD700" />
            <Text style={styles.highScoreText}>최고 점수: {highScore}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStart}
            accessibilityLabel="게임 시작"
            accessibilityHint="선택한 카테고리로 게임을 시작합니다"
          >
            <Text style={styles.buttonText}>게임 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exitButton]}
            onPress={() => {
              console.log('=== EXIT BUTTON PRESSED ===');
              console.log('Exit button pressed in Memory StartScreen');
              console.log('onExit function:', typeof onExit);
              console.log('Calling onExit...');
              
              // 직접 router 사용
              console.log('Trying direct router navigation...');
              try {
                router.back();
                console.log('Direct router.back() successful');
              } catch (error) {
                console.error('Direct router navigation failed:', error);
                // fallback으로 onExit 호출
                console.log('Falling back to onExit...');
                onExit();
              }
              
              console.log('onExit called successfully');
            }}
            onPressIn={() => console.log('Exit button pressed in')}
            onPressOut={() => console.log('Exit button pressed out')}
            accessibilityLabel="나가기"
            accessibilityHint="게임을 종료하고 메인 화면으로 돌아갑니다"
            activeOpacity={0.7}
          >
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 9999,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
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
    marginBottom: 24,
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
  categoryContainer: {
    width: '100%',
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
    zIndex: 1000,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
    minHeight: 50,
  },
  startButton: {
    backgroundColor: '#667eea',
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