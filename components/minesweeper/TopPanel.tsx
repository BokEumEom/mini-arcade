import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TopPanelProps {
  level: 'E' | 'N' | 'H';
  mineCount: number;
  timer: number;
  onReset: () => void;
  onPause: () => void;
  onClose: () => void;
}

function formatDigits(num: number, length: number = 3) {
  return num.toString().padStart(length, '0').slice(-length);
}

export const TopPanel: React.FC<TopPanelProps> = ({
  level,
  mineCount,
  timer,
  onReset,
  onPause,
  onClose,
}) => {
  return (
    <View style={styles.panel}>
      <View style={styles.leftBox}>
        <View style={styles.levelBox}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
        <View style={styles.digitBox}>
          <Text style={styles.digitText}>{formatDigits(mineCount)}</Text>
        </View>
      </View>
      <View style={styles.centerBox}>
        <TouchableOpacity style={styles.smileBox} onPress={onReset}>
          <Text style={styles.smileText}>😊</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightBox}>
        <View style={styles.digitBox}>
          <Text style={styles.digitText}>{formatDigits(timer)}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={onPause}>
          <Text style={styles.iconText}>⏸️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
          <Text style={styles.iconText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bdbdbd',
    borderWidth: 3,
    borderColor: '#fff',
    borderBottomColor: '#7b7b7b',
    borderRightColor: '#7b7b7b',
    borderRadius: 6,
    margin: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
  },
  levelBox: {
    backgroundColor: '#222',
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  levelText: {
    color: '#ffe600',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  digitBox: {
    backgroundColor: '#222',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
    minWidth: 38,
    alignItems: 'center',
  },
  digitText: {
    color: '#ff2d2d',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 2,
  },
  smileBox: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#fff',
    borderBottomColor: '#7b7b7b',
    borderRightColor: '#7b7b7b',
    borderRadius: 6,
    padding: 4,
    marginHorizontal: 8,
    minWidth: 38,
    alignItems: 'center',
  },
  smileText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconBtn: {
    marginLeft: 4,
    padding: 2,
  },
  iconText: {
    fontSize: 20,
  },
}); 