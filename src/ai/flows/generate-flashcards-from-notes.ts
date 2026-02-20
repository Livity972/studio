'use server';
/**
 * @fileOverview A Genkit flow for generating question-and-answer flashcards from study notes.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  notes: z.string().describe('The study notes or text from which to generate flashcards.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('The question for the flashcard.'),
  answer: z.string().describe('The answer for the flashcard.'),
});

const GenerateFlashcardsOutputSchema = z.array(FlashcardSchema).describe('An array of generated flashcards.');
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFromNotesFlow(input);
}

const generateFlashcardsPrompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: { schema: GenerateFlashcardsInputSchema },
  output: { schema: GenerateFlashcardsOutputSchema },
  prompt: `You are an AI assistant specialized in creating study flashcards.
Given the following study notes, generate a set of relevant question-and-answer flashcards.
Each flashcard should be an object with a 'question' and an 'answer' field.
Ensure the questions cover key concepts and facts from the notes, and the answers are concise and accurate.
Provide the output as a JSON array of flashcard objects.

Notes:
{{{notes}}}`,
});

const generateFlashcardsFromNotesFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromNotesFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input) => {
    const { output } = await generateFlashcardsPrompt(input);
    return output!;
  }
);
