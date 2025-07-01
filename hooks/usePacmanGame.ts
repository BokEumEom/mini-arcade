import {
  BOARD_SIZE,
  COLORS,
  Direction,
  DIRECTIONS,
  GAME_SPEED,
  GAME_STATES,
  SCORES
} from '@/constants/pac-man/constants';
import { PACMAN_MAP_LAYOUT } from '@/constants/pac-man/mapLayout';
import {
  GameAction,
  GameBoard,
  Ghost,
  PacmanGameState,
  Position
} from '@/types/games/pac-man';
import { useCallback, useEffect, useReducer, useRef } from 'react';

// 초기 게임 상태
const createInitialState = (): PacmanGameState => {
  const { board, ghostPositions, pacmanStart } = createInitialBoard();
  return {
    gameState: GAME_STATES.MENU,
    board,
    pacman: {
      position: pacmanStart,
      direction: 'RIGHT',
      isAlive: true,
      isPoweredUp: false,
      powerUpTimeLeft: 0,
    },
    ghosts: createInitialGhosts(ghostPositions),
    score: 0,
    lives: 3,
    level: 1,
    dotsRemaining: countDots(board),
    currentGhostIndex: 0,
    ghostReleaseTimer: 0,
  };
};

// PACMAN_MAP_LAYOUT 기반 보드 생성 및 유령/팩맨 위치 파싱
function createInitialBoard(): { board: GameBoard, ghostPositions: Position[], pacmanStart: Position } {
  const board: GameBoard = [];
  const ghostPositions: Position[] = [];
  let pacmanStart: Position = { x: 1, y: 1 };

  for (let y = 0; y < PACMAN_MAP_LAYOUT.length; y++) {
    const row: any[] = [];
    for (let x = 0; x < PACMAN_MAP_LAYOUT[y].length; x++) {
      const char = PACMAN_MAP_LAYOUT[y][x];
      if (char === '#') {
        row.push('wall');
      } else if (char === '.') {
        row.push('dot');
      } else if (char === 'o') {
        row.push('power-pellet');
      } else if (char === 'G') {
        row.push('empty');
        ghostPositions.push({ x, y });
      } else if (char === 'P') {
        row.push('empty');
        pacmanStart = { x, y };
      } else if (char === ' ') {
        row.push('empty');
      } else {
        row.push('empty');
      }
    }
    board.push(row);
  }
  return { board, ghostPositions, pacmanStart };
}

// 유령 생성: G 위치 기반
function createInitialGhosts(ghostPositions: Position[]): Ghost[] {
  const ghostColors = [COLORS.GHOST_RED, COLORS.GHOST_PINK, COLORS.GHOST_CYAN, COLORS.GHOST_ORANGE];
  return ghostPositions.map((pos, idx) => ({
    id: `ghost${idx}`,
    position: pos,
    direction: 'LEFT',
    color: ghostColors[idx % ghostColors.length],
    isFrightened: false,
    isEaten: false,
    isWaiting: true,
    targetPosition: pos,
  }));
}

// 점 개수 세기
function countDots(board: GameBoard): number {
  return board.flat().filter(cell => cell === 'dot' || cell === 'power-pellet').length;
}

// 유령 AI 로직
function moveGhosts(ghosts: Ghost[], board: GameBoard, pacmanPosition: Position, isPoweredUp: boolean): Ghost[] {
  return ghosts.map(ghost => {
    if (ghost.isEaten) return ghost;
    
    const possibleDirections = getPossibleDirections(ghost.position, board);
    if (possibleDirections.length === 0) return ghost;
    
    let targetDirection: Direction;
    
    if (isPoweredUp) {
      // 겁에 질렸을 때는 팩맨에서 멀어지는 방향으로 이동
      targetDirection = getDirectionAwayFromPacman(ghost.position, pacmanPosition, possibleDirections, ghost.isWaiting);
    } else {
      // 일반 상태에서는 팩맨을 향해 이동
      targetDirection = getDirectionTowardsPacman(ghost.position, pacmanPosition, possibleDirections, ghost.isWaiting);
    }
    
    const newPosition = calculateNewPosition(ghost.position, targetDirection);
    
    return {
      ...ghost,
      position: newPosition,
      direction: targetDirection,
    };
  });
}

