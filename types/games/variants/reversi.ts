export type DiscState = 'black' | 'white' | 'empty';
export type ReversiGameState = 'black' | 'white';

export interface ReversiBoard {
  board: DiscState[][];
  currentPlayer: ReversiGameState;
  blackCount: number;
  whiteCount: number;
  possibleMoves: [number, number][];
} 