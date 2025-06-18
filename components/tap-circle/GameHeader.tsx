import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  misses: number;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onExit?: () => void;
}

export const GameHeader = React.memo(({ 
  score, 
  timeLeft, 
  misses, 
  isPaused = false,
  onPause,
  onResume,
  onExit 
}: GameHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const handlePauseResume = useCallback(() => {
    console.log('=== GameHeader: handlePauseResume called ===');
    console.log('GameHeader: Current isPaused:', isPaused);
    console.log('GameHeader: onPause available:', !!onPause);
    console.log('GameHeader: onResume available:', !!onResume);
    
    if (isPaused) {
      console.log('GameHeader: Resuming game...');
      if (onResume) {
        onResume();
        console.log('GameHeader: onResume called');
      } else {
        console.error('GameHeader: onResume is not available');
      }
    } else {
      console.log('GameHeader: Pausing game...');
      if (onPause) {
        onPause();
        console.log('GameHeader: onPause called');
      } else {
        console.error('GameHeader: onPause is not available');
      }
    }
  }, [isPaused, onPause, onResume]);

  const handleExit = useCallback(() => {
    console.log('=== GameHeader: handleExit called ===');
    console.log('GameHeader: onExit available:', !!onExit);
    
    if (onExit) {
      console.log('GameHeader: Calling onExit...');
      onExit();
      console.log('GameHeader: onExit called');
    } else {
      console.error('GameHeader: onExit is not available');
    }
  }, [onExit]);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.infoContainer}>
        <Text style={styles.score}>점수: {score}</Text>
        <Text style={styles.timer}>시간: {timeLeft}초</Text>
        <Text style={styles.misses}>실수: {misses}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.iconButton, 
              { 
                backgroundColor: isPaused ? '#4CAF50' : '#FF9800',
                borderWidth: 2,
                borderColor: isPaused ? '#2E7D32' : '#E65100'
              }
            ]}
            onPress={handlePauseResume}
            onPressIn={() => console.log('GameHeader: Pause/Resume button pressed IN')}
            onLongPress={() => console.log('GameHeader: Pause/Resume button long pressed')}
            activeOpacity={0.5}
            accessibilityLabel={isPaused ? "게임 재개" : "게임 일시정지"}
            accessibilityHint={isPaused ? "일시정지된 게임을 재개합니다" : "게임을 일시정지합니다"}
          >
            <MaterialCommunityIcons
              name={isPaused ? "play" : "pause"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.iconButton, 
              { 
                backgroundColor: '#F44336',
                borderWidth: 2,
                borderColor: '#D32F2F'
              }
            ]}
            onPress={handleExit}
            onPressIn={() => console.log('GameHeader: Exit button pressed IN')}
            onLongPress={() => console.log('GameHeader: Exit button long pressed')}
            activeOpacity={0.5}
            accessibilityLabel="게임 종료"
            accessibilityHint="게임을 종료하고 메인 화면으로 돌아갑니다"
          >
            <MaterialCommunityIcons
              name="exit-to-app"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

GameHeader.displayName = 'GameHeader';

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    flex: 1,
    textAlign: 'center',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  misses: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
}); 