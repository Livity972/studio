import { Lightbulb } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground font-headline">
            QuestGenie
          </h1>
        </div>
      </div>
    </header>
  );
}
