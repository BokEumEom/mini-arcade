import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DotMatrixText } from './DotMatrixText';

interface ScoreDisplayProps {
  playerScore: number;
  computerScore: number;
}

export const ScoreDisplay = ({ playerScore, computerScore }: ScoreDisplayProps) => (
  <View style={styles.scoreBoard}>
    <View style={styles.scoreContainer}>
      <DotMatrixText text="PLAYER" dotSize={2} color="white" offColor="transparent" />
      <DotMatrixText text={String(playerScore)} dotSize={3} color="white" offColor="transparent" />
    </View>
    <View style={styles.scoreContainer}>
      <DotMatrixText text="COMPUTER" dotSize={2} color="white" offColor="transparent" />
      <DotMatrixText text={String(computerScore)} dotSize={3} color="white" offColor="transparent" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a3a3a',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  scoreContainer: {
    alignItems: 'center',
    rowGap: 5,
  },
}); 