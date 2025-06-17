import { useReducer, useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import {
  initializeDiscs,
  initializeBlockedCells,
  canMove,
  getAffectedDiscs,
  flipDiscs,
  calculateAIMove,
  getPlayableCells,
  calculateScore,
} from '@/utils/reversiUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 타입 정의
export type DiscType = 'black' | 'white' | 'empty';
export type PlayerType = 'black' | 'white';
export type AIPlayerType = PlayerType | null;

export interface GameState {
  discs: DiscType[][];
  blockedCells: Set<string>;
  turn: PlayerType;
  score: { black: number; white: number };
  gameOver: boolean;
  gameStarted: boolean;
  isSinglePlayer: boolean;
  aiPlayer: AIPlayerType;
  playableCells: Set<string>;
  resultMessage: string | null;
}

// 액션 타입 정의
type GameAction = 
  | { type: 'RESET_GAME'; payload: { singlePlayer: boolean; aiAs: AIPlayerType } }
  | { type: 'SET_DISCS'; payload: DiscType[][] }
  | { type: 'SET_SCORE'; payload: { black: number; white: number } }
  | { type: 'SET_TURN'; payload: PlayerType }
  | { type: 'SET_RESULT_MESSAGE'; payload: string | null }
  | { type: 'SET_GAME_OVER'; payload: boolean }
  | { type: 'SET_PLAYABLE_CELLS'; payload: Set<string> }
  | { type: 'SET_GAME_STARTED'; payload: boolean };

// 초기 상태
const initialState: GameState = {
  discs: initializeDiscs(),
  blockedCells: initializeBlockedCells(),
  turn: 'black',
  score: { black: 2, white: 2 },
  gameOver: false,
  gameStarted: false,
  isSinglePlayer: false,
  aiPlayer: null,
  playableCells: new Set(),
  resultMessage: null,
};

// 리듀서 함수
const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'RESET_GAME':
      return {
        ...initialState,
        isSinglePlayer: action.payload.singlePlayer,
        aiPlayer: action.payload.aiAs,
      };
    case 'SET_DISCS':
      return { ...state, discs: action.payload };
    case 'SET_SCORE':
      return { ...state, score: action.payload };
    case 'SET_TURN':
      return { ...state, turn: action.payload };
    case 'SET_RESULT_MESSAGE':
      return { ...state, resultMessage: action.payload };
    case 'SET_GAME_OVER':
      return { ...state, gameOver: action.payload };
    case 'SET_PLAYABLE_CELLS':
      return { ...state, playableCells: action.payload };
    case 'SET_GAME_STARTED':
      return { ...state, gameStarted: action.payload };
    default:
      return state;
  }
};

export function useReversiGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // 애니메이션 값 정의
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(SCREEN_WIDTH);
  const scale = useSharedValue(0.8);

  // 애니메이션 스타일 정의
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { scale: scale.value }
      ],
      width: '100%',
      alignItems: 'center',
    };
  });

  // 컴포넌트 마운트 시 초기 애니메이션
  useEffect(() => {
    // 오른쪽에서 슬라이드 인 + 페이드 인 + 스케일 업
    translateX.value = withTiming(0, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    opacity.value = withTiming(1, { 
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    scale.value = withSpring(1, { 
      damping: 15,
      stiffness: 100
    });
  }, []);

  // 턴 변경 및 게임 종료 체크 로직
  useEffect(() => {
    if (!state.gameOver && state.gameStarted && !canMove(state.discs, state.turn, state.blockedCells)) {
      const nextTurn = state.turn === 'black' ? 'white' : 'black';
      if (!canMove(state.discs, nextTurn, state.blockedCells)) {
        endGame();
      } else {
        dispatch({
          type: 'SET_RESULT_MESSAGE',
          payload: `${state.turn.toUpperCase()} cannot move! Turn goes to ${nextTurn.toUpperCase()}.`,
        });
        dispatch({ type: 'SET_TURN', payload: nextTurn });
      }
    }
  }, [state.discs, state.turn, state.gameStarted]);

  // AI 이동 로직
  useEffect(() => {
    if (state.gameStarted && state.isSinglePlayer && state.aiPlayer === state.turn && !state.gameOver) {
      setTimeout(makeAIMove, 500);
    }
  }, [state.discs, state.turn, state.gameStarted]);

  // 플레이 가능한 셀 업데이트
  useEffect(() => {
    if (state.gameStarted && !state.gameOver) {
      const cells = getPlayableCells(state.discs, state.turn, state.blockedCells);
      dispatch({ type: 'SET_PLAYABLE_CELLS', payload: cells });
    }
  }, [state.discs, state.turn, state.gameStarted, state.gameOver]);

  // 게임 종료 처리
  const endGame = () => {
    dispatch({ type: 'SET_GAME_OVER', payload: true });
    const winner =
      state.score.black > state.score.white
        ? 'You win!'
        : state.score.white > state.score.black
        ? 'You lose!'
        : 'Draw!';
    dispatch({ type: 'SET_RESULT_MESSAGE', payload: winner });
  };

  // 셀 클릭 처리
  const handleCellPress = (row: number, col: number) => {
    if (
      !state.gameStarted || 
      state.gameOver || 
      state.discs[row][col] !== 'empty' || 
      state.blockedCells.has(`${row}-${col}`)
    ) {
      return;
    }

    const affectedDiscs = getAffectedDiscs(state.discs, state.turn, row, col);
    if (affectedDiscs.length > 0) {
      const newDiscs = flipDiscs(state.discs, affectedDiscs, row, col, state.turn);
      const newTurn = state.turn === 'black' ? 'white' : 'black';
      dispatch({ type: 'SET_DISCS', payload: newDiscs });
      dispatch({ type: 'SET_SCORE', payload: calculateScore(newDiscs) });
      dispatch({ type: 'SET_TURN', payload: newTurn });
    }
  };

  // AI 이동 처리
  const makeAIMove = () => {
    const aiMove = calculateAIMove(state.discs, state.turn, state.blockedCells);
    if (!aiMove) {
      dispatch({ type: 'SET_TURN', payload: state.turn === 'black' ? 'white' : 'black' });
      return;
    }

    const { row, col, affected } = aiMove;
    const newDiscs = flipDiscs(state.discs, affected, row, col, state.turn);
    const newTurn = state.turn === 'black' ? 'white' : 'black';
    dispatch({ type: 'SET_DISCS', payload: newDiscs });
    dispatch({ type: 'SET_SCORE', payload: calculateScore(newDiscs) });
    dispatch({ type: 'SET_TURN', payload: newTurn });
  };

  // 게임 시작 애니메이션
  const startGameWithAnimation = () => {
    // 왼쪽으로 슬라이드 아웃 + 페이드 아웃 + 스케일 다운
    translateX.value = withTiming(-SCREEN_WIDTH, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    opacity.value = withTiming(0, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    scale.value = withTiming(0.8, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setGameStarted)();
      }
    });
  };

  const setGameStarted = () => {
    dispatch({ type: 'SET_GAME_STARTED', payload: true });
    
    // 오른쪽에서 슬라이드 인 + 페이드 인 + 스케일 업
    translateX.value = SCREEN_WIDTH;
    setTimeout(() => {
      translateX.value = withTiming(0, { 
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      opacity.value = withTiming(1, { 
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      scale.value = withSpring(1, { 
        damping: 15,
        stiffness: 100
      });
    }, 50);
  };

  // 게임 리셋
  const resetGame = (singlePlayer: boolean, aiAs: AIPlayerType) => {
    // 왼쪽으로 슬라이드 아웃 + 페이드 아웃 + 스케일 다운
    translateX.value = withTiming(-SCREEN_WIDTH, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    opacity.value = withTiming(0, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    scale.value = withTiming(0.8, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(performReset)(singlePlayer, aiAs);
      }
    });
  };

  const performReset = (singlePlayer: boolean, aiAs: AIPlayerType) => {
    dispatch({ type: 'RESET_GAME', payload: { singlePlayer, aiAs } });
    
    // 오른쪽에서 슬라이드 인 + 페이드 인 + 스케일 업
    translateX.value = SCREEN_WIDTH;
    setTimeout(() => {
      translateX.value = withTiming(0, { 
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      opacity.value = withTiming(1, { 
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      scale.value = withSpring(1, { 
        damping: 15,
        stiffness: 100
      });
    }, 50);
  };

  // Exit game animation
  const exitGameWithAnimation = (callback: () => void) => {
    // Slide out + fade out + scale down
    translateX.value = withTiming(-SCREEN_WIDTH, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    opacity.value = withTiming(0, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    scale.value = withTiming(0.8, { 
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(callback)();
      }
    });
  };

  const cubeRotation = () => {
    const rotate = useSharedValue(0);
    
    const startRotation = (direction: 'next' | 'prev', callback: () => void) => {
      const targetValue = direction === 'next' ? 90 : -90;
      
      rotate.value = 0;
      rotate.value = withTiming(targetValue, { 
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }, (finished) => {
        if (finished) {
          runOnJS(callback)();
        }
      });
    };
    
    const style = useAnimatedStyle(() => {
      return {
        transform: [
          { perspective: 1000 },
          { rotateY: `${rotate.value}deg` }
        ]
      };
    });
    
    return { startRotation, style };
  };

  // 디스크 뒤집기 효과 (Flip Effect)
  const flipAnimation = () => {
    // Y축 회전 애니메이션 값
    const rotateY = useSharedValue(0);
    
    // 화면 전환 시작 함수
    const startFlip = (callback: () => void) => {
      // 처음 90도 회전
      rotateY.value = withTiming(90, { 
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      }, (finished) => {
        if (finished) {
          // 화면 전환 중간에 콘텐츠 변경
          runOnJS(callback)();
          // 나머지 90도 회전 완료
          rotateY.value = withTiming(180, { 
            duration: 400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
          });
        }
      });
    };
    
    // 애니메이션 스타일
    const flipStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { perspective: 1000 }, 
          { rotateY: `${rotateY.value}deg` }
        ],
        backfaceVisibility: 'hidden',
      };
    });
    
    return { startFlip, flipStyle };
  };

  return {
    state,
    dispatch,
    animatedStyle,
    handleCellPress,
    startGameWithAnimation,
    resetGame,
    exitGameWithAnimation,
    cubeRotation,
    flipAnimation
  };
} 