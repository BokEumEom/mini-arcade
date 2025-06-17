import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GameOverModal } from '../../../components/games/GameOverModal';
import { StartScreen } from '../../../components/games/StartScreen';
import { Card } from '../../../components/memory/Card';
import { ScoreDisplay } from '../../../components/memory/ScoreDisplay';
import { DEFAULT_CONFIG, GameProps, GameScore } from '../../../types/games';
import { Card as CardType } from '../../../types/games/memory';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

export default function MemoryGame({ config = DEFAULT_CONFIG, onGameOver }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState<GameScore>({ score: 0, combo: 0, highScore: 0 });
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [flipCount, setFlipCount] = useState(0);

  const initializeCards = () => {
    const values = Array.from({ length: 8 }, (_, i) => i + 1);
    const pairs = [...values, ...values];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    return shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
  };

  const handleCardPress = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].isMatched || cards[cardId].isFlipped) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setFlipCount(prev => prev + 1);
      const [first, second] = newFlippedCards;
      if (cards[first].value === cards[second].value) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        setScore(prev => ({
          score: prev.score + 1,
          combo: prev.combo + 1,
          highScore: Math.max(prev.highScore, prev.score + 1)
        }));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setScore(prev => ({ ...prev, combo: 0 }));
        }, 1000);
      }
    }
  };

  const handlePlayAgain = () => {
    setIsGameOver(false);
    setScore({ score: 0, combo: 0, highScore: score.highScore });
    setCards(initializeCards());
    setFlipCount(0);
    setIsPlaying(true);
  };

  const handleStart = () => {
    setCards(initializeCards());
    setFlipCount(0);
    setIsPlaying(true);
  };

  const handleExit = () => {
    onGameOver?.(score);
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameOver(true);
    }
  }, [cards]);

  return (
    <View style={styles.container}>
      <ScoreDisplay 
        score={score.score} 
        combo={score.combo} 
        flipCount={flipCount}
      />
      
      <View style={styles.gameArea}>
        <View style={styles.grid}>
          {cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onPress={() => handleCardPress(card.id)}
            />
          ))}
        </View>
      </View>

      {!isPlaying && (
        <StartScreen
          onStart={handleStart}
          title="Memory Game!"
          buttonText="Start Game"
        />
      )}

      {isGameOver && (
        <GameOverModal
          score={score}
          flipCount={flipCount}
          onPlayAgain={handlePlayAgain}
          onExit={handleExit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
  },
  gameArea: {
    flex: 1,
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
}); 