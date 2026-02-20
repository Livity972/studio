import type { Flashcard } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import FlashcardItem from './FlashcardItem';
import { Card, CardContent } from '../ui/card';

type FlashcardListProps = {
  flashcards: Flashcard[];
  onAddFlashcard: () => void;
  onUpdateFlashcard: (card: Flashcard) => void;
  onDeleteFlashcard: (id: string) => void;
};

export default function FlashcardList({
  flashcards,
  onAddFlashcard,
  onUpdateFlashcard,
  onDeleteFlashcard,
}: FlashcardListProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onAddFlashcard} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add New Card
      </Button>
      {flashcards.length === 0 ? (
        <Card className="mt-4 flex flex-col items-center justify-center text-center p-8">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="mt-4 text-lg font-semibold">Your deck is empty.</p>
            <p className="mt-1 text-muted-foreground">
              Generate flashcards from your notes or add one manually to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {flashcards.map((card) => (
            <FlashcardItem
              key={card.id}
              card={card}
              onUpdate={onUpdateFlashcard}
              onDelete={onDeleteFlashcard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
