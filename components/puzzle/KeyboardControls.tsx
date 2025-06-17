import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react-native';

type KeyboardControlsProps = {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
};

const KeyboardControls: React.FC<KeyboardControlsProps> = ({ onMove }) => {
  return (
    <View style={styles.controlContainer}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.controlButton} onPress={() => onMove('up')}>
          <ArrowUp size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.controlButton} onPress={() => onMove('left')}>
          <ArrowLeft size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => onMove('down')}>
          <ArrowDown size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => onMove('right')}>
          <ArrowRight size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  controlButton: {
    backgroundColor: '#bbada0',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 8,
  },
});

export default KeyboardControls;
