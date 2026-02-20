'use client';

import { useState } from 'react';
import type { Flashcard } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Label } from '../ui/label';

type FlashcardItemProps = {
  card: Flashcard;
  onUpdate: (card: Flashcard) => void;
  onDelete: (id: string) => void;
};

export default function FlashcardItem({ card, onUpdate, onDelete }: FlashcardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(card.question);
  const [editedAnswer, setEditedAnswer] = useState(card.answer);

  const handleSave = () => {
    onUpdate({ ...card, question: editedQuestion, answer: editedAnswer });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuestion(card.question);
    setEditedAnswer(card.answer);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`question-${card.id}`} className="font-semibold text-sm">Question</Label>
              <Textarea
                id={`question-${card.id}`}
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`answer-${card.id}`} className="font-semibold text-sm">Réponse</Label>
              <Textarea
                id={`answer-${card.id}`}
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">{card.question}</p>
            <p className="text-muted-foreground">{card.answer}</p>
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(card.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
