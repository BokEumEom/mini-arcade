import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Game } from '../../../components/tap-circle/Game';

export default function TapCircleGame() {
  const handleExit = () => {
    console.log('Exit game called - navigating to main screen');
    // 메인 화면으로 완전히 돌아가기
    router.replace('/(tabs)');
  };

  // 화면 제스처 뒤로가기 처리
  useFocusEffect(
    React.useCallback(() => {
      console.log('Setting up back handler');
      
      const onBackPress = () => {
        console.log('Back button pressed');
        handleExit();
        return true; // 기본 뒤로가기 동작 방지
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      console.log('Back handler registered');

      return () => {
        console.log('Removing back handler');
        subscription.remove();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Game onExit={handleExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});