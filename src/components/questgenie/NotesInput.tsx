'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Sparkles } from 'lucide-react';
import { generateFlashcardsAction } from '@/app/actions';
import type { Flashcard } from '@/app/types';
import { useToast } from '@/hooks/use-toast';

type NotesInputProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
};

export default function NotesInput({ isLoading, setIsLoading, onFlashcardsGenerated }: NotesInputProps) {
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await generateFlashcardsAction(notes);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    } else if (data) {
      onFlashcardsGenerated(data);
      setNotes('');
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Generate Flashcards</CardTitle>
        </div>
        <CardDescription>Paste your notes below and let AI create study questions for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="e.g., The mitochondria is the powerhouse of the cell..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={10}
            className="text-base"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading || !notes.trim()}>
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
