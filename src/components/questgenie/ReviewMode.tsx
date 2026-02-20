'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Flashcard } from '@/app/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import FlippableFlashcard from './FlippableFlashcard';
import { Progress } from '../ui/progress';

type ReviewModeProps = {
  flashcards: Flashcard[];
};

export default function ReviewMode({ flashcards }: ReviewModeProps) {
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  useEffect(() => {
    if (flashcards.length > 0) {
      shuffleCards();
    }
  }, [flashcards]);


  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + shuffledCards.length) % shuffledCards.length);
    }, 150);
  };
  
  if (shuffledCards.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No cards to review.</div>;
  }
  
  const currentCard = shuffledCards[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>Card {currentIndex + 1} of {shuffledCards.length}</span>
            <Button variant="ghost" size="sm" onClick={shuffleCards}>
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle
            </Button>
        </div>
        <Progress value={((currentIndex + 1) / shuffledCards.length) * 100} />
      </div>

      <div className="flex-grow flex items-center justify-center">
        <FlippableFlashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      </div>

      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button variant="outline" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={() => setIsFlipped(!isFlipped)} className="px-8 bg-accent hover:bg-accent/90">
            Flip Card
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
