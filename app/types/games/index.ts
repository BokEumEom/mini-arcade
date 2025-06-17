export interface GameScore {
  score: number;
  combo: number;
  highScore: number;
}

export interface GameProps {
  config?: GameConfig;
  onGameOver?: (score: GameScore) => void;
}

export interface GameConfig {
  // Add game configuration options here
}

export const DEFAULT_CONFIG: GameConfig = {
  // Add default configuration values here
}; 