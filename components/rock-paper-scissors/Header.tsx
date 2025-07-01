import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DotMatrixText } from './DotMatrixText';

export const Header = () => (
  <View style={styles.headerContainer}>
    <DotMatrixText text="1P" dotSize={2} color="#fff" offColor="transparent" />
    <DotMatrixText text="ROCK PAPER SCISSORS" dotSize={2.5} />
    <DotMatrixText text="VS CPU" dotSize={2} color="#fff" offColor="transparent" />
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 0, 255, 0.3)',
  },
}); 