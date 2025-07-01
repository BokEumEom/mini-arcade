export interface Position {
    x: number;
    y: number;
  }
  
  export interface Tower {
    id: string;
    type: TowerType;
    position: Position;
    level: number;
    damage: number;
    range: number;
    attackSpeed: number;
    lastAttackTime: number;
    cost: number;
    upgradeCost: number;
  }
  
  export type TowerType = 'archer' | 'cannon' | 'magic' | 'ice';
  
  export interface Enemy {
    id: string;
    type: EnemyType;
    position: Position;
    health: number;
    maxHealth: number;
    speed: number;
    pathIndex: number;
    isDead: boolean;
    reward: number;
  }
  
  export type EnemyType = 'goblin' | 'orc' | 'troll' | 'dragon';
  
  export interface Wave {
    id: string;
    enemies: EnemyType[];
    spawnInterval: number;
    isCompleted: boolean;
  }
  
  export interface GameState {
    isPlaying: boolean;
    isPaused: boolean;
    isGameOver: boolean;
    currentWave: number;
    totalWaves: number;
    money: number;
    lives: number;
    score: number;
    towers: Tower[];
    enemies: Enemy[];
    waves: Wave[];
    selectedTowerType: TowerType | null;
    selectedPosition: Position | null;
    gameTime: number;
  }
  
  export interface TowerConfig {
    type: TowerType;
    name: string;
    description: string;
    baseDamage: number;
    baseRange: number;
    baseAttackSpeed: number;
    baseCost: number;
    upgradeMultiplier: number;
    color: string;
    icon: string;
  }
  
  export interface EnemyConfig {
    type: EnemyType;
    name: string;
    health: number;
    speed: number;
    reward: number;
    color: string;
    icon: string;
  }
  
  export interface GameConfig {
    difficulty: 'easy' | 'medium' | 'hard';
    startingMoney: number;
    startingLives: number;
    totalWaves: number;
    mapSize: { width: number; height: number };
  }
  
  export const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
    archer: {
      type: 'archer',
      name: '궁수 타워',
      description: '빠른 공격 속도의 원거리 타워',
      baseDamage: 20,
      baseRange: 120,
      baseAttackSpeed: 1.5,
      baseCost: 100,
      upgradeMultiplier: 1.5,
      color: '#4CAF50',
      icon: '🏹',
    },
    cannon: {
      type: 'cannon',
      name: '대포 타워',
      description: '높은 데미지의 범위 공격 타워',
      baseDamage: 50,
      baseRange: 80,
      baseAttackSpeed: 0.8,
      baseCost: 150,
      upgradeMultiplier: 1.8,
      color: '#FF5722',
      icon: '💣',
    },
    magic: {
      type: 'magic',
      name: '마법 타워',
      description: '마법 데미지를 주는 타워',
      baseDamage: 35,
      baseRange: 100,
      baseAttackSpeed: 1.2,
      baseCost: 200,
      upgradeMultiplier: 1.6,
      color: '#9C27B0',
      icon: '🔮',
    },
    ice: {
      type: 'ice',
      name: '얼음 타워',
      description: '적을 느리게 만드는 타워',
      baseDamage: 15,
      baseRange: 90,
      baseAttackSpeed: 1.0,
      baseCost: 120,
      upgradeMultiplier: 1.4,
      color: '#2196F3',
      icon: '❄️',
    },
  };
  
  export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
    goblin: {
      type: 'goblin',
      name: '고블린',
      health: 50,
      speed: 1.0,
      reward: 10,
      color: '#8BC34A',
      icon: '👹',
    },
    orc: {
      type: 'orc',
      name: '오크',
      health: 100,
      speed: 0.8,
      reward: 20,
      color: '#795548',
      icon: '😈',
    },
    troll: {
      type: 'troll',
      name: '트롤',
      health: 200,
      speed: 0.6,
      reward: 40,
      color: '#607D8B',
      icon: '🧟‍♂️',
    },
    dragon: {
      type: 'dragon',
      name: '드래곤',
      health: 500,
      speed: 0.4,
      reward: 100,
      color: '#F44336',
      icon: '🐉',
    },
  };
  
  export const DEFAULT_GAME_CONFIG: GameConfig = {
    difficulty: 'medium',
    startingMoney: 300,
    startingLives: 20,
    totalWaves: 10,
    mapSize: { width: 400, height: 600 },
  };
  
  export const DIFFICULTY_CONFIGS: Record<GameConfig['difficulty'], GameConfig> = {
    easy: {
      difficulty: 'easy',
      startingMoney: 400,
      startingLives: 25,
      totalWaves: 8,
      mapSize: { width: 400, height: 600 },
    },
    medium: {
      difficulty: 'medium',
      startingMoney: 300,
      startingLives: 20,
      totalWaves: 10,
      mapSize: { width: 400, height: 600 },
    },
    hard: {
      difficulty: 'hard',
      startingMoney: 200,
      startingLives: 15,
      totalWaves: 12,
      mapSize: { width: 400, height: 600 },
    },
  }; 