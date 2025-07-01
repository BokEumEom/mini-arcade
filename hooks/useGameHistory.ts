import { GameId } from '@/constants/Games';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

interface GameHistoryItem {
  gameId: GameId;
  lastPlayedAt: number;
  playCount: number;
}

const GAME_HISTORY_KEY = 'game_history';

export function useGameHistory() {
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 게임 히스토리 로드
  const loadGameHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(GAME_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored) as GameHistoryItem[];
        setGameHistory(history);
        console.log('Loaded game history:', history);
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 게임 플레이 기록 추가/업데이트
  const recordGamePlay = useCallback(async (gameId: GameId) => {
    try {
      console.log('Recording game play for:', gameId);
      const now = Date.now();
      
      setGameHistory(prevHistory => {
        const updatedHistory = [...prevHistory];
        const existingIndex = updatedHistory.findIndex(item => item.gameId === gameId);
        
        if (existingIndex >= 0) {
          // 기존 기록 업데이트
          updatedHistory[existingIndex] = {
            ...updatedHistory[existingIndex],
            lastPlayedAt: now,
            playCount: updatedHistory[existingIndex].playCount + 1,
          };
          console.log('Updated existing game record:', updatedHistory[existingIndex]);
        } else {
          // 새로운 기록 추가
          const newRecord = {
            gameId,
            lastPlayedAt: now,
            playCount: 1,
          };
          updatedHistory.push(newRecord);
          console.log('Added new game record:', newRecord);
        }

        // 최근 플레이 순으로 정렬
        updatedHistory.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
        
        // AsyncStorage에 저장
        AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(updatedHistory))
          .then(() => console.log('Saved game history to storage:', updatedHistory))
          .catch(error => console.error('Failed to save game history:', error));
        
        return updatedHistory;
      });
    } catch (error) {
      console.error('Failed to record game play:', error);
    }
  }, []);

  // 최근 플레이한 게임들 가져오기 (최대 6개)
  const getRecentGames = useCallback(() => {
    const recent = gameHistory.slice(0, 6);
    console.log('Getting recent games:', recent);
    return recent;
  }, [gameHistory]);

  // 특정 게임의 플레이 횟수 가져오기
  const getPlayCount = useCallback((gameId: GameId) => {
    const game = gameHistory.find(item => item.gameId === gameId);
    return game?.playCount || 0;
  }, [gameHistory]);

  // 게임 히스토리 초기화
  const clearGameHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(GAME_HISTORY_KEY);
      setGameHistory([]);
      console.log('Cleared game history');
    } catch (error) {
      console.error('Failed to clear game history:', error);
    }
  }, []);

  useEffect(() => {
    loadGameHistory();
  }, [loadGameHistory]);

  return {
    gameHistory,
    isLoading,
    recordGamePlay,
    getRecentGames,
    getPlayCount,
    clearGameHistory,
    loadGameHistory,
  };
} 