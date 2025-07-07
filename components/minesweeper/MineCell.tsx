import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type MineCellState = 'hidden' | 'revealed' | 'flagged';
export type MineCellValue = number | 'mine';

interface MineCellProps {
  state: MineCellState;
  value: MineCellValue;
  onPress: () => void;
  onLongPress: () => void;
  onDoublePress?: () => void;
  size: number;
}

const NUMBER_COLORS = [
  undefined,
  '#0000ff', // 1
  '#008200', // 2
  '#ff0000', // 3
  '#000084', // 4
  '#840000', // 5
  '#008284', // 6
  '#000000', // 7
  '#757575', // 8
];

export const MineCell: React.FC<MineCellProps> = ({ state, value, onPress, onLongPress, onDoublePress, size }) => {
  // 더블탭 감지
  const lastTap = useRef<number>(0);
  const handlePress = () => {
    const now = Date.now();
    if (onDoublePress && now - lastTap.current < 250) {
      onDoublePress();
    } else {
      onPress();
    }
    lastTap.current = now;
  };

  // 3D 스타일
  const baseStyle = [
    styles.cell,
    { width: size, height: size },
    state === 'revealed' ? styles.revealed : styles.unrevealed,
  ];

  // 내용
  let content = null;
  if (state === 'flagged') {
    content = (
      <View style={styles.flagContainer}>
        {/* 깃발: 검정 받침 + 빨간 깃발 */}
        <View style={styles.flagPole} />
        <View style={styles.flag} />
        <View style={styles.flagBase} />
      </View>
    );
  } else if (state === 'revealed') {
    if (value === 'mine') {
      content = (
        <View style={styles.mineContainer}>
          <View style={styles.mineBody} />
          {/* 8방향 돌기 */}
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.mineSpoke,
                {
                  transform: [
                    { rotate: `${i * 45}deg` },
                    { translateY: -size * 0.18 },
                  ],
                  width: size * 0.08,
                  height: size * 0.36,
                  left: size * 0.41,
                  top: size * 0.12,
                },
              ]}
            />
          ))}
          {/* 흰 점 */}
          <View style={styles.mineDot} />
        </View>
      );
    } else if (typeof value === 'number' && value > 0) {
      content = (
        <Text style={[styles.number, { color: NUMBER_COLORS[value], fontSize: size * 0.7 }]}>{value}</Text>
      );
    }
  }

  return (
    <TouchableOpacity
      style={baseStyle}
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      disabled={state === 'revealed'}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  unrevealed: {
    backgroundColor: '#bdbdbd',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderBottomColor: '#7b7b7b',
    borderRightColor: '#7b7b7b',
  },
  revealed: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  number: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  mineContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mineBody: {
    width: '60%',
    height: '60%',
    backgroundColor: '#111',
    borderRadius: 999,
    position: 'absolute',
    left: '20%',
    top: '20%',
  },
  mineSpoke: {
    position: 'absolute',
    backgroundColor: '#111',
    borderRadius: 2,
  },
  mineDot: {
    position: 'absolute',
    width: '18%',
    height: '18%',
    backgroundColor: '#fff',
    borderRadius: 999,
    left: '55%',
    top: '25%',
  },
  flagContainer: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flagPole: {
    width: '12%',
    height: '60%',
    backgroundColor: '#111',
    position: 'absolute',
    left: '44%',
    top: '10%',
    borderRadius: 2,
  },
  flag: {
    width: '38%',
    height: '28%',
    backgroundColor: '#d00',
    position: 'absolute',
    left: '44%',
    top: '10%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  flagBase: {
    width: '50%',
    height: '12%',
    backgroundColor: '#111',
    position: 'absolute',
    left: '25%',
    bottom: 0,
    borderRadius: 2,
  },
}); 