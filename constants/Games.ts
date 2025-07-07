import { IconName } from '@/components/ui/IconSymbol';

export const GAMES = [
  {
    id: 'rock-paper-scissors',
    title: '가위바위보',
    description: '가위바위보 게임',
    icon: 'swords' as IconName,
    color: '#FF6B6B',
    category: 'classic' as const,
    isNew: false,
    isRecommended: true,
  },
  {
    id: '2048',
    title: '2048',
    description: '숫자를 밀고 합치세요',
    icon: 'gem' as IconName,
    color: '#4ECDC4',
    category: 'puzzle' as const,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'memory',
    title: '기억력 게임',
    description: '같은 그림 찾기',
    icon: 'videotape' as IconName,
    color: '#FFD93D',
    category: 'brain' as const,
    isNew: false,
    isRecommended: false,
  },
  {
    id: 'gomoku',
    title: '오목',
    description: '5개의 돌을 연속으로 놓아 승리하세요',
    icon: 'circle' as IconName,
    color: '#8B4513',
    category: 'strategy' as const,
    isNew: true,
    isRecommended: true,
  },
  {
    id: 'minesweeper',
    title: '지뢰찾기',
    description: '지뢰를 피해서 모든 안전한 칸을 열어보세요',
    icon: 'pickaxe' as IconName,
    color: '#95E1D3',
    category: 'puzzle' as const,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'tetris',
    title: '테트리스',
    description: '클래식 블록 퍼즐',
    icon: 'puzzle' as IconName,
    color: '#6C5CE7',
    category: 'classic' as const,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'othello',
    title: '오델로',
    description: '전략 보드 게임',
    icon: 'game-controller' as IconName,
    color: '#2D3436',
    category: 'strategy' as const,
    isNew: false,
    isRecommended: false,
  },
  {
    id: 'tap-circle',
    title: '탭 서클',
    description: '순서대로 원형 탭하기',
    icon: 'target' as IconName,
    color: '#FF9F43',
    category: 'action' as const,
    isNew: false,
    isRecommended: false,
  },
  {
    id: 'number-puzzle',
    title: '숫자 퍼즐',
    description: '숫자를 순서대로 배열하세요',
    icon: 'grid' as IconName,
    color: '#00B894',
    category: 'puzzle' as const,
    isNew: false,
    isRecommended: false,
  },
  {
    id: 'quick-math',
    title: '빠른 계산',
    description: '빠르게 연산 문제를 풀어보세요!',
    icon: 'zap' as IconName,
    color: '#FF9800',
    category: 'brain' as const,
    isNew: false,
    isRecommended: true,
  },
  {
    id: 'avoid-bomb',
    title: '폭탄 피하기',
    description: '폭탄을 피해서 점수를 획득하세요!',
    icon: 'bomb' as IconName,
    color: '#FF5252',
    category: 'action' as const,
    isNew: true,
    isRecommended: true,
  },
  {
    id: 'tower-defense',
    title: '타워 디펜스',
    description: '타워를 건설하여 적을 막아보세요!',
    icon: 'castle' as IconName,
    color: '#8E44AD',
    category: 'strategy' as const,
    isNew: true,
    isRecommended: true,
  },
  {
    id: 'pac-man',
    title: '팩맨',
    description: '고전 아케이드 게임 팩맨을 즐겨보세요!',
    icon: 'ghost' as IconName,
    color: '#FFD700',
    category: 'classic' as const,
    isNew: true,
    isRecommended: true,
  },
] as const;

export type GameId = typeof GAMES[number]['id'];
export type GameCategory = typeof GAMES[number]['category'];

// 게임 필터링 함수들
export const getRecommendedGames = () => {
  // 전체 게임에서 랜덤으로 5개 선택
  const shuffled = [...GAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
};
export const getNewGames = () => GAMES.filter(game => game.isNew);

// 게임 ID로 게임 정보 찾기
export const findGameById = (gameId: GameId) => {
  return GAMES.find(game => game.id === gameId);
}; 