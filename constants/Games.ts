import { IconName } from '@/components/ui/IconSymbol';

export const GAMES = [
  {
    id: 'rock-paper-scissors',
    title: '가위바위보',
    description: '가위바위보 게임',
    icon: 'swords' as IconName,
    color: '#FF6B6B',
  },
  {
    id: '2048',
    title: '2048',
    description: '숫자를 밀고 합치세요',
    icon: 'gem' as IconName,
    color: '#4ECDC4',
  },
  {
    id: 'memory',
    title: '기억력 게임',
    description: '같은 그림 찾기',
    icon: 'brain' as IconName,
    color: '#FFD93D',
  },
  {
    id: 'swipe-square',
    title: '스와이프 스퀘어',
    description: '스와이프로 사각형 이동',
    icon: 'move' as IconName,
    color: '#95E1D3',
  },
  {
    id: 'tetris',
    title: '테트리스',
    description: '클래식 블록 퍼즐',
    icon: 'puzzle' as IconName,
    color: '#6C5CE7',
  },
  {
    id: 'othello',
    title: '오델로',
    description: '전략 보드 게임',
    icon: 'game-controller' as IconName,
    color: '#2D3436',
  },
  {
    id: 'tap-circle',
    title: '탭 서클',
    description: '순서대로 원형 탭하기',
    icon: 'target' as IconName,
    color: '#FF9F43',
  },
  {
    id: 'number-puzzle',
    title: '숫자 퍼즐',
    description: '숫자를 순서대로 배열하세요',
    icon: 'grid' as IconName,
    color: '#00B894',
  },
  {
    id: 'quick-math',
    title: '빠른 계산',
    description: '빠르게 연산 문제를 풀어보세요!',
    icon: 'zap' as IconName,
    color: '#FF9800',
  },
  {
    id: 'avoid-bomb',
    title: '폭탄 피하기',
    description: '폭탄을 피해서 점수를 획득하세요!',
    icon: 'bomb' as IconName,
    color: '#FF5252',
  },
] as const;

export type GameId = typeof GAMES[number]['id']; 