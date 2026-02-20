// Type from AI
export type GeneratedFlashcard = {
  question: string;
  answer: string;
};

// Internal type with ID for client-side state management
export type Flashcard = GeneratedFlashcard & {
  id: string;
};
