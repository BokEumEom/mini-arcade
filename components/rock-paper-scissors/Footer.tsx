import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DotMatrixText } from './DotMatrixText';

interface FooterProps {
  round: number;
}

export const Footer = ({ round }: FooterProps) => (
  <View style={styles.footerContainer}>
    <DotMatrixText text="C 2023 RETRO ARCADE" dotSize={1.5} color="white" offColor="transparent" />
    <DotMatrixText text={`ROUND: ${round}`} dotSize={1.5} color="white" offColor="transparent" />
    <DotMatrixText text="INSERT COIN" dotSize={1.5} color="white" offColor="transparent" />
  </View>
);

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderTopWidth: 2,
    borderColor: 'rgba(255, 0, 255, 0.3)',
  },
}); 