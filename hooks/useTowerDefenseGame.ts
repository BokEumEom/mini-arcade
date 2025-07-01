import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { DEFAULT_GAME_CONFIG, Enemy, ENEMY_CONFIGS, EnemyType, GameConfig, GameState, Position, Tower, TOWER_CONFIGS, TowerType, Wave } from '../types/games/variants/tower-defense';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_WIDTH = SCREEN_WIDTH - 20;
const BOARD_HEIGHT = SCREEN_WIDTH * 1.3;

// Adjust game path to match new board dimensions
const GAME_PATH = [
  { x: 0, y: BOARD_HEIGHT * 0.5 },
  { x: BOARD_WIDTH * 0.25, y: BOARD_HEIGHT * 0.5 },
  { x: BOARD_WIDTH * 0.25, y: BOARD_HEIGHT * 0.3 },
  { x: BOARD_WIDTH * 0.5, y: BOARD_HEIGHT * 0.3 },
  { x: BOARD_WIDTH * 0.5, y: BOARD_HEIGHT * 0.7 },
  { x: BOARD_WIDTH * 0.75, y: BOARD_HEIGHT * 0.7 },
  { x: BOARD_WIDTH * 0.75, y: BOARD_HEIGHT * 0.2 },
  { x: BOARD_WIDTH, y: BOARD_HEIGHT * 0.2 },
  { x: BOARD_WIDTH, y: BOARD_HEIGHT * 0.8 },
];

const GRID_SIZE = 40;
const GRID_COLS = 10;
const GRID_ROWS = 15;

interface DamageEffect {
  id: string;
  damage: number;
  position: Position;
}

interface AttackState {
  towerId: string;
  enemyId: string;
  timestamp: number;
}

