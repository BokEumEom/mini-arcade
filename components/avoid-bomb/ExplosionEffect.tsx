import React, { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExplosionParticle } from './ExplosionParticle';

interface ExplosionData {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ExplosionEffectProps {
  isActive: boolean;
  centerX: number;
  centerY: number;
  onComplete: () => void;
}

const EXPLOSION_COLORS = [
  '#FF4444', // Red
  '#FF6B6B', // Light Red
  '#FF8C00', // Orange
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#FF6347', // Tomato
];

export const ExplosionEffect: React.FC<ExplosionEffectProps> = ({
  isActive,
  centerX,
  centerY,
  onComplete,
}) => {
  const [particles, setParticles] = useState<ExplosionData[]>([]);
  const [completedParticles, setCompletedParticles] = useState(0);

  useLayoutEffect(() => {
    if (isActive) {
      // 폭발 파티클 생성
      const newParticles: ExplosionData[] = Array.from({ length: 15 }, (_, index) => ({
        id: index,
        x: centerX,
        y: centerY,
        color: EXPLOSION_COLORS[index % EXPLOSION_COLORS.length],
      }));
      
      setParticles(newParticles);
      setCompletedParticles(0);
    } else {
      setParticles([]);
      setCompletedParticles(0);
    }
  }, [isActive, centerX, centerY]);

  const handleParticleComplete = useCallback((particleId: number) => {
    setCompletedParticles(prev => {
      const newCount = prev + 1;
      if (newCount >= particles.length && particles.length > 0) {
        // 모든 파티클이 완료되면 효과 종료
        // setTimeout을 사용하여 다음 프레임에서 실행
        requestAnimationFrame(() => {
          onComplete();
        });
      }
      return newCount;
    });
  }, [particles.length, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {particles.map((particle) => (
        <ExplosionParticle
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