import {
    BOARD_SIZE,
    BoardArray,
    BoardPosition,
    Direction,
    GameLogic,
    GameState,
    GomokuCell,
    GomokuPlayer,
    WINNING_LENGTH
} from './types';

// 승리 체크를 위한 방향들
const DIRECTIONS: readonly Direction[] = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
] as const;

// 위치가 보드 범위 내에 있는지 확인
const isPositionInBounds = (position: BoardPosition): boolean => {
  return position.row >= 0 && 
         position.row < BOARD_SIZE && 
         position.col >= 0 && 
         position.col < BOARD_SIZE;
};

// 특정 방향으로 연속된 돌의 개수를 계산
const countConsecutiveStones = (
  board: BoardArray, 
  startPosition: BoardPosition, 
  direction: Direction, 
  player: GomokuPlayer
): number => {
  let count = 1; // 시작 위치의 돌 포함
  
  // 양방향으로 확인
  for (const multiplier of [-1, 1]) {
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newRow = startPosition.row + direction[0] * i * multiplier;
      const newCol = startPosition.col + direction[1] * i * multiplier;
      
      const position: BoardPosition = { row: newRow, col: newCol };
      
      if (!isPositionInBounds(position) || board[newRow][newCol] !== player) {
        break;
      }
      count++;
    }
  }
  
  return count;
};

// 게임 로직 구현
export const gameLogic: GameLogic = {
  // 유효한 수인지 확인
  isValidMove: (board: BoardArray, position: BoardPosition): boolean => {
    if (!isPositionInBounds(position)) {
      return false;
    }
    return board[position.row][position.col] === null;
  },

  // 승리 조건 확인
  checkWinner: (board: BoardArray, position: BoardPosition, player: GomokuPlayer): boolean => {
    return DIRECTIONS.some(direction => 
      countConsecutiveStones(board, position, direction, player) >= WINNING_LENGTH
    );
  },

  // 보드가 가득 찼는지 확인
  isBoardFull: (board: BoardArray): boolean => {
    return board.every(row => row.every(cell => cell !== null));
  },

  // 다음 플레이어 반환
  getNextPlayer: (currentPlayer: GomokuPlayer): GomokuPlayer => {
    return currentPlayer === 'black' ? 'white' : 'black';
  },

  // 빈 보드 생성
  createEmptyBoard: (): BoardArray => {
    return Array.from({ length: BOARD_SIZE }, () => 
      Array.from({ length: BOARD_SIZE }, () => null)
    ) as BoardArray;
  },
};

// 게임 상태 업데이트 함수들
export const createInitialGameState = (): GameState => ({
  board: gameLogic.createEmptyBoard(),
  currentPlayer: 'black',
  gameStatus: 'playing',
  winner: null,
  moveCount: 0,
  lastMove: null,
});

// 수를 두는 함수
export const makeMove = (
  currentState: GameState, 
  position: BoardPosition
): GameState | null => {
  // 유효하지 않은 수인 경우
  if (!gameLogic.isValidMove(currentState.board, position)) {
    return null;
  }

  // 게임이 이미 끝난 경우
  if (currentState.gameStatus !== 'playing') {
    return null;
  }

  // 새로운 보드 생성
  const newBoard = currentState.board.map((row: readonly GomokuCell[], rowIndex: number) =>
    row.map((cell: GomokuCell, colIndex: number) =>
      rowIndex === position.row && colIndex === position.col
        ? currentState.currentPlayer
        : cell
    )
  ) as BoardArray;

  const newMoveCount = currentState.moveCount + 1;
  const nextPlayer = gameLogic.getNextPlayer(currentState.currentPlayer);

  // 승리 조건 확인
  if (gameLogic.checkWinner(newBoard, position, currentState.currentPlayer)) {
    return {
      board: newBoard,
      currentPlayer: nextPlayer,
      gameStatus: 'won',
      winner: currentState.currentPlayer,
      moveCount: newMoveCount,
      lastMove: position,
    };
  }

  // 무승부 확인
  if (gameLogic.isBoardFull(newBoard)) {
    return {
      board: newBoard,
      currentPlayer: nextPlayer,
      gameStatus: 'draw',
      winner: null,
      moveCount: newMoveCount,
      lastMove: position,
    };
  }

  // 게임 계속
  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    gameStatus: 'playing',
    winner: null,
    moveCount: newMoveCount,
    lastMove: position,
  };
}; 