// 가능한 이동 방향 구하기
function getPossibleDirections(position: Position, board: GameBoard): Direction[] {
  const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  return directions.filter(direction => {
    const newPos = calculateNewPosition(position, direction);
    return isValidMove(newPos, board);
  });
}

// 팩맨을 향한 방향 구하기
function getDirectionTowardsPacman(ghostPosition: Position, pacmanPosition: Position, possibleDirections: Direction[], isWaiting: boolean): Direction {
  // 고스트가 중앙 영역에 있는지 확인 (y: 9-10, x: 8-11)
  const isInCenter = ghostPosition.y >= 9 && ghostPosition.y <= 10 && ghostPosition.x >= 8 && ghostPosition.x <= 11;
  
  // 대기 중인 고스트는 중앙 영역에서 벗어나지 않음
  if (isWaiting && isInCenter) {
    console.log(`Waiting ghost at ${ghostPosition.x},${ghostPosition.y} staying in center`);
    // 대기 중일 때는 제자리에서 랜덤하게 이동
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  }
  
  if (isInCenter) {
    console.log(`Ghost at ${ghostPosition.x},${ghostPosition.y} is in center. Possible directions:`, possibleDirections);
    // 중앙 영역에 있을 때는 우선적으로 위쪽으로 나오려고 시도
    if (possibleDirections.includes('UP')) {
      console.log('Ghost moving UP to escape center');
      return 'UP';
    }
    // 위쪽이 불가능하면 다른 방향 시도
    const escapeDirections = ['LEFT', 'RIGHT', 'DOWN'];
    for (const direction of escapeDirections) {
      if (possibleDirections.includes(direction as Direction)) {
        console.log(`Ghost moving ${direction} to escape center`);
        return direction as Direction;
      }
    }
    // 모든 방향이 불가능하면 랜덤하게 이동
    const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    console.log(`Ghost moving randomly: ${randomDirection}`);
    return randomDirection;
  }
  
  const dx = pacmanPosition.x - ghostPosition.x;
  const dy = pacmanPosition.y - ghostPosition.y;
  
  // 우선순위: 가로 이동 > 세로 이동
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && possibleDirections.includes('RIGHT')) return 'RIGHT';
    if (dx < 0 && possibleDirections.includes('LEFT')) return 'LEFT';
  }
  
  if (dy > 0 && possibleDirections.includes('DOWN')) return 'DOWN';
  if (dy < 0 && possibleDirections.includes('UP')) return 'UP';
  
  // 기본값: 첫 번째 가능한 방향
  return possibleDirections[0];
}

// 팩맨에서 멀어지는 방향 구하기
function getDirectionAwayFromPacman(ghostPosition: Position, pacmanPosition: Position, possibleDirections: Direction[], isWaiting: boolean): Direction {
  // 고스트가 중앙 영역에 있는지 확인
  const isInCenter = ghostPosition.y >= 9 && ghostPosition.y <= 10 && ghostPosition.x >= 8 && ghostPosition.x <= 11;
  
  // 대기 중인 고스트는 중앙 영역에서 벗어나지 않음
  if (isWaiting && isInCenter) {
    console.log(`Frightened waiting ghost at ${ghostPosition.x},${ghostPosition.y} staying in center`);
    // 대기 중일 때는 제자리에서 랜덤하게 이동
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  }
  
  if (isInCenter) {
    console.log(`Frightened ghost at ${ghostPosition.x},${ghostPosition.y} is in center. Possible directions:`, possibleDirections);
    // 중앙 영역에 있을 때는 우선적으로 위쪽으로 나오려고 시도
    if (possibleDirections.includes('UP')) {
      console.log('Frightened ghost moving UP to escape center');
      return 'UP';
    }
    // 위쪽이 불가능하면 다른 방향 시도
    const escapeDirections = ['LEFT', 'RIGHT', 'DOWN'];
    for (const direction of escapeDirections) {
      if (possibleDirections.includes(direction as Direction)) {
        console.log(`Frightened ghost moving ${direction} to escape center`);
        return direction as Direction;
      }
    }
    // 모든 방향이 불가능하면 랜덤하게 이동
    const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    console.log(`Frightened ghost moving randomly: ${randomDirection}`);
    return randomDirection;
  }
  
  const dx = pacmanPosition.x - ghostPosition.x;
  const dy = pacmanPosition.y - ghostPosition.y;
  
  // 팩맨과 반대 방향으로 이동
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && possibleDirections.includes('LEFT')) return 'LEFT';
    if (dx < 0 && possibleDirections.includes('RIGHT')) return 'RIGHT';
  }
  
  if (dy > 0 && possibleDirections.includes('UP')) return 'UP';
  if (dy < 0 && possibleDirections.includes('DOWN')) return 'DOWN';
  
  // 기본값: 첫 번째 가능한 방향
  return possibleDirections[0];
}

