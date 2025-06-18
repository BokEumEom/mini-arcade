import { Achievement } from '../../types/games/variants/tap-circle';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    title: '첫 게임',
    description: '첫 게임을 플레이하세요',
    icon: 'gamepad-variant',
    condition: (stats) => stats.targetsHit > 0,
    reward: '특수 타겟 출현 확률 +5%',
    completed: false
  },
  {
    id: 'score_100',
    title: '100점 달성',
    description: '한 게임에서 100점을 획득하세요',
    icon: 'trophy',
    condition: (stats) => stats.totalScore >= 100,
    reward: '콤보 배수 +0.5',
    completed: false
  },
  {
    id: 'combo_10',
    title: '콤보 마스터',
    description: '10콤보를 달성하세요',
    icon: 'star',
    condition: (stats) => stats.targetsHit >= 10,
    reward: '시간 보너스 +5초',
    completed: false
  },
  {
    id: 'special_10',
    title: '특별 타겟 수집가',
    description: '특별 타겟을 10번 터치하세요',
    icon: 'target',
    condition: (stats) => stats.targetsHit >= 10,
    reward: '특수 타겟 출현 확률 +10%',
    completed: false
  },
  {
    id: 'bomb_master',
    title: '폭탄 회피왕',
    description: '폭탄을 20번 피하세요',
    icon: 'bomb',
    condition: (stats) => stats.targetsMissed >= 20,
    reward: '시간 보너스 +3초',
    completed: false
  },
  {
    id: 'perfect_game',
    title: '퍼펙트 게임',
    description: '실수 없이 게임을 완료하세요',
    icon: 'crown',
    condition: (stats) => stats.perfectGames >= 1,
    reward: '콤보 배수 +1',
    completed: false
  }
]; 