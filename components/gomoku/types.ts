// 게임 상수
export const BOARD_SIZE = 15;
export const WINNING_LENGTH = 5;

// 게임 모드
export type GameMode = 'human-vs-human' | 'human-vs-cpu' | 'cpu-vs-cpu';

// 게임 상태
export type GameStatus = 'playing' | 'won' | 'draw';

// 플레이어 타입
export type GomokuPlayer = 'black' | 'white';

// 바둑돌 타입
export type GomokuCell = GomokuPlayer | null;

// 보드 배열 타입
export type BoardArray = readonly (readonly GomokuCell[])[];

// 방향 타입 (row, col)
export type Direction = readonly [number, number];

// 보드 위치 타입
export interface BoardPosition {
  readonly row: number;
  readonly col: number;
}

// 게임 상태 인터페이스
export interface GameState {
  readonly board: readonly (readonly GomokuCell[])[];
  readonly currentPlayer: GomokuPlayer;
  readonly gameStatus: GameStatus;
  readonly winner: GomokuPlayer | null;
  readonly moveCount: number;
  readonly lastMove: BoardPosition | null;
  readonly gameMode: GameMode;
  readonly isAITurn: boolean;
}

// 게임 액션 타입
export type GameAction = 
  | { type: 'MAKE_MOVE'; position: BoardPosition }
  | { type: 'RESET_GAME' }
  | { type: 'SET_WINNER'; winner: GomokuPlayer }
  | { type: 'SET_DRAW' };

// 컴포넌트 Props 타입들
export interface GomokuBoardProps {
  readonly board: readonly (readonly GomokuCell[])[];
  readonly onCellPress: (position: BoardPosition) => void;
  readonly gameOver: boolean;
  readonly lastMove: BoardPosition | null;
}

export interface GomokuHeaderProps {
  readonly currentPlayer: GomokuPlayer;
  readonly moveCount: number;
  readonly gameStatus: GameStatus;
  readonly onReset: () => void;
  readonly gameMode: GameMode;
  readonly onExit: () => void;
}

export interface GomokuCellProps {
  readonly value: GomokuCell;
  readonly position: BoardPosition;
  readonly onPress: (position: BoardPosition) => void;
  readonly disabled: boolean;
  readonly isLastMove: boolean;
  readonly cellSize?: number;
}

export interface GomokuStartScreenProps {
  readonly onStart: (mode: GameMode) => void;
  readonly onExit: () => void;
  readonly highScore: number;
}

// 게임 로직 함수 타입들
export interface GameLogic {
  readonly isValidMove: (board: BoardArray, position: BoardPosition) => boolean;
  readonly checkWinner: (board: BoardArray, position: BoardPosition, player: GomokuPlayer) => boolean;
  readonly isBoardFull: (board: BoardArray) => boolean;
  readonly getNextPlayer: (currentPlayer: GomokuPlayer) => GomokuPlayer;
  readonly createEmptyBoard: () => BoardArray;
} 