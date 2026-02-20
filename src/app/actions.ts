'use server';

import { generateFlashcards as generateFlashcardsFlow, GenerateFlashcardsInput } from '@/ai/flows/generate-flashcards-from-notes';
import type { Flashcard, GeneratedFlashcard } from '@/app/types';

export async function generateFlashcardsAction(notes: string): Promise<{ data: Flashcard[] | null; error: string | null }> {
  if (!notes || notes.trim().length < 20) {
    return { data: null, error: 'Please provide more detailed notes (at least 20 characters) to generate flashcards.' };
  }

  try {
    const input: GenerateFlashcardsInput = { notes };
    const generated: GeneratedFlashcard[] = await generateFlashcardsFlow(input);

    if (!generated || generated.length === 0) {
        return { data: null, error: 'The AI could not generate flashcards from the provided notes. Please try rephrasing or adding more details.' };
    }
    
    const flashcardsWithIds: Flashcard[] = generated.map((card) => ({
      ...card,
      id: crypto.randomUUID(),
    }));
    
    return { data: flashcardsWithIds, error: null };
  } catch (e) {
    console.error('Error generating flashcards:', e);
    return { data: null, error: 'An unexpected error occurred while generating flashcards. Please try again later.' };
  }
}
