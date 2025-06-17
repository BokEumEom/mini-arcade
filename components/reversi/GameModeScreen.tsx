import React, { memo } from 'react';
import { View } from 'react-native';
import GameModeSelection from '@/components/reversi/GameModeSelection';
import { AIPlayerType } from '@/hooks/useReversiGame';

interface GameModeScreenProps {
  animatedStyle: any;
  selectedMode: { singlePlayer: boolean; aiAs: AIPlayerType };
  onModeSelect: (singlePlayer: boolean, aiAs: AIPlayerType) => void;
  onStartGame: () => void;
}

const GameModeScreen = ({ 
  animatedStyle, 
  selectedMode, 
  onModeSelect, 
  onStartGame 
}: GameModeScreenProps) => (
  <View style={animatedStyle}>
    <GameModeSelection
      selectedMode={selectedMode}
      onModeSelect={onModeSelect}
      onStartGame={onStartGame}
    />
  </View>
);

export default memo(GameModeScreen); 