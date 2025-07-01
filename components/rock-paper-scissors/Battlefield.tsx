import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Choice } from '../../hooks/useRockPaperScissors';
import { DotMatrixText } from './DotMatrixText';
import { PixelIcon } from './PixelIcon';

const ChoiceBox = ({ choice }: { choice: Choice | null }) => (
  <View style={styles.choiceBox}>
    <PixelIcon name={choice} size={80} />
  </View>
);

interface BattlefieldProps {
  playerChoice: Choice | null;
  computerChoice: Choice | null;
}

export const Battlefield = ({ playerChoice, computerChoice }: BattlefieldProps) => (
  <View style={styles.battlefield}>
    <ChoiceBox choice={playerChoice} />
    <DotMatrixText text="VS" dotSize={4} />
    <ChoiceBox choice={computerChoice} />
  </View>
);

const styles = StyleSheet.create({
  battlefield: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 40,
  },
  choiceBox: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 