import { CollisionResult, GameObject, GameState } from '../app/games/avoid-bomb/types';
import {
  DIFFICULTY_CONFIG,
  DIFFICULTY_LEVELS,
  FOOD_ICONS,
  GAME_CONFIG,
  OBJECT_SPEEDS,
  PLAYER_SIZE,
  PLAYER_START_X,
  PLAYER_Y,
  POWER_UP_DURATIONS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  type DifficultyLevel,
  type ObjectType
} from '../constants/avoid-bomb/constants';

export class AvoidBombGameLogic {
  // 현재 게임 시간에 따른 난이도 계산
  static getCurrentDifficulty(timeLeft: number): DifficultyLevel {
    if (timeLeft > DIFFICULTY_CONFIG.NORMAL_DURATION) return 'EASY';
    if (timeLeft > DIFFICULTY_CONFIG.HARD_DURATION) return 'NORMAL';
    return 'HARD';
  }

  // 난이도에 따른 오브젝트 가중치 계산 - 완전히 새로 작성
  static getObjectWeights(difficulty: DifficultyLevel) {
    const levelConfig = DIFFICULTY_LEVELS[difficulty];
    const bombWeight = levelConfig.BOMB_WEIGHT;
    
    // 나머지를 food, speed, shield로 분배
    const remainingWeight = 1 - bombWeight;
    const foodWeight = remainingWeight * 0.7; // 70%를 food가 차지
    const speedWeight = remainingWeight * 0.15; // 15%를 speed가 차지
    const shieldWeight = remainingWeight * 0.15; // 15%를 shield가 차지
    
    return {
      BOMB: bombWeight,
      FOOD: foodWeight,
      SPEED: speedWeight,
      SHIELD: shieldWeight,
    };
  }

  // 난이도에 따른 스폰 확률 계산
  static getSpawnChance(difficulty: DifficultyLevel): number {
    return DIFFICULTY_LEVELS[difficulty].SPAWN_CHANCE;
  }

  // 난이도에 따른 폭탄 속도 계산
  static getBombSpeed(difficulty: DifficultyLevel) {
    return DIFFICULTY_LEVELS[difficulty].BOMB_SPEED;
  }

  // 랜덤 음식 아이콘 선택
  private static getRandomFoodIcon(): string {
    return FOOD_ICONS[Math.floor(Math.random() * FOOD_ICONS.length)];
  }

  private static generateObjectType(difficulty: DifficultyLevel): ObjectType {
    const weights = this.getObjectWeights(difficulty);
    const random = Math.random();
    let sum = 0;
    
    // 가중치 순서대로 확인 (BOMB, FOOD, SPEED, SHIELD)
    const typeOrder: ObjectType[] = ['bomb', 'food', 'speed', 'shield'];
    
    // 타입 이름과 가중치 키 매핑
    const weightKeyMap = {
      'bomb': 'BOMB',
      'food': 'FOOD', 
      'speed': 'SPEED',
      'shield': 'SHIELD'
    } as const;
    
    console.log('=== Generating object ===');
    console.log('Difficulty:', difficulty);
    console.log('Weights:', weights);
    console.log('Random:', random.toFixed(3));
    
    for (const type of typeOrder) {
      const weightKey = weightKeyMap[type];
      const weight = weights[weightKey];
      sum += weight;
      console.log(`Checking ${type}: weight=${weight}, sum=${sum.toFixed(3)}, random=${random.toFixed(3)}`);
      
      if (random < sum) {
        console.log('✅ Generated object:', type);
        return type;
      }
    }
    
    console.log('❌ Fallback to bomb - no type matched');
    return 'bomb'; // fallback
  }

  static generateObject(difficulty: DifficultyLevel): GameObject {
    const type = this.generateObjectType(difficulty);
    let speedRange;
    
    if (type === 'bomb') {
      speedRange = this.getBombSpeed(difficulty);
    } else {
      speedRange = OBJECT_SPEEDS.OTHER;
    }
    
    const speed = speedRange.MIN + Math.random() * (speedRange.MAX - speedRange.MIN);

    return {
      id: Math.random().toString(),
      x: Math.random() * (SCREEN_WIDTH - 60) + 30,
      y: -50,
      type,
      speed,
      icon: type === 'food' ? this.getRandomFoodIcon() : undefined, // 음식인 경우 랜덤 아이콘
    };
  }

  static checkCollision(obj: GameObject, playerX: number, playerY: number): boolean {
    // 충돌 감지 개선: 더 정확한 거리 계산
    const distance = Math.sqrt(
      Math.pow(obj.x - playerX, 2) + 
      Math.pow(obj.y - playerY, 2)
    );
    
    // 충돌 반경을 더 크게 조정하여 감지 정확도 향상
    const collisionRadius = PLAYER_SIZE * 0.6;
    
    const hasCollision = distance < collisionRadius;
    
    // 충돌 근처에 있을 때만 로그 출력
    if (hasCollision || distance < collisionRadius * 1.5) {
      console.log('Collision check:', {
        type: obj.type,
        objPos: { x: obj.x.toFixed(1), y: obj.y.toFixed(1) },
        playerPos: { x: playerX.toFixed(1), y: playerY.toFixed(1) },
        distance: distance.toFixed(1),
        threshold: collisionRadius.toFixed(1),
        hasCollision
      });
    }
    
    return hasCollision;
  }

