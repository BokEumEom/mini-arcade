// 게임 상수
export const BOARD_SIZE = 15;
export const WINNING_LENGTH = 5;

// 플레이어 타입
export type GomokuPlayer = 'black' | 'white';

// 셀 타입
export type GomokuCell = GomokuPlayer | null;

// 게임 상태 타입
export type GameStatus = 'playing' | 'won' | 'draw';

// 방향 타입 (승리 체크용)
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
}

export interface GomokuCellProps {
  readonly value: GomokuCell;
  readonly position: BoardPosition;
  readonly onPress: (position: BoardPosition) => void;
  readonly disabled: boolean;
  readonly isLastMove: boolean;
}

// 유틸리티 타입들
export type BoardArray = readonly (readonly GomokuCell[])[];

// 게임 로직 함수 타입들
export interface GameLogic {
  readonly isValidMove: (board: BoardArray, position: BoardPosition) => boolean;
  readonly checkWinner: (board: BoardArray, position: BoardPosition, player: GomokuPlayer) => boolean;
  readonly isBoardFull: (board: BoardArray) => boolean;
  readonly getNextPlayer: (currentPlayer: GomokuPlayer) => GomokuPlayer;
  readonly createEmptyBoard: () => BoardArray;
} 