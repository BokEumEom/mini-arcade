import { IconSymbol } from '@/components/ui/IconSymbol';
import { Direction } from '@/constants/pac-man/constants';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameControlsProps {
  onDirectionPress: (direction: Direction) => void;
  onPausePress: () => void;
}

export function GameControls({ onDirectionPress, onPausePress }: GameControlsProps) {
  const [pressedDirection, setPressedDirection] = useState<Direction | null>(null);

  const handleDirectionPress = (direction: Direction) => {
    setPressedDirection(direction);
    onDirectionPress(direction);
    
    // 터치 피드백을 위한 짧은 지연
    setTimeout(() => setPressedDirection(null), 150);
  };

  const getButtonStyle = (direction: Direction) => {
    const isPressed = pressedDirection === direction;
    return [
      styles.directionButton,
      isPressed && styles.directionButtonPressed
    ];
  };

  return (
    <View style={styles.container}>
      {/* 방향 컨트롤 */}
      <View style={styles.directionControls}>
        {/* 상단 행 */}
        <View style={styles.directionRow}>
          <View style={styles.spacer} />
          <TouchableOpacity 
            style={getButtonStyle('UP')}
            onPress={() => handleDirectionPress('UP')}
            activeOpacity={0.8}
          >
            <IconSymbol name="arrow-up" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>
        
        {/* 중간 행 */}
        <View style={styles.directionRow}>
          <TouchableOpacity 
            style={getButtonStyle('LEFT')}
            onPress={() => handleDirectionPress('LEFT')}
            activeOpacity={0.8}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.spacer} />
          
          <TouchableOpacity 
            style={getButtonStyle('RIGHT')}
            onPress={() => handleDirectionPress('RIGHT')}
            activeOpacity={0.8}
          >
            <IconSymbol name="chevron.right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {/* 하단 행 */}
        <View style={styles.directionRow}>
          <View style={styles.spacer} />
          <TouchableOpacity 
            style={getButtonStyle('DOWN')}
            onPress={() => handleDirectionPress('DOWN')}
            activeOpacity={0.8}
          >
            <IconSymbol name="chevron.down" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>
      </View>
      
      {/* 액션 버튼들 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onPausePress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>⏸️ 일시정지</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  directionControls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  directionButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
    marginHorizontal: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  directionButtonPressed: {
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
    transform: [{ scale: 0.95 }],
  },
  spacer: {
    width: 50,
    height: 50,
    marginHorizontal: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.6)',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 