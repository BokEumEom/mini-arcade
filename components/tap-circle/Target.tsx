import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TargetProps {
  x: number;
  y: number;
  type: 'normal' | 'special' | 'bomb';
  size: number;
}

export const Target = ({ x, y, type, size }: TargetProps) => {
  const getTargetColor = () => {
    switch (type) {
      case 'special':
        return '#FFD700';
      case 'bomb':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };

  const getTargetIcon = () => {
    switch (type) {
      case 'special':
        return 'star';
      case 'bomb':
        return 'bomb';
      default:
        return 'circle';
    }
  };

  return (
    <View
      style={[
        styles.target,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          backgroundColor: getTargetColor(),
        },
      ]}
    >
      <MaterialCommunityIcons
        name={getTargetIcon()}
        size={size * 0.6}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  target: {
    position: 'absolute',
    borderRadius: 999,
    justifyContent: 'center',
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
}); 