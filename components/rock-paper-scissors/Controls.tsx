import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Choice } from '../../hooks/useRockPaperScissors';
import { PixelIcon } from './PixelIcon';

interface ControlsProps {
  onChoice: (choice: Choice) => void;
}

const ControlButton = ({ iconName, onPress }: { iconName: Choice; onPress: () => void }) => (
  <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]} onPress={onPress}>
    <PixelIcon name={iconName} size={48} />
  </Pressable>
);

export const Controls = ({ onChoice }: ControlsProps) => (
  <View style={styles.controlsContainer}>
    <ControlButton iconName="rock" onPress={() => onChoice('rock')} />
    <ControlButton iconName="paper" onPress={() => onChoice('paper')} />
    <ControlButton iconName="scissors" onPress={() => onChoice('scissors')} />
  </View>
);

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3a3a3a',
  },
  pressed: {
    backgroundColor: 'rgba(255, 0, 255, 0.3)',
    borderColor: '#ff00ff',
  },
}); 