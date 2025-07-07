import {
  BOARD_SIZE,
  BoardArray,
  BoardPosition,
  Direction,
  GameLogic,
  GameMode,
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

// AI를 위한 평가 함수들
const evaluatePosition = (board: BoardArray, position: BoardPosition, player: GomokuPlayer): number => {
  if (!gameLogic.isValidMove(board, position)) return -1;
  
  // 임시로 돌을 놓아서 평가
  const tempBoard = board.map((row, rowIndex) => 
    row.map((cell, colIndex) => 
      rowIndex === position.row && colIndex === position.col ? player : cell
    )
  ) as BoardArray;
  
  let score = 0;
  
  // 각 방향으로 연속된 돌 개수 확인
  for (const direction of DIRECTIONS) {
    const count = countConsecutiveStones(tempBoard, position, direction, player);
    if (count >= 5) return 10000; // 승리
    if (count === 4) score += 1000; // 4목
    if (count === 3) score += 100; // 3목
    if (count === 2) score += 10; // 2목
  }
  
  // 중앙에 가까울수록 높은 점수
  const centerDistance = Math.abs(position.row - 7) + Math.abs(position.col - 7);
  score += (14 - centerDistance) * 2;
  
  return score;
};

// AI가 다음 수를 결정하는 함수
export const getAIMove = (board: BoardArray, aiPlayer: GomokuPlayer): BoardPosition | null => {
  const humanPlayer = aiPlayer === 'black' ? 'white' : 'black';
  let bestScore = -Infinity;
  let bestMove: BoardPosition | null = null;
  
  // 모든 가능한 위치를 평가
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const position: BoardPosition = { row, col };
      
      if (!gameLogic.isValidMove(board, position)) continue;
      
      // AI의 점수
      const aiScore = evaluatePosition(board, position, aiPlayer);
      
      // 상대방의 점수 (방어)
      const humanScore = evaluatePosition(board, position, humanPlayer);
      
      // 종합 점수 (공격 + 방어)
      const totalScore = aiScore + humanScore * 0.9;
      
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMove = position;
      }
    }
  }
  
  return bestMove;
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
export const createInitialGameState = (gameMode: GameMode = 'human-vs-human'): GameState => {
  const isAITurn = (() => {
    switch (gameMode) {
      case 'human-vs-human':
        return false;
      case 'human-vs-cpu':
        return false; // 사람이 먼저 시작
      case 'cpu-vs-cpu':
        return true; // AI가 먼저 시작
      default:
        return false;
    }
  })();

  return {
    board: gameLogic.createEmptyBoard(),
    currentPlayer: 'black',
    gameStatus: 'playing',
    winner: null,
    moveCount: 0,
    lastMove: null,
    gameMode,
    isAITurn,
  };
};

// 수를 두는 함수
export const makeMove = (
  currentState: GameState, 
  position: BoardPosition
): GameState | null => {
  console.log('🎯 makeMove 호출:', {
    position,
    currentPlayer: currentState.currentPlayer,
    gameStatus: currentState.gameStatus,
    moveCount: currentState.moveCount,
    gameMode: currentState.gameMode
  });

  // 유효하지 않은 수인 경우
  if (!gameLogic.isValidMove(currentState.board, position)) {
    console.log('❌ 유효하지 않은 수:', position);
    return null;
  }

  // 게임이 이미 끝난 경우
  if (currentState.gameStatus !== 'playing') {
    console.log('❌ 게임이 이미 끝남:', currentState.gameStatus);
    return null;
  }

  console.log('✅ 수를 두기 시작:', {
    position,
    player: currentState.currentPlayer,
    boardAtPosition: currentState.board[position.row][position.col]
  });

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

  console.log('🔄 보드 업데이트 완료:', {
    newMoveCount,
    nextPlayer,
    positionValue: newBoard[position.row][position.col]
  });

  // 승리 조건 확인
  if (gameLogic.checkWinner(newBoard, position, currentState.currentPlayer)) {
    console.log('🏆 승리 조건 만족:', currentState.currentPlayer);
    return {
      board: newBoard,
      currentPlayer: nextPlayer,
      gameStatus: 'won',
      winner: currentState.currentPlayer,
      moveCount: newMoveCount,
      lastMove: position,
      gameMode: currentState.gameMode,
      isAITurn: false,
    };
  }

  // 무승부 확인
  if (gameLogic.isBoardFull(newBoard)) {
    console.log('🤝 무승부 조건 만족');
    return {
      board: newBoard,
      currentPlayer: nextPlayer,
      gameStatus: 'draw',
      winner: null,
      moveCount: newMoveCount,
      lastMove: position,
      gameMode: currentState.gameMode,
      isAITurn: false,
    };
  }

  // 게임 계속 - AI 턴 로직 수정
  const isNextPlayerAI = (() => {
    switch (currentState.gameMode) {
      case 'human-vs-human':
        return false;
      case 'human-vs-cpu':
        // human-vs-cpu에서는 백돌(white)이 AI
        return nextPlayer === 'white';
      case 'cpu-vs-cpu':
        return true;
      default:
        return false;
    }
  })();

  console.log('🔄 게임 계속:', {
    nextPlayer,
    isNextPlayerAI,
    gameMode: currentState.gameMode
  });

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    gameStatus: 'playing',
    winner: null,
    moveCount: newMoveCount,
    lastMove: position,
    gameMode: currentState.gameMode,
    isAITurn: isNextPlayerAI,
  };
}; 