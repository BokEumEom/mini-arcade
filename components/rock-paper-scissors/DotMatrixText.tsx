import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { FONT_DATA } from '../../utils/pixelFont';

interface DotMatrixTextProps {
  text: string;
  dotSize?: number;
  color?: string;
  offColor?: string;
  letterSpacing?: number;
}

const Dot = memo(({ on, size, color, offColor }: { on: boolean; size: number; color: string; offColor: string }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: on ? color : offColor, margin: size / 4 }} />
));

const Char = memo(({ charData, dotSize, color, offColor }: { charData: number[][]; dotSize: number; color: string; offColor: string }) => (
  <View style={{ marginRight: dotSize }}>
    {charData.map((row, rIndex) => (
      <View key={rIndex} style={styles.row}>
        {row.map((dot, dIndex) => (
          <Dot key={dIndex} on={dot === 1} size={dotSize} color={color} offColor={offColor} />
        ))}
      </View>
    ))}
  </View>
));

export const DotMatrixText = memo(({ text, dotSize = 3, color = '#ff00ff', offColor = 'rgba(255, 0, 255, 0.1)', letterSpacing = 5 }: DotMatrixTextProps) => {
  const chars = text.toUpperCase().split('');

  return (
    <View style={[styles.container, { columnGap: letterSpacing }]}>
      {chars.map((char, index) => {
        const charData = FONT_DATA[char] || FONT_DATA[' '];
        return <Char key={index} charData={charData} dotSize={dotSize} color={color} offColor={offColor} />;
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
}); 