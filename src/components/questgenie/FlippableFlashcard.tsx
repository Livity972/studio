import type { Flashcard } from '@/app/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';

type FlippableFlashcardProps = {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
};

export default function FlippableFlashcard({ card, isFlipped, onFlip }: FlippableFlashcardProps) {
  return (
    <div
      className={cn('flashcard-container w-full h-80 cursor-pointer', { flipped: isFlipped })}
      onClick={onFlip}
    >
      <div className="flashcard-inner">
        <Card className="flashcard-front absolute w-full h-full p-6 flex flex-col justify-center items-center text-center">
            <p className="text-sm text-muted-foreground mb-2">Question</p>
            <p className="text-xl font-semibold">{card.question}</p>
            <div className="absolute bottom-4 right-4 flex items-center text-muted-foreground text-xs">
                <RotateCw className="h-3 w-3 mr-1" />
                Cliquez pour retourner
            </div>
        </Card>
        <Card className="flashcard-back absolute w-full h-full p-6 flex flex-col justify-center items-center text-center bg-secondary">
             <p className="text-sm text-muted-foreground mb-2">Réponse</p>
             <p className="text-xl">{card.answer}</p>
             <div className="absolute bottom-4 right-4 flex items-center text-muted-foreground text-xs">
                <RotateCw className="h-3 w-3 mr-1" />
                Cliquez pour retourner
            </div>
        </Card>
      </div>
    </div>
  );
}
