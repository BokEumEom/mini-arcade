import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Particle } from './Particle';

interface ParticleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ParticleEffectProps {
  isActive: boolean;
  centerX: number;
  centerY: number;
  onComplete: () => void;
}

const PARTICLE_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Cyan
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
];

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  isActive,
  centerX,
  centerY,
  onComplete,
}) => {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [completedParticles, setCompletedParticles] = useState(0);

  React.useEffect(() => {
    if (isActive) {
      // 파티클 생성
      const newParticles: ParticleData[] = Array.from({ length: 20 }, (_, index) => ({
        id: index,
        x: centerX,
        y: centerY,
        color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      }));
      
      setParticles(newParticles);
      setCompletedParticles(0);
    } else {
      setParticles([]);
      setCompletedParticles(0);
    }
  }, [isActive, centerX, centerY]);

  const handleParticleComplete = (particleId: number) => {
    setCompletedParticles(prev => {
      const newCount = prev + 1;
      if (newCount >= particles.length) {
        // 모든 파티클이 완료되면 효과 종료
        setTimeout(() => {
          onComplete();
        }, 100);
      }
      return newCount;
    });
  };

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          color={particle.color}
          onComplete={() => handleParticleComplete(particle.id)}
        />
      ))}
    </View>
  );
}; 