'use client';

import { useState, useMemo } from 'react';
import type { Flashcard, GeneratedFlashcard } from '@/app/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import Header from './Header';
import NotesInput from './NotesInput';
import FlashcardList from './FlashcardList';
import ReviewMode from './ReviewMode';
import { Button } from '@/components/ui/button';
import { BookOpen, Pencil, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '../ui/skeleton';

export default function QuestGenieApp() {
  const [mode, setMode] = useState<'edit' | 'review'>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const flashcardsCollection = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'flashcards');
  }, [user, firestore]);

  const flashcardsQuery = useMemoFirebase(() => {
    if (!flashcardsCollection) return null;
    return query(flashcardsCollection, orderBy('createdAt', 'desc'));
  }, [flashcardsCollection]);

  const { data: flashcards, isLoading: isLoadingFlashcards } = useCollection<Flashcard>(flashcardsQuery);

  const handleAddFlashcard = () => {
    if (!flashcardsCollection || !user) return;
    const newCard = {
      question: 'Nouvelle Question',
      answer: 'Nouvelle Réponse',
      userId: user.uid,
      createdAt: serverTimestamp(),
    };
    addDocumentNonBlocking(flashcardsCollection, newCard);
  };

  const handleUpdateFlashcard = (updatedCard: Flashcard) => {
    if (!flashcardsCollection) return;
    const cardRef = doc(flashcardsCollection, updatedCard.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...cardData } = updatedCard;
    updateDocumentNonBlocking(cardRef, cardData);
  };

  const handleDeleteFlashcard = (id: string) => {
    if (!flashcardsCollection) return;
    const cardRef = doc(flashcardsCollection, id);
    deleteDocumentNonBlocking(cardRef);
  };

  const handleGeneratedFlashcards = (newFlashcards: GeneratedFlashcard[]) => {
    if (!flashcardsCollection || !user) return;

    for (const card of newFlashcards) {
      const cardWithUser = {
        ...card,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };
      addDocumentNonBlocking(flashcardsCollection, cardWithUser);
    }

    toast({
      title: 'Succès !',
      description: `${newFlashcards.length} nouvelles fiches ont été générées et sauvegardées.`,
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
          <div className="text-center bg-card p-10 rounded-lg shadow-sm border max-w-md">
            <Bot className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold font-headline">Bienvenue sur QuestGenie</h2>
            <p className="mt-2 text-muted-foreground">
              Veuillez vous connecter ou créer un compte pour sauvegarder vos fiches et commencer à réviser.
            </p>
          </div>
        </main>
      </div>
    );
  }

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
                {mode === 'edit' ? 'Mon Paquet' : 'Mode Révision'}
              </h2>
              {flashcards && flashcards.length > 0 && (
                <Button variant="outline" onClick={() => setMode(mode === 'edit' ? 'review' : 'edit')}>
                  {mode === 'edit' ? (
                    <BookOpen className="mr-2 h-4 w-4" />
                  ) : (
                    <Pencil className="mr-2 h-4 w-4" />
                  )}
                  {mode === 'edit' ? 'Commencer la révision' : "Retour à l'édition"}
                </Button>
              )}
            </div>

            {isLoadingFlashcards ? (
              <div className="space-y-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            ) : mode === 'edit' ? (
              <FlashcardList
                flashcards={flashcards || []}
                onAddFlashcard={handleAddFlashcard}
                onUpdateFlashcard={handleUpdateFlashcard}
                onDeleteFlashcard={handleDeleteFlashcard}
              />
            ) : (
              <ReviewMode flashcards={flashcards || []} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
