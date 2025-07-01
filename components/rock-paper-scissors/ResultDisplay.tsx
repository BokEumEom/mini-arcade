import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DotMatrixText } from './DotMatrixText';

interface ResultDisplayProps {
  result: string;
}

export const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return <View style={styles.placeholder} />;

  return (
    <View style={styles.resultContainer}>
      <DotMatrixText text={result} dotSize={5} color="#00ffff" offColor="rgba(0, 255, 255, 0.1)" />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 60,
  },
  resultContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 