'use server';

import {
  generateFlashcards as generateFlashcardsFlow,
  GenerateFlashcardsInput,
  GenerateFlashcardsOutput,
} from '@/ai/flows/generate-flashcards-from-notes';

// This action now just returns the AI output directly.
// The client will handle adding it to Firestore.
export async function generateFlashcardsAction(
  notes: string
): Promise<{ data: GenerateFlashcardsOutput | null; error: string | null }> {
  if (!notes || notes.trim().length < 20) {
    return { data: null, error: 'Veuillez fournir des notes plus détaillées (au moins 20 caractères) pour générer des fiches.' };
  }

  try {
    const input: GenerateFlashcardsInput = { notes };
    const generated: GenerateFlashcardsOutput = await generateFlashcardsFlow(input);

    if (!generated || generated.length === 0) {
      return { data: null, error: 'L\'IA n\'a pas pu générer de fiches à partir des notes fournies. Veuillez essayer de reformuler ou d\'ajouter plus de détails.' };
    }

    return { data: generated, error: null };
  } catch (e) {
    console.error('Error generating flashcards:', e);
    return { data: null, error: 'Une erreur inattendue s\'est produite lors de la génération des fiches. Veuillez réessayer plus tard.' };
  }
}
