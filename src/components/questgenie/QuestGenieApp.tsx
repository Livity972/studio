'use client';

import { useState } from 'react';
import type { Flashcard } from '@/app/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Header from './Header';
import NotesInput from './NotesInput';
import FlashcardList from './FlashcardList';
import ReviewMode from './ReviewMode';
import { Button } from '@/components/ui/button';
import { BookOpen, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QuestGenieApp() {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', []);
  const [mode, setMode] = useState<'edit' | 'review'>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddFlashcard = () => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      question: 'New Question',
      answer: 'New Answer',
    };
    setFlashcards([newCard, ...flashcards]);
  };

  const handleUpdateFlashcard = (updatedCard: Flashcard) => {
    setFlashcards(flashcards.map((card) => (card.id === updatedCard.id ? updatedCard : card)));
  };

  const handleDeleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };
  
  const handleGeneratedFlashcards = (newFlashcards: Flashcard[]) => {
    setFlashcards([...newFlashcards, ...flashcards]);
    toast({
      title: 'Success!',
      description: `${newFlashcards.length} new flashcards have been generated.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="lg:order-1">
            <NotesInput 
              setIsLoading={setIsLoading} 
              isLoading={isLoading}
              onFlashcardsGenerated={handleGeneratedFlashcards}
            />
          </div>
          <div className="lg:order-2 mt-8 lg:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline text-primary">
                {mode === 'edit' ? 'My Deck' : 'Review Mode'}
              </h2>
              {flashcards.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setMode(mode === 'edit' ? 'review' : 'edit')}
                >
                  {mode === 'edit' ? <BookOpen className="mr-2" /> : <Pencil className="mr-2" />}
                  {mode === 'edit' ? 'Start Review' : 'Back to Edit'}
                </Button>
              )}
            </div>
            
            {mode === 'edit' ? (
              <FlashcardList
                flashcards={flashcards}
                onAddFlashcard={handleAddFlashcard}
                onUpdateFlashcard={handleUpdateFlashcard}
                onDeleteFlashcard={handleDeleteFlashcard}
              />
            ) : (
              <ReviewMode flashcards={flashcards} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