// 충돌 감지
function checkCollisions(pacmanPosition: Position, ghosts: Ghost[], isPoweredUp: boolean): { ghostEaten?: string; pacmanEaten: boolean } {
  const collidingGhost = ghosts.find(ghost => 
    ghost.position.x === pacmanPosition.x && 
    ghost.position.y === pacmanPosition.y &&
    !ghost.isEaten
  );
  
  if (collidingGhost) {
    if (isPoweredUp) {
      return { ghostEaten: collidingGhost.id, pacmanEaten: false };
    } else {
      return { pacmanEaten: true };
    }
  }
  
  return { pacmanEaten: false };
}

// 게임 리듀서
function gameReducer(state: PacmanGameState, action: GameAction): PacmanGameState {
  switch (action.type) {
    case 'MOVE_PACMAN': {
      const newPosition = calculateNewPosition(state.pacman.position, action.direction);
      
      if (isValidMove(newPosition, state.board)) {
        // 새로운 위치의 셀 확인
        const cell = state.board[newPosition.y][newPosition.x];
        let newBoard = state.board;
        let newScore = state.score;
        let newDotsRemaining = state.dotsRemaining;
        let newPacman = {
          ...state.pacman,
          position: newPosition,
          direction: action.direction,
        };
        let newGhosts = state.ghosts;

        // 점수 아이템 수집
        if (cell === 'dot') {
          newBoard = [...state.board];
          newBoard[newPosition.y][newPosition.x] = 'empty';
          newScore += SCORES.DOT;
          newDotsRemaining -= 1;
        } else if (cell === 'power-pellet') {
          newBoard = [...state.board];
          newBoard[newPosition.y][newPosition.x] = 'empty';
          newScore += SCORES.POWER_PELLET;
          newDotsRemaining -= 1;
          newPacman = {
            ...newPacman,
            isPoweredUp: true,
            powerUpTimeLeft: GAME_SPEED.POWER_PELLET_DURATION,
          };
          newGhosts = state.ghosts.map(ghost => ({
            ...ghost,
            isFrightened: true,
          }));
        }

        // 충돌 확인
        const collision = checkCollisions(newPosition, newGhosts, newPacman.isPoweredUp);
        if (collision.ghostEaten) {
          newScore += SCORES.GHOST;
          newGhosts = newGhosts.map(g => 
            g.id === collision.ghostEaten 
              ? { ...g, isEaten: true, position: { x: 14, y: 14 } }
              : g
          );
        } else if (collision.pacmanEaten) {
          return {
            ...state,
            lives: state.lives - 1,
            pacman: {
              ...newPacman,
              isAlive: false,
            },
            gameState: state.lives <= 1 ? GAME_STATES.GAME_OVER : GAME_STATES.PLAYING,
          };
        }

        // 레벨 완료 확인
        if (newDotsRemaining <= 0) {
          return {
            ...state,
            board: newBoard,
            score: newScore,
            dotsRemaining: newDotsRemaining,
            pacman: newPacman,
            ghosts: newGhosts,
            gameState: GAME_STATES.LEVEL_COMPLETE,
          };
        }

        return {
          ...state,
          board: newBoard,
          score: newScore,
          dotsRemaining: newDotsRemaining,
          pacman: newPacman,
          ghosts: newGhosts,
        };
      }
      return state;
    }
    
    case 'MOVE_GHOSTS': {
      // 고스트 해제 타이머 업데이트
      let newGhostReleaseTimer = state.ghostReleaseTimer + 1;
      let newGhosts = [...state.ghosts];
      
      // 30틱(약 3초) 후에 고스트들이 대기 상태 해제
      if (newGhostReleaseTimer >= 30) {
        newGhosts = newGhosts.map(ghost => ({
          ...ghost,
          isWaiting: false,
        }));
      }
      
      // 현재 인덱스의 고스트만 이동
      const currentGhost = newGhosts[state.currentGhostIndex];
      console.log(`Moving ghost ${state.currentGhostIndex}:`, currentGhost?.id, 'at position:', currentGhost?.position, 'isWaiting:', currentGhost?.isWaiting);
      
      if (!currentGhost || currentGhost.isEaten) {
        // 다음 고스트로 넘어감
        const nextIndex = (state.currentGhostIndex + 1) % newGhosts.length;
        console.log(`Ghost ${state.currentGhostIndex} is eaten or null, moving to next ghost: ${nextIndex}`);
        return {
          ...state,
          ghosts: newGhosts,
          currentGhostIndex: nextIndex,
          ghostReleaseTimer: newGhostReleaseTimer,
        };
      }

      // 현재 고스트만 이동
      const movedGhosts = [...newGhosts];
      const possibleDirections = getPossibleDirections(currentGhost.position, state.board);
      console.log(`Ghost ${currentGhost.id} possible directions:`, possibleDirections);
      
      if (possibleDirections.length > 0) {
        let targetDirection: Direction;
        
        if (state.pacman.isPoweredUp) {
          // 겁에 질렸을 때는 팩맨에서 멀어지는 방향으로 이동
          targetDirection = getDirectionAwayFromPacman(currentGhost.position, state.pacman.position, possibleDirections, currentGhost.isWaiting);
        } else {
          // 일반 상태에서는 팩맨을 향해 이동
          targetDirection = getDirectionTowardsPacman(currentGhost.position, state.pacman.position, possibleDirections, currentGhost.isWaiting);
        }
        
        const newPosition = calculateNewPosition(currentGhost.position, targetDirection);
        console.log(`Ghost ${currentGhost.id} moving from ${currentGhost.position.x},${currentGhost.position.y} to ${newPosition.x},${newPosition.y} (${targetDirection})`);
        
        movedGhosts[state.currentGhostIndex] = {
          ...currentGhost,
          position: newPosition,
          direction: targetDirection,
        };
      } else {
        console.log(`Ghost ${currentGhost.id} has no possible directions`);
      }
      
      // 충돌 확인
      const collision = checkCollisions(state.pacman.position, movedGhosts, state.pacman.isPoweredUp);
      
      let newState = {
        ...state,
        ghosts: movedGhosts,
        currentGhostIndex: (state.currentGhostIndex + 1) % movedGhosts.length, // 다음 고스트로
        ghostReleaseTimer: newGhostReleaseTimer,
      };
      
      if (collision.ghostEaten) {
        newState = {
          ...newState,
          score: newState.score + SCORES.GHOST,
          ghosts: newState.ghosts.map(g => 
            g.id === collision.ghostEaten 
              ? { ...g, isEaten: true, position: { x: 14, y: 14 } }
              : g
          ),
        };
      } else if (collision.pacmanEaten) {
        newState = {
          ...newState,
          lives: newState.lives - 1,
          pacman: {
            ...newState.pacman,
            isAlive: false,
          },
          gameState: newState.lives <= 1 ? GAME_STATES.GAME_OVER : GAME_STATES.PLAYING,
        };
      }
      
      return newState;
    }
    
    case 'COLLECT_DOT': {
      const newBoard = [...state.board];
      newBoard[action.position.y][action.position.x] = 'empty';
      
      return {
        ...state,
        board: newBoard,
        score: state.score + SCORES.DOT,
        dotsRemaining: state.dotsRemaining - 1,
      };
    }
    
    case 'COLLECT_POWER_PELLET': {
      const newBoard = [...state.board];
      newBoard[action.position.y][action.position.x] = 'empty';
      
      return {
        ...state,
        board: newBoard,
        score: state.score + SCORES.POWER_PELLET,
        dotsRemaining: state.dotsRemaining - 1,
        pacman: {
          ...state.pacman,
          isPoweredUp: true,
          powerUpTimeLeft: GAME_SPEED.POWER_PELLET_DURATION,
        },
        ghosts: state.ghosts.map(ghost => ({
          ...ghost,
          isFrightened: true,
        })),
      };
    }
    
    case 'EAT_GHOST': {
      const ghost = state.ghosts.find(g => g.id === action.ghostId);
      if (!ghost) return state;
      
      return {
        ...state,
        score: state.score + SCORES.GHOST,
        ghosts: state.ghosts.map(g => 
          g.id === action.ghostId 
            ? { ...g, isEaten: true, position: { x: 14, y: 14 } }
            : g
        ),
      };
    }
    
    case 'GHOST_EAT_PACMAN': {
      return {
        ...state,
        lives: state.lives - 1,
        pacman: {
          ...state.pacman,
          isAlive: false,
        },
        gameState: state.lives <= 1 ? GAME_STATES.GAME_OVER : GAME_STATES.PLAYING,
      };
    }
    
    case 'POWER_UP_EXPIRED': {
      return {
        ...state,
        pacman: {
          ...state.pacman,
          isPoweredUp: false,
          powerUpTimeLeft: 0,
        },
        ghosts: state.ghosts.map(ghost => ({
          ...ghost,
          isFrightened: false,
        })),
      };
    }
    
    case 'LEVEL_COMPLETE': {
      const { board, ghostPositions, pacmanStart } = createInitialBoard();
      return {
        ...state,
        level: state.level + 1,
        board,
        pacman: {
          ...state.pacman,
          position: pacmanStart,
          direction: 'RIGHT',
          isAlive: true,
          isPoweredUp: false,
          powerUpTimeLeft: 0,
        },
        ghosts: createInitialGhosts(ghostPositions),
        dotsRemaining: countDots(board),
        currentGhostIndex: 0,
        ghostReleaseTimer: 0,
        gameState: GAME_STATES.PLAYING,
      };
    }
    
    case 'GAME_OVER': {
      return {
        ...state,
        gameState: GAME_STATES.GAME_OVER,
      };
    }
    
    case 'RESTART_GAME': {
      const initialState = createInitialState();
      return {
        ...initialState,
        currentGhostIndex: 0,
        ghostReleaseTimer: 0,
        gameState: GAME_STATES.PLAYING,
      };
    }
    
    case 'PAUSE_GAME': {
      return {
        ...state,
        gameState: GAME_STATES.PAUSED,
      };
    }
    
    case 'RESUME_GAME': {
      return {
        ...state,
        gameState: GAME_STATES.PLAYING,
      };
    }
    
    default:
      return state;
  }
}

