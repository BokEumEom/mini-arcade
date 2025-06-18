import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameLogic } from '../../hooks/tap-circle/useGameLogic';
import { useGameState } from '../../hooks/tap-circle/useGameState';
import { Particle as ParticleType, ScorePopup as ScorePopupType, Target as TargetType } from '../../types/games/variants/tap-circle';
import { AchievementAlert } from './AchievementAlert';
import { ComboDisplay } from './ComboDisplay';
import { GameEffects } from './GameEffects';
import { GameHeader } from './GameHeader';
import { GameOverScreen } from './GameOverScreen';
import { Particle } from './Particle';
import { ScorePopup } from './ScorePopup';
import { StartScreen } from './StartScreen';
import { Target } from './Target';

const { width, height } = Dimensions.get('window');

interface GameProps {
  onExit?: () => void;
}

export const Game = ({ onExit }: GameProps) => {
  const checkedAchievementsRef = useRef<Set<string>>(new Set());
  const dismissedAchievementsRef = useRef<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const {
    gameState,
    updateHighScore,
    updateAchievements,
    updateStats,
    startGame,
    endGame,
    updateScore,
    updateCombo,
    updateTimeLeft,
    updateMisses,
    setEffect,
    setGameActive,
  } = useGameState();

  const onScoreChange = useCallback((newScore: number) => {
    const totalScore = gameState.score + newScore;
    updateScore(totalScore);
    
    if (totalScore > gameState.highScore) {
      updateHighScore(totalScore);
    }
  }, [gameState.score, gameState.highScore, updateScore, updateHighScore]);

  const onComboChange = useCallback((combo: number, multiplier: number) => {
    updateCombo(combo, multiplier);
  }, [updateCombo]);

  const onMiss = useCallback(() => {
    updateMisses(gameState.misses + 1);
  }, [gameState.misses, updateMisses]);

  const onGameOver = useCallback(() => {
    endGame();
    // 게임 통계 업데이트
    const newStats = {
      ...gameState.stats,
      totalGames: gameState.stats.totalGames + 1,
      totalScore: gameState.stats.totalScore + gameState.score,
      highestScore: Math.max(gameState.stats.highestScore, gameState.score),
      highestCombo: Math.max(gameState.stats.highestCombo, gameState.combo),
      targetsHit: gameState.stats.targetsHit + gameState.score / 10, // 근사값
      targetsMissed: gameState.stats.targetsMissed + gameState.misses,
      perfectGames: gameState.misses === 0 ? gameState.stats.perfectGames + 1 : gameState.stats.perfectGames,
    };
    updateStats(newStats);
  }, [endGame, gameState.stats, gameState.score, gameState.combo, gameState.misses, updateStats]);

  const onTimeChange = useCallback((timeLeft: number) => {
    updateTimeLeft(timeLeft);
  }, [updateTimeLeft]);

  const onEffectChange = useCallback((effect: 'isDoubleScore' | 'isSlowMotion', value: boolean) => {
    setEffect(effect, value);
  }, [setEffect]);

  // 일시정지/재개 처리
  const handlePause = useCallback(() => {
    console.log('=== Game: handlePause called ===');
    console.log('Game: Current isPaused state:', isPaused);
    console.log('Game: Current gameState.isPlaying:', gameState.isPlaying);
    console.log('Game: Current gameState.gameActive:', gameState.gameActive);
    
    setIsPaused(true);
    setGameActive(false);
    
    console.log('Game: Game paused successfully');
    console.log('Game: New isPaused state will be: true');
    console.log('Game: New gameActive state will be: false');
  }, [setGameActive, isPaused, gameState.isPlaying, gameState.gameActive]);

  const handleResume = useCallback(() => {
    console.log('=== Game: handleResume called ===');
    console.log('Game: Current isPaused state:', isPaused);
    console.log('Game: Current gameState.isPlaying:', gameState.isPlaying);
    console.log('Game: Current gameState.gameActive:', gameState.gameActive);
    
    setIsPaused(false);
    setGameActive(true);
    
    console.log('Game: Game resumed successfully');
    console.log('Game: New isPaused state will be: false');
    console.log('Game: New gameActive state will be: true');
  }, [setGameActive, isPaused, gameState.isPlaying, gameState.gameActive]);

  const handleExit = useCallback(() => {
    // 게임 종료 로직 - 네비게이션으로 돌아가기
    console.log('Game handleExit called - exiting to main menu');
    
    // 게임이 진행 중이면 먼저 종료
    if (gameState.isPlaying && !gameState.isGameOver) {
      console.log('Ending current game before exit');
      endGame();
    }
    
    if (onExit) {
      console.log('Calling onExit prop to navigate away');
      onExit();
    } else {
      console.log('onExit prop is not available');
    }
  }, [onExit, gameState.isPlaying, gameState.isGameOver, endGame]);

  // 나가기 확인 다이얼로그 표시
  const handleExitRequest = useCallback(() => {
    console.log('=== Exit requested - showing confirmation dialog ===');
    console.log('Game: Current showExitConfirm state:', showExitConfirm);
    setShowExitConfirm(true);
    console.log('Game: New showExitConfirm state will be: true');
  }, [showExitConfirm]);

  // 나가기 확인 다이얼로그 닫기
  const handleExitCancel = useCallback(() => {
    console.log('Exit cancelled');
    setShowExitConfirm(false);
  }, []);

  // 나가기 확인 다이얼로그 확인
  const handleExitConfirm = useCallback(() => {
    console.log('Exit confirmed');
    setShowExitConfirm(false);
    handleExit();
  }, [handleExit]);

  const {
    targets,
    particles,
    scorePopups,
    handleTargetPress,
    handleMiss,
  } = useGameLogic({
    gameState,
    onScoreChange,
    onComboChange,
    onMiss,
    onGameOver,
    onTimeChange,
    onEffectChange,
  });

  const handleScreenPress = useCallback(
    (event: any) => {
      console.log('Screen pressed!', {
        isPlaying: gameState.isPlaying,
        isPaused,
        hasCompletedAchievement: gameState.achievements.some(a => a.completed),
        targetsCount: targets.length
      });
      
      if (!gameState.isPlaying) {
        console.log('Game not playing, ignoring tap');
        return;
      }
      
      // 일시정지 상태이면 게임 입력 무시
      if (isPaused) {
        console.log('Game paused, ignoring tap');
        return;
      }
      
      // achievement가 표시되면 게임 입력 무시
      if (gameState.achievements.some(a => a.completed)) {
        console.log('Achievement showing, ignoring tap');
        return;
      }
      
      // Pressable의 경우 좌표가 다를 수 있으므로 여러 방법으로 시도
      const locationX = event.nativeEvent?.pageX || event.nativeEvent?.locationX || 0;
      const locationY = event.nativeEvent?.pageY || event.nativeEvent?.locationY || 0;
      
      console.log('Tap location:', { locationX, locationY });
      console.log('Event details:', event.nativeEvent);
      
      // 모든 타겟에 대해 충돌 검사
      let hitTarget: TargetType | null = null;
      targets.forEach((t: TargetType) => {
        const dx = t.x - locationX;
        const dy = t.y - locationY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = t.size / 2 + 25; // 탭 감지 영역을 25px로 확대
        console.log('Target check:', { 
          targetId: t.id, 
          targetPos: { x: t.x, y: t.y }, 
          distance, 
          hitRadius,
          isHit: distance <= hitRadius
        });
        
        if (distance <= hitRadius && !hitTarget) {
          hitTarget = t;
        }
      });

      if (hitTarget) {
        console.log('Target hit from screen press!', hitTarget);
        handleTargetPress(hitTarget);
      } else {
        console.log('Miss from screen press!');
        handleMiss();
      }
    },
    [targets, handleTargetPress, handleMiss, gameState.isPlaying, gameState.achievements, isPaused]
  );

  const handleGameStart = useCallback(() => {
    // 새로운 게임 시작 시 체크된 achievement 기록 초기화
    checkedAchievementsRef.current.clear();
    dismissedAchievementsRef.current.clear();
    
    // achievement 상태 초기화
    const resetAchievements = gameState.achievements.map(achievement => ({
      ...achievement,
      completed: false
    }));
    updateAchievements(resetAchievements);
    
    startGame();
  }, [startGame, gameState.achievements, updateAchievements]);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleAchievementClose = useCallback(() => {
    // 완료된 achievement를 제거하고 닫힌 것으로 표시
    const updatedAchievements = gameState.achievements.map(achievement => ({
      ...achievement,
      completed: false
    }));
    updateAchievements(updatedAchievements);
    
    // 닫힌 achievement를 기록
    const completedAchievement = gameState.achievements.find(a => a.completed);
    if (completedAchievement) {
      dismissedAchievementsRef.current.add(completedAchievement.id);
    }
    
    // 게임 재개
    setGameActive(true);
  }, [gameState.achievements, updateAchievements, setGameActive]);

  // achievement 체크 로직
  const checkAchievements = useCallback(() => {
    const updatedAchievements = gameState.achievements.map(achievement => {
      let shouldComplete = false;
      
      switch (achievement.id) {
        case 'first_game':
          shouldComplete = gameState.stats.totalGames >= 1;
          break;
        case 'score_100':
          shouldComplete = gameState.score >= 100;
          break;
        case 'combo_10':
          shouldComplete = gameState.combo >= 10;
          break;
        default:
          shouldComplete = false;
      }
      
      // 이미 체크한 achievement는 건너뛰기
      if (checkedAchievementsRef.current.has(achievement.id)) {
        return achievement;
      }
      
      // 이미 닫힌 achievement는 건너뛰기
      if (dismissedAchievementsRef.current.has(achievement.id)) {
        return achievement;
      }
      
      return {
        ...achievement,
        completed: shouldComplete && !achievement.completed
      };
    });
    
    // 변경사항이 있으면 업데이트하고 체크된 achievement 기록
    const hasChanges = updatedAchievements.some((a, i) => a.completed !== gameState.achievements[i].completed);
    if (hasChanges) {
      updateAchievements(updatedAchievements);
      // 완료된 achievement를 체크된 것으로 기록
      updatedAchievements.forEach(achievement => {
        if (achievement.completed) {
          checkedAchievementsRef.current.add(achievement.id);
        }
      });
    }
  }, [gameState.stats.totalGames, gameState.score, gameState.combo, gameState.achievements, updateAchievements]);

  // 게임 종료 시 achievement 체크
  useEffect(() => {
    if (gameState.isGameOver) {
      checkAchievements();
    }
  }, [gameState.isGameOver, checkAchievements]);

  // 점수나 콤보 변경 시 achievement 체크
  useEffect(() => {
    if (gameState.isPlaying && (gameState.score >= 100 || gameState.combo >= 10)) {
      checkAchievements();
    }
  }, [gameState.isPlaying, gameState.score, gameState.combo, checkAchievements]);

  // achievement 표시 시 게임 일시정지
  useEffect(() => {
    const hasCompletedAchievement = gameState.achievements.some(a => a.completed);
    console.log('Achievement effect:', {
      hasCompletedAchievement,
      isPlaying: gameState.isPlaying,
      gameActive: gameState.gameActive
    });
    
    if (hasCompletedAchievement) {
      setGameActive(false); // 게임 일시정지
    } else {
      setGameActive(true); // 게임 재개
    }
  }, [gameState.achievements, setGameActive]);

  // 게임 상태 디버깅
  useEffect(() => {
    console.log('Game state changed:', {
      isPlaying: gameState.isPlaying,
      gameActive: gameState.gameActive,
      isGameOver: gameState.isGameOver,
      timeLeft: gameState.timeLeft,
      targetsCount: targets.length
    });
  }, [gameState.isPlaying, gameState.gameActive, gameState.isGameOver, gameState.timeLeft, targets.length]);

  // isPaused 상태 변경 추적
  useEffect(() => {
    console.log('Game: isPaused state changed to:', isPaused);
  }, [isPaused]);

  // GameHeader props 디버깅
  useEffect(() => {
    console.log('Game: GameHeader props:', {
      score: gameState.score,
      timeLeft: gameState.timeLeft,
      misses: gameState.misses,
      isPaused,
      hasOnPause: !!handlePause,
      hasOnResume: !!handleResume,
      hasOnExit: !!handleExitRequest
    });
  }, [gameState.score, gameState.timeLeft, gameState.misses, isPaused, handlePause, handleResume, handleExitRequest]);

  // 백 핸들러 처리
  const handleBackPress = useCallback(() => {
    console.log('Back button pressed');
    
    if (isPaused) {
      // 일시정지 상태면 재개
      console.log('Resuming game due to back press');
      handleResume();
      return true; // 이벤트 소비
    } else if (gameState.isPlaying && !gameState.isGameOver) {
      // 게임 중이면 일시정지
      console.log('Pausing game due to back press');
      handlePause();
      return true; // 이벤트 소비
    } else if (gameState.isGameOver) {
      // 게임 오버 화면이면 메인으로 돌아가기
      console.log('Exiting to main menu due to back press');
      handleExit();
      return true; // 이벤트 소비
    } else {
      // 시작 화면이면 메인으로 돌아가기
      console.log('Exiting from start screen due to back press');
      handleExit();
      return true; // 이벤트 소비
    }
  }, [gameState.isPlaying, gameState.isGameOver, isPaused, endGame, handleExit, handlePause, handleResume]);

  // 백 핸들러 등록
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      backHandler.remove();
    };
  }, [handleBackPress]);

  // 게임 시작 화면 표시
  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <StartScreen
        onStart={handleGameStart}
        onExit={handleExit}
        highScore={gameState.highScore}
      />
    );
  }

  // 게임 오버 화면 표시
  if (gameState.isGameOver) {
    return (
      <GameOverScreen
        score={gameState.score}
        highScore={gameState.highScore}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    );
  }

  // 게임 플레이 화면
  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.backgroundPressable} 
        onPress={handleScreenPress}
      />
      <GameHeader
        score={gameState.score}
        timeLeft={gameState.timeLeft}
        misses={gameState.misses}
        isPaused={isPaused}
        onPause={handlePause}
        onResume={handleResume}
        onExit={handleExitRequest}
      />
      <GameEffects
        isDoubleScore={gameState.isDoubleScore}
        isSlowMotion={gameState.isSlowMotion}
      />
      <ComboDisplay
        combo={gameState.combo}
        multiplier={gameState.comboMultiplier}
      />

      {targets.map((target: TargetType) => (
        <Target
          key={target.id}
          x={target.x}
          y={target.y}
          type={target.type}
          size={target.size}
          onPress={() => {
            console.log('Target onPress called for:', target.id);
            handleTargetPress(target);
          }}
        />
      ))}

      {particles.map((particle: ParticleType) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
        />
      ))}

      {scorePopups.map((popup: ScorePopupType) => (
        <ScorePopup
          key={popup.id}
          score={popup.score}
          x={popup.x}
          y={popup.y}
        />
      ))}

      <AchievementAlert
        visible={gameState.achievements.some(a => a.completed)}
        achievement={gameState.achievements.find(a => a.completed) || null}
        onClose={handleAchievementClose}
      />

      {/* 일시정지 오버레이 */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseContent}>
            <MaterialCommunityIcons name="pause" size={64} color="#333" />
            <Text style={styles.pauseText}>일시정지</Text>
            <Text style={styles.pauseSubtext}>재개하려면 일시정지 버튼을 누르세요</Text>
          </View>
        </View>
      )}

      {/* 나가기 확인 다이얼로그 */}
      {showExitConfirm && (
        <View style={styles.exitConfirmOverlay}>
          <View style={styles.exitConfirmContent}>
            <MaterialCommunityIcons name="exit-to-app" size={48} color="#ff4444" />
            <Text style={styles.exitConfirmTitle}>게임을 종료하시겠습니까?</Text>
            <Text style={styles.exitConfirmSubtext}>현재 진행 상황이 저장되지 않습니다.</Text>
            
            <View style={styles.exitConfirmButtons}>
              <TouchableOpacity
                style={[styles.exitConfirmButton, styles.cancelButton]}
                onPress={handleExitCancel}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.exitConfirmButton, styles.confirmButton]}
                onPress={handleExitConfirm}
              >
                <Text style={styles.confirmButtonText}>종료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  backgroundPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pauseSubtext: {
    fontSize: 16,
    color: '#333',
  },
  exitConfirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  exitConfirmContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exitConfirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  exitConfirmSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exitConfirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  exitConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 