import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ICON_DATA } from '../../utils/pixelFont';

type IconName = 'rock' | 'paper' | 'scissors';

interface PixelIconProps {
  name: IconName | null;
  size?: number;
  color?: string;
  offColor?: string;
}

export const PixelIcon = memo(({ name, size = 8, color = 'white', offColor = 'transparent' }: PixelIconProps) => {
  const iconData = name ? ICON_DATA[name] : null;
  const dotSize = size / 8; // Assuming 8x8 grid

  if (!iconData) {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View>
      {iconData.map((row, rIndex) => (
        <View key={rIndex} style={styles.row}>
          {row.map((dot, dIndex) => (
            <View
              key={dIndex}
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: dot === 1 ? color : offColor,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
}); 