// 새로운 위치 계산
function calculateNewPosition(current: Position, direction: Direction): Position {
  const dir = DIRECTIONS[direction];
  return {
    x: current.x + dir.x,
    y: current.y + dir.y,
  };
}

// 유효한 이동인지 확인
function isValidMove(position: Position, board: GameBoard): boolean {
  if (position.x < 0 || position.x >= BOARD_SIZE.WIDTH || 
      position.y < 0 || position.y >= BOARD_SIZE.HEIGHT) {
    return false;
  }
  
  return board[position.y][position.x] !== 'wall';
}

// 팩맨 게임 훅
export function usePacmanGame() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const powerUpTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 게임 시작
  const startGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  // 게임 일시정지/재개
  const togglePause = useCallback(() => {
    if (state.gameState === GAME_STATES.PLAYING) {
      dispatch({ type: 'PAUSE_GAME' });
    } else if (state.gameState === GAME_STATES.PAUSED) {
      dispatch({ type: 'RESUME_GAME' });
    }
  }, [state.gameState]);

  // 팩맨 이동
  const movePacman = useCallback((direction: Direction) => {
    if (state.gameState !== GAME_STATES.PLAYING) return;
    
    dispatch({ type: 'MOVE_PACMAN', direction });
  }, [state.gameState]);

  // 게임 리셋
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  // 게임 루프
  useEffect(() => {
    if (state.gameState !== GAME_STATES.PLAYING) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      // 한 번에 한 고스트씩 이동
      dispatch({ type: 'MOVE_GHOSTS' });
    }, GAME_SPEED.GHOST);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [state.gameState]);

  // 파워업 타이머
  useEffect(() => {
    if (state.pacman.isPoweredUp && state.pacman.powerUpTimeLeft > 0) {
      powerUpTimerRef.current = setTimeout(() => {
        dispatch({ type: 'POWER_UP_EXPIRED' });
      }, state.pacman.powerUpTimeLeft);
    }

    return () => {
      if (powerUpTimerRef.current) {
        clearTimeout(powerUpTimerRef.current);
      }
    };
  }, [state.pacman.isPoweredUp, state.pacman.powerUpTimeLeft]);

  return {
    state,
    startGame,
    togglePause,
    movePacman,
    resetGame,
  };
} 