  static handleCollision(
    obj: GameObject, 
    currentState: GameState
  ): CollisionResult {
    const hasCollision = this.checkCollision(obj, currentState.playerX, currentState.playerY);
    
    if (!hasCollision) {
      return { hasCollision: false, shouldEndGame: false };
    }

    switch (obj.type) {
      case 'bomb':
        if (currentState.hasShield) {
          // 방패가 있으면 방패만 소모
          return {
            hasCollision: true,
            shouldEndGame: false,
            newHasShield: false,
            newShieldTimeLeft: 0,
          };
        } else {
          // 방패가 없으면 생명력 감소
          const newLives = currentState.lives - 1;
          return {
            hasCollision: true,
            shouldEndGame: newLives <= 0, // 생명력이 0 이하면 게임 종료
            newLives,
          };
        }

      case 'food':
        const newScore = {
          ...currentState.score,
          score: currentState.score.score + 1,
          combo: currentState.score.combo + 1,
          highScore: Math.max(currentState.score.highScore, currentState.score.score + 1),
        };
        return {
          hasCollision: true,
          shouldEndGame: false,
          newScore,
        };

      case 'speed':
        return {
          hasCollision: true,
          shouldEndGame: false,
          newHasSpeedBoost: true,
          newSpeedBoostTimeLeft: POWER_UP_DURATIONS.SPEED,
        };

      case 'shield':
        return {
          hasCollision: true,
          shouldEndGame: false,
          newHasShield: true,
          newShieldTimeLeft: POWER_UP_DURATIONS.SHIELD,
        };

      default:
        return { hasCollision: true, shouldEndGame: false };
    }
  }

  static updateObjects(objects: GameObject[]): GameObject[] {
    return objects
      .map(obj => ({
        ...obj,
        y: obj.y + obj.speed,
      }))
      .filter(obj => obj.y < SCREEN_HEIGHT + 50);
  }

  static shouldSpawnNewObject(difficulty: DifficultyLevel): boolean {
    return Math.random() < this.getSpawnChance(difficulty);
  }

  static updatePowerUps(
    hasShield: boolean, 
    shieldTimeLeft: number,
    hasSpeedBoost: boolean,
    speedBoostTimeLeft: number
  ): { 
    hasShield: boolean; 
    shieldTimeLeft: number;
    hasSpeedBoost: boolean;
    speedBoostTimeLeft: number;
  } {
    // Update shield effect
    let newHasShield = hasShield;
    let newShieldTimeLeft = shieldTimeLeft;
    
    if (hasShield) {
      newShieldTimeLeft -= (1 / GAME_CONFIG.FRAME_RATE);
      if (newShieldTimeLeft <= 0) {
        newHasShield = false;
        newShieldTimeLeft = 0;
      }
    }

    // Update speed boost effect
    let newHasSpeedBoost = hasSpeedBoost;
    let newSpeedBoostTimeLeft = speedBoostTimeLeft;
    
    if (hasSpeedBoost) {
      newSpeedBoostTimeLeft -= (1 / GAME_CONFIG.FRAME_RATE);
      if (newSpeedBoostTimeLeft <= 0) {
        newHasSpeedBoost = false;
        newSpeedBoostTimeLeft = 0;
      }
    }

    return { 
      hasShield: newHasShield, 
      shieldTimeLeft: newShieldTimeLeft,
      hasSpeedBoost: newHasSpeedBoost,
      speedBoostTimeLeft: newSpeedBoostTimeLeft,
    };
  }

  static getInitialState(): GameState {
    return {
      isPlaying: false,
      isGameOver: false,
      score: { score: 0, combo: 0, highScore: 0 },
      timeLeft: GAME_CONFIG.DURATION_SECONDS,
      playerX: PLAYER_START_X,
      playerY: PLAYER_Y,
      objects: [],
      hasShield: false,
      hasSpeedBoost: false,
      shieldTimeLeft: 0,
      speedBoostTimeLeft: 0,
      lives: GAME_CONFIG.INITIAL_LIVES,
      currentDifficulty: 'EASY',
    };
  }

  static movePlayer(
    currentX: number, 
    direction: 'left' | 'right',
    hasSpeedBoost: boolean
  ): number {
    const baseSpeed = 20;
    const speedMultiplier = hasSpeedBoost ? 1.5 : 1;
    const moveDistance = baseSpeed * speedMultiplier;
    
    if (direction === 'left') {
      return Math.max(30, currentX - moveDistance);
    } else {
      return Math.min(SCREEN_WIDTH - 30, currentX + moveDistance);
    }
  }
} 