export function useTowerDefenseGame(config: GameConfig = DEFAULT_GAME_CONFIG) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentWave: 0,
    totalWaves: config.totalWaves,
    money: config.startingMoney,
    lives: config.startingLives,
    score: 0,
    towers: [],
    enemies: [],
    waves: [],
    selectedTowerType: null,
    selectedPosition: null,
    gameTime: 0,
  });

  const [damageEffects, setDamageEffects] = useState<DamageEffect[]>([]);
  const [attackStates, setAttackStates] = useState<AttackState[]>([]);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const lastTimeRef = useRef<number>(Date.now());

  // Initialize waves
  useEffect(() => {
    const waves: Wave[] = [];
    for (let i = 0; i < config.totalWaves; i++) {
      const wave: Wave = {
        id: `wave-${i + 1}`,
        enemies: generateWaveEnemies(i + 1),
        spawnInterval: Math.max(1000 - i * 50, 300), // Spawn faster as waves progress
        isCompleted: false,
      };
      waves.push(wave);
    }
    setGameState(prev => ({ ...prev, waves }));
  }, [config.totalWaves]);

  function generateWaveEnemies(waveNumber: number): EnemyType[] {
    const enemies: EnemyType[] = [];
    const baseCount = 5 + waveNumber * 2;
    
    for (let i = 0; i < baseCount; i++) {
      if (waveNumber >= 8) {
        enemies.push('dragon');
      } else if (waveNumber >= 5) {
        enemies.push(Math.random() > 0.7 ? 'troll' : 'orc');
      } else if (waveNumber >= 3) {
        enemies.push(Math.random() > 0.6 ? 'orc' : 'goblin');
      } else {
        enemies.push('goblin');
      }
    }
    
    return enemies;
  }

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      currentWave: 0,
      money: config.startingMoney,
      lives: config.startingLives,
      score: 0,
      towers: [],
      enemies: [],
      gameTime: 0,
    }));
    setDamageEffects([]);
  }, [config]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const selectTowerType = useCallback((towerType: TowerType | null) => {
    setGameState(prev => ({ ...prev, selectedTowerType: towerType }));
  }, []);

  const selectPosition = useCallback((position: Position | null) => {
    setGameState(prev => ({ ...prev, selectedPosition: position }));
  }, []);

  const canPlaceTower = useCallback((position: Position): boolean => {
    // Check if position is on the path
    const isOnPath = GAME_PATH.some(pathPoint => 
      Math.abs(pathPoint.x - position.x) < GRID_SIZE && 
      Math.abs(pathPoint.y - position.y) < GRID_SIZE
    );
    
    if (isOnPath) return false;

    // Check if tower already exists at this position
    const towerExists = gameState.towers.some(tower => 
      Math.abs(tower.position.x - position.x) < GRID_SIZE && 
      Math.abs(tower.position.y - position.y) < GRID_SIZE
    );

    return !towerExists;
  }, [gameState.towers]);

  const placeTower = useCallback((towerType: TowerType, position: Position) => {
    if (!canPlaceTower(position)) return false;

    const towerConfig = TOWER_CONFIGS[towerType];
    if (gameState.money < towerConfig.baseCost) return false;

    const tower: Tower = {
      id: `tower-${Date.now()}`,
      type: towerType,
      position,
      level: 1,
      damage: towerConfig.baseDamage,
      range: towerConfig.baseRange,
      attackSpeed: towerConfig.baseAttackSpeed,
      lastAttackTime: 0,
      cost: towerConfig.baseCost,
      upgradeCost: Math.floor(towerConfig.baseCost * towerConfig.upgradeMultiplier),
    };

    setGameState(prev => ({
      ...prev,
      towers: [...prev.towers, tower],
      money: prev.money - towerConfig.baseCost,
      selectedTowerType: null,
      selectedPosition: null,
    }));

    return true;
  }, [gameState.money, canPlaceTower]);

  const upgradeTower = useCallback((towerId: string) => {
    setGameState(prev => {
      const tower = prev.towers.find(t => t.id === towerId);
      if (!tower || prev.money < tower.upgradeCost) return prev;

      const towerConfig = TOWER_CONFIGS[tower.type];
      const upgradedTower: Tower = {
        ...tower,
        level: tower.level + 1,
        damage: Math.floor(tower.damage * towerConfig.upgradeMultiplier),
        range: Math.floor(tower.range * 1.1),
        attackSpeed: tower.attackSpeed * 1.1,
        upgradeCost: Math.floor(tower.upgradeCost * towerConfig.upgradeMultiplier),
      };

      return {
        ...prev,
        towers: prev.towers.map(t => t.id === towerId ? upgradedTower : t),
        money: prev.money - tower.upgradeCost,
      };
    });
  }, []);

  const sellTower = useCallback((towerId: string) => {
    setGameState(prev => {
      const tower = prev.towers.find(t => t.id === towerId);
      if (!tower) return prev;

      const sellValue = Math.floor(tower.cost * 0.7);
      
      return {
        ...prev,
        towers: prev.towers.filter(t => t.id !== towerId),
        money: prev.money + sellValue,
      };
    });
  }, []);

  const spawnEnemy = useCallback((enemyType: EnemyType) => {
    const enemyConfig = ENEMY_CONFIGS[enemyType];
    const enemy: Enemy = {
      id: `enemy-${Date.now()}`,
      type: enemyType,
      position: { ...GAME_PATH[0] },
      health: enemyConfig.health,
      maxHealth: enemyConfig.health,
      speed: enemyConfig.speed,
      pathIndex: 0,
      isDead: false,
      reward: enemyConfig.reward,
    };

    setGameState(prev => ({
      ...prev,
      enemies: [...prev.enemies, enemy],
    }));
  }, []);

  const addDamageEffect = useCallback((damage: number, position: Position) => {
    const effectId = `damage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setDamageEffects(prev => [...prev, { id: effectId, damage, position }]);
    
    // Remove effect after animation completes
    setTimeout(() => {
      setDamageEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 1000);
  }, []);

  const removeDamageEffect = useCallback((effectId: string) => {
    setDamageEffects(prev => prev.filter(effect => effect.id !== effectId));
  }, []);

  const updateGame = useCallback((deltaTime: number) => {
    setGameState(prev => {
      const currentTime = Date.now();
      let updatedEnemies = [...prev.enemies];
      let newMoney = prev.money;
      let newScore = prev.score;
      let newLives = prev.lives;

      console.log(`Game update - Enemies: ${updatedEnemies.length}, Towers: ${prev.towers.length}`);

      // Clean up old attack states (older than 500ms)
      setAttackStates(current => current.filter(attack => currentTime - attack.timestamp < 500));

      // Move enemies
      updatedEnemies = updatedEnemies.map(enemy => {
        if (enemy.isDead) return enemy;

        const targetPath = GAME_PATH[enemy.pathIndex];
        if (!targetPath) return enemy;

        const dx = targetPath.x - enemy.position.x;
        const dy = targetPath.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          // Reached current path point, move to next
          if (enemy.pathIndex < GAME_PATH.length - 1) {
            return { ...enemy, pathIndex: enemy.pathIndex + 1 };
          } else {
            // Reached the end, lose a life
            return { ...enemy, isDead: true };
          }
        }

        // Move towards target
        const moveDistance = enemy.speed * deltaTime * 0.1;
        const moveX = (dx / distance) * moveDistance;
        const moveY = (dy / distance) * moveDistance;

        return {
          ...enemy,
          position: {
            x: enemy.position.x + moveX,
            y: enemy.position.y + moveY,
          },
        };
      });

      // Update towers and handle attacks
      const updatedTowers = prev.towers.map(tower => {
        // Find enemies in range
        const enemiesInRange = updatedEnemies.filter(enemy => {
          const distance = Math.sqrt(
            Math.pow(enemy.position.x - tower.position.x, 2) +
            Math.pow(enemy.position.y - tower.position.y, 2)
          );
          const inRange = distance <= tower.range;
          if (inRange) {
            console.log(`Enemy ${enemy.type} in range of ${tower.type} tower. Distance: ${distance.toFixed(1)}, Range: ${tower.range}`);
          }
          return inRange;
        });

        if (enemiesInRange.length === 0) {
          console.log(`No enemies in range for ${tower.type} tower`);
          return tower;
        }

        // Check if enough time has passed since last attack
        const timeSinceLastAttack = currentTime - tower.lastAttackTime;
        const attackCooldown = 1000 / tower.attackSpeed;
        
        console.log(`Tower ${tower.type}: Time since last attack: ${timeSinceLastAttack}ms, Cooldown: ${attackCooldown.toFixed(0)}ms`);
        
        if (timeSinceLastAttack < attackCooldown) {
          return tower;
        }

        // Attack the first enemy in range
        const target = enemiesInRange[0];
        console.log(`🎯 Tower ${tower.type} attacking enemy ${target.type} for ${tower.damage} damage at position (${target.position.x.toFixed(1)}, ${target.position.y.toFixed(1)})`);
        
        // Add attack state for animation
        setAttackStates(current => [...current, {
          towerId: tower.id,
          enemyId: target.id,
          timestamp: currentTime,
        }]);
        
        // Add damage effect
        addDamageEffect(tower.damage, target.position);
        
        updatedEnemies = updatedEnemies.map(enemy => {
          if (enemy.id === target.id) {
            const newHealth = enemy.health - tower.damage;
            const isDead = newHealth <= 0;
            console.log(`💥 Enemy ${enemy.type} health: ${enemy.health} -> ${Math.max(0, newHealth)} ${isDead ? '(DEAD)' : ''}`);
            return {
              ...enemy,
              health: Math.max(0, newHealth),
              isDead: isDead,
            };
          }
          return enemy;
        });

        return {
          ...tower,
          lastAttackTime: currentTime,
        };
      });

      // Handle killed enemies and enemies that reached the end
      const deadEnemies = updatedEnemies.filter(enemy => enemy.isDead);
      const enemiesReachedEnd = deadEnemies.filter(enemy => enemy.pathIndex >= GAME_PATH.length - 1);
      const enemiesKilled = deadEnemies.filter(enemy => enemy.pathIndex < GAME_PATH.length - 1);

      newLives = prev.lives - enemiesReachedEnd.length;
      newMoney = prev.money + enemiesKilled.reduce((sum, enemy) => sum + enemy.reward, 0);
      newScore = prev.score + enemiesKilled.reduce((sum, enemy) => sum + enemy.reward * 10, 0);

      if (enemiesKilled.length > 0) {
        console.log(`💀 Killed ${enemiesKilled.length} enemies:`, enemiesKilled.map(e => e.type));
      }

      if (enemiesReachedEnd.length > 0) {
        console.log(`💔 ${enemiesReachedEnd.length} enemies reached the end. Lives: ${prev.lives} -> ${newLives}`);
      }

      return {
        ...prev,
        towers: updatedTowers,
        enemies: updatedEnemies.filter(enemy => !enemy.isDead),
        lives: newLives,
        money: newMoney,
        score: newScore,
        isGameOver: newLives <= 0,
      };
    });
  }, [addDamageEffect]);

  const startWave = useCallback(() => {
    if (gameState.currentWave >= gameState.waves.length) return;

    const currentWave = gameState.waves[gameState.currentWave];
    if (!currentWave || currentWave.isCompleted) return;

    let enemyIndex = 0;
    const spawnInterval = setInterval(() => {
      if (enemyIndex >= currentWave.enemies.length) {
        clearInterval(spawnInterval);
        return;
      }

      spawnEnemy(currentWave.enemies[enemyIndex]);
      enemyIndex++;
    }, currentWave.spawnInterval);

    setGameState(prev => ({
      ...prev,
      currentWave: prev.currentWave + 1,
    }));
  }, [gameState.currentWave, gameState.waves, spawnEnemy]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      updateGame(deltaTime);

      setGameState(prev => ({
        ...prev,
        gameTime: prev.gameTime + deltaTime,
      }));
    }, 16); // ~60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, updateGame]);

  // Auto-start waves
  useEffect(() => {
    if (gameState.isPlaying && gameState.enemies.length === 0 && gameState.currentWave < gameState.totalWaves) {
      const timer = setTimeout(() => {
        startWave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, gameState.enemies.length, gameState.currentWave, gameState.totalWaves, startWave]);

  const isTowerAttacking = useCallback((towerId: string) => {
    return attackStates.some(attack => attack.towerId === towerId);
  }, [attackStates]);

  const isEnemyDamaged = useCallback((enemyId: string) => {
    return attackStates.some(attack => attack.enemyId === enemyId);
  }, [attackStates]);

  const clearSelection = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      selectedTowerType: null,
      selectedPosition: null,
    }));
  }, []);

  const endGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isGameOver: true,
    }));
  }, []);

  return {
    gameState,
    damageEffects,
    isTowerAttacking,
    isEnemyDamaged,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    placeTower,
    upgradeTower,
    sellTower,
    selectTowerType,
    selectPosition,
    clearSelection,
    startWave,
    canPlaceTower,
    removeDamageEffect,
  };
} 