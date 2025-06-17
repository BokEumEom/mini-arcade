import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Game } from '../../../components/tap-circle/Game';

export default function TapCircleGame() {
  return (
    <View style={styles.container}>
      <Game />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});