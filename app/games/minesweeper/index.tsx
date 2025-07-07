import { Button } from '@/components/common/Button';
import ConfirmationModal from '@/components/common/Modal';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import { MineCell } from '@/components/minesweeper/MineCell';
import { GameMode, ModeSelectionScreen } from '@/components/minesweeper/ModeSelectionScreen';
import { StartScreen } from '@/components/minesweeper/StartScreen';
import { TopPanel } from '@/components/minesweeper/TopPanel';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type CellState = 'hidden' | 'revealed' | 'flagged';
type CellValue = number | 'mine';

interface Cell {
  value: CellValue;
  state: CellState;
  isMine: boolean;
}

interface GameState {
  board: Cell[][];
  gameOver: boolean;
  gameWon: boolean;
  mineCount: number;
  flagCount: number;
  timer: number;
  isFirstClick: boolean;
  boardWidth: number;
  boardHeight: number;
}

type ScreenState = 'start' | 'mode-selection' | 'loading' | 'game';

const MinesweeperGame: React.FC = () => {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('start');
  const [selectedMode, setSelectedMode] = useState<GameMode>('easy');
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    gameOver: false,
    gameWon: false,
    mineCount: 10,
    flagCount: 0,
    timer: 0,
    isFirstClick: true,
    boardWidth: 8,
    boardHeight: 12,
  });
  const [showModal, setShowModal] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [highScore, setHighScore] = useState(999); // 임시 최고 점수
  const [mode, setMode] = useState<'dig' | 'flag'>('dig');

  // 게임 모드 설정
  const getGameConfig = (mode: GameMode) => {
    switch (mode) {
      case 'easy':
        return { width: 8, height: 12, mineCount: 10 };
      case 'normal':
        return { width: 12, height: 18, mineCount: 40 };
      case 'hard':
        return { width: 15, height: 22, mineCount: 99 };
      default:
        return { width: 8, height: 12, mineCount: 10 };
    }
  };

  // 게임 초기화
  const initializeBoard = useCallback((boardWidth: number, boardHeight: number) => {
    const board: Cell[][] = [];
    for (let i = 0; i < boardHeight; i++) {
      board[i] = [];
      for (let j = 0; j < boardWidth; j++) {
        board[i][j] = {
          value: 0,
          state: 'hidden',
          isMine: false,
        };
      }
    }
    return board;
  }, []);

  // 지뢰 배치
  const placeMines = useCallback((board: Cell[][], firstRow: number, firstCol: number, boardWidth: number, boardHeight: number, mineCount: number) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;
    
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * boardHeight);
      const col = Math.floor(Math.random() * boardWidth);
      
      // 첫 번째 클릭 위치와 그 주변에는 지뢰를 배치하지 않음
      if (!newBoard[row][col].isMine && 
          (Math.abs(row - firstRow) > 1 || Math.abs(col - firstCol) > 1)) {
        newBoard[row][col].isMine = true;
        newBoard[row][col].value = 'mine';
        minesPlaced++;
      }
    }
    
    // 숫자 계산
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < boardHeight && nj >= 0 && nj < boardWidth) {
                if (newBoard[ni][nj].isMine) count++;
              }
            }
          }
          newBoard[i][j].value = count;
        }
      }
    }
    
    return newBoard;
  }, []);

  // 셀 클릭 처리
  const handleCellPress = useCallback((row: number, col: number) => {
    if (gameState.gameOver || gameState.gameWon) return;
    
    setGameState(prevState => {
      const newBoard = prevState.board.map(row => row.map(cell => ({ ...cell })));
      
      // 첫 번째 클릭인 경우 지뢰 배치
      if (prevState.isFirstClick) {
        const boardWithMines = placeMines(newBoard, row, col, prevState.boardWidth, prevState.boardHeight, prevState.mineCount);
        newBoard.splice(0, newBoard.length, ...boardWithMines);
      }
      
      const cell = newBoard[row][col];
      
      // 이미 열린 셀이거나 깃발이 있는 셀은 무시
      if (cell.state === 'revealed' || cell.state === 'flagged') {
        return prevState;
      }
      
      // 지뢰 클릭
      if (cell.isMine) {
        // 모든 지뢰 공개
        for (let i = 0; i < prevState.boardHeight; i++) {
          for (let j = 0; j < prevState.boardWidth; j++) {
            if (newBoard[i][j].isMine) {
              newBoard[i][j].state = 'revealed';
            }
          }
        }
        return {
          ...prevState,
          board: newBoard,
          gameOver: true,
          isFirstClick: false,
        };
      }
      
      // 셀 열기
      const revealCell = (r: number, c: number) => {
        if (r < 0 || r >= prevState.boardHeight || c < 0 || c >= prevState.boardWidth) return;
        if (newBoard[r][c].state === 'revealed' || newBoard[r][c].state === 'flagged') return;
        
        newBoard[r][c].state = 'revealed';
        
        // 주변에 지뢰가 없으면 주변 셀들도 자동으로 열기
        if (newBoard[r][c].value === 0) {
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              revealCell(r + di, c + dj);
            }
          }
        }
      };
      
      revealCell(row, col);
      
      // 승리 조건 확인
      let revealedCount = 0;
      for (let i = 0; i < prevState.boardHeight; i++) {
        for (let j = 0; j < prevState.boardWidth; j++) {
          if (newBoard[i][j].state === 'revealed') revealedCount++;
        }
      }
      
      const gameWon = revealedCount === prevState.boardWidth * prevState.boardHeight - prevState.mineCount;
      
      return {
        ...prevState,
        board: newBoard,
        gameWon,
        isFirstClick: false,
      };
    });
  }, [gameState.gameOver, gameState.gameWon, placeMines]);

  // 깃발 토글
  const handleFlagPress = useCallback((row: number, col: number) => {
    if (gameState.gameOver || gameState.gameWon) return;
    
    setGameState(prevState => {
      const newBoard = prevState.board.map(row => row.map(cell => ({ ...cell })));
      const cell = newBoard[row][col];
      
      if (cell.state === 'revealed') return prevState;
      
      if (cell.state === 'flagged') {
        cell.state = 'hidden';
        return {
          ...prevState,
          board: newBoard,
          flagCount: prevState.flagCount - 1,
        };
      } else {
        cell.state = 'flagged';
        return {
          ...prevState,
          board: newBoard,
          flagCount: prevState.flagCount + 1,
        };
      }
    });
  }, [gameState.gameOver, gameState.gameWon]);

  // 깃발로 지뢰 찾기 (더블 클릭 기능)
  const handleDoubleClick = useCallback((row: number, col: number) => {
    if (gameState.gameOver || gameState.gameWon) return;
    
    setGameState(prevState => {
      const newBoard = prevState.board.map(row => row.map(cell => ({ ...cell })));
      const cell = newBoard[row][col];
      
      // 이미 열린 셀이 아니면 무시
      if (cell.state !== 'revealed') return prevState;
      
      // 주변 깃발 개수 확인
      let flagCount = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ni = row + di;
          const nj = col + dj;
          if (ni >= 0 && ni < prevState.boardHeight && nj >= 0 && nj < prevState.boardWidth) {
            if (newBoard[ni][nj].state === 'flagged') flagCount++;
          }
        }
      }
      
      // 깃발 개수가 숫자와 일치하면 주변 셀들 열기
      if (flagCount === cell.value) {
        let hitMine = false;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = row + di;
            const nj = col + dj;
            if (ni >= 0 && ni < prevState.boardHeight && nj >= 0 && nj < prevState.boardWidth) {
              const neighborCell = newBoard[ni][nj];
              if (neighborCell.state === 'hidden') {
                if (neighborCell.isMine) {
                  hitMine = true;
                }
                neighborCell.state = 'revealed';
              }
            }
          }
        }
        
        if (hitMine) {
          // 모든 지뢰 공개
          for (let i = 0; i < prevState.boardHeight; i++) {
            for (let j = 0; j < prevState.boardWidth; j++) {
              if (newBoard[i][j].isMine) {
                newBoard[i][j].state = 'revealed';
              }
            }
          }
          return {
            ...prevState,
            board: newBoard,
            gameOver: true,
            isFirstClick: false,
          };
        }
      }
      
      return {
        ...prevState,
        board: newBoard,
      };
    });
  }, [gameState.gameOver, gameState.gameWon]);

  // 게임 재시작
  const restartGame = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const config = getGameConfig(selectedMode);
    setGameState({
      board: initializeBoard(config.width, config.height),
      gameOver: false,
      gameWon: false,
      mineCount: config.mineCount,
      flagCount: 0,
      timer: 0,
      isFirstClick: true,
      boardWidth: config.width,
      boardHeight: config.height,
    });
    
    setShowModal(false);
  }, [initializeBoard, timerInterval, selectedMode]);

  // 모드 선택 처리
  const handleModeSelect = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    setScreenState('loading');
  }, []);

  // 게임 시작
  const handleGameStart = useCallback(() => {
    const config = getGameConfig(selectedMode);
    setGameState(prev => ({
      ...prev,
      board: initializeBoard(config.width, config.height),
      mineCount: config.mineCount,
      boardWidth: config.width,
      boardHeight: config.height,
    }));
    setScreenState('game');
  }, [selectedMode, initializeBoard]);

  // 게임 종료
  const handleGameExit = useCallback(() => {
    router.back();
  }, [router]);

  // 뒤로 가기
  const handleBack = useCallback(() => {
    setScreenState('start');
  }, []);

  // 타이머 시작
  useEffect(() => {
    if (!gameState.isFirstClick && !gameState.gameOver && !gameState.gameWon) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timer: prev.timer + 1,
        }));
      }, 1000);
      setTimerInterval(interval as any);
      
      return () => clearInterval(interval);
    }
  }, [gameState.isFirstClick, gameState.gameOver, gameState.gameWon]);

  // 게임 종료 처리
  useEffect(() => {
    if (gameState.gameOver || gameState.gameWon) {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // 승리 시 최고 점수 업데이트
      if (gameState.gameWon && gameState.timer < highScore) {
        setHighScore(gameState.timer);
      }
      
      const message = gameState.gameWon 
        ? '축하합니다! 지뢰찾기를 성공했습니다!' 
        : '게임 오버! 다시 시도해보세요.';
      
      Alert.alert(
        gameState.gameWon ? '승리!' : '게임 오버',
        message,
        [{ text: '확인', onPress: () => {} }]
      );
    }
  }, [gameState.gameOver, gameState.gameWon, timerInterval, highScore]);

  // 로딩 완료 처리
  const handleLoadingComplete = () => {
    handleGameStart();
  };

  // 모드에 따라 클릭 동작 분기
  const handleCellAction = (row: number, col: number) => {
    if (mode === 'dig') {
      handleCellPress(row, col);
    } else {
      handleFlagPress(row, col);
    }
  };

  // 난이도 이니셜
  const getLevelInitial = () => {
    switch (selectedMode) {
      case 'easy': return 'E';
      case 'normal': return 'N';
      case 'hard': return 'H';
      default: return 'E';
    }
  };

  // StartScreen 표시
  if (screenState === 'start') {
    return (
      <StartScreen
        onModeSelect={() => setScreenState('mode-selection')}
        onExit={handleGameExit}
        highScore={highScore}
      />
    );
  }

  // ModeSelectionScreen 표시
  if (screenState === 'mode-selection') {
    return (
      <ModeSelectionScreen
        onModeSelect={handleModeSelect}
        onBack={handleBack}
      />
    );
  }

  // LoadingScreen 표시
  if (screenState === 'loading') {
    return (
      <LoadingScreen 
        gameTitle="지뢰찾기"
        onLoadingComplete={handleLoadingComplete}
        duration={1500}
      />
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellColor = (cell: Cell) => {
    if (cell.state === 'hidden') return '#c0c0c0';
    if (cell.state === 'flagged') return '#c0c0c0';
    if (cell.isMine) return '#ff0000';
    
    const colors = ['', '#0000ff', '#008200', '#ff0000', '#000084', '#840000', '#008284', '#840084', '#757575'];
    return colors[cell.value as number] || '#000000';
  };

  const getCellText = (cell: Cell) => {
    if (cell.state === 'hidden') return '';
    if (cell.state === 'flagged') return '🚩';
    if (cell.isMine) return '💣';
    if (cell.value === 0) return '';
    return cell.value.toString();
  };

  const getCellSize = () => {
    const screenWidth = width - 40; // 좌우 패딩 제외
    const screenHeight = height - 200; // 헤더, 컨트롤, 패딩 제외
    
    // 보드의 가로세로 비율 계산
    const boardRatio = gameState.boardWidth / gameState.boardHeight;
    const screenRatio = screenWidth / screenHeight;
    
    let cellSize;
    
    if (boardRatio > screenRatio) {
      // 가로가 더 긴 경우, 가로 기준으로 계산
      cellSize = screenWidth / gameState.boardWidth;
    } else {
      // 세로가 더 긴 경우, 세로 기준으로 계산
      cellSize = screenHeight / gameState.boardHeight;
    }
    
    // 최소/최대 크기 제한
    return Math.max(Math.min(cellSize, 40), 20);
  };

  const getBoardSize = () => {
    const cellSize = getCellSize();
    return {
      width: cellSize * gameState.boardWidth,
      height: cellSize * gameState.boardHeight,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 TopPanel */}
      <TopPanel
        level={getLevelInitial() as 'E' | 'N' | 'H'}
        mineCount={gameState.mineCount - gameState.flagCount}
        timer={gameState.timer}
        onReset={restartGame}
        onPause={() => {}}
        onClose={handleGameExit}
      />

      <View style={styles.boardContainer}>
        <View style={[styles.board, getBoardSize()]}>
          {gameState.board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <MineCell
                  key={`${rowIndex}-${colIndex}`}
                  state={cell.state}
                  value={cell.value}
                  onPress={() => handleCellAction(rowIndex, colIndex)}
                  onLongPress={() => handleFlagPress(rowIndex, colIndex)}
                  onDoublePress={
                    cell.state === 'revealed' && typeof cell.value === 'number' && cell.value > 0
                      ? () => handleDoubleClick(rowIndex, colIndex)
                      : undefined
                  }
                  size={getCellSize()}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* 하단 모드 토글 패널 */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'dig' && styles.modeBtnActive]}
          onPress={() => setMode('dig')}
        >
          <Text style={styles.modeIcon}>⛏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'flag' && styles.modeBtnActive]}
          onPress={() => setMode('flag')}
        >
          <Text style={styles.modeIcon}>🚩</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <Button
          title="새 게임"
          onPress={() => setShowModal(true)}
          gradientColors={['#c0c0c0', '#a0a0a0']}
          style={styles.newGameButton}
        />
        <Button
          title="게임 종료"
          onPress={handleGameExit}
          gradientColors={['#ff6b6b', '#ee5a52']}
          style={styles.exitButton}
        />
      </View>

      <ConfirmationModal
        visible={showModal}
        onConfirm={restartGame}
        onCancel={() => setShowModal(false)}
        message="새 게임을 시작하시겠습니까? 현재 진행 상황이 모두 사라집니다."
        confirmText="새 게임"
        cancelText="취소"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0c0c0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#c0c0c0',
    borderBottomWidth: 2,
    borderBottomColor: '#808080',
  },
  infoContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  board: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0c0c0',
  },
  revealedCell: {
    backgroundColor: '#ffffff',
  },
  cellText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#808080',
  },
  newGameButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  exitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottomPanel: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#c0c0c0',
    borderTopWidth: 2,
    borderTopColor: '#808080',
  },
  modeBtn: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#808080',
    borderRadius: 4,
  },
  modeBtnActive: {
    backgroundColor: '#a0a0a0',
  },
  modeIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MinesweeperGame; 