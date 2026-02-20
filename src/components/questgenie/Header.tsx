'use client';

import { Lightbulb, LogOut, User as UserIcon } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthForm } from '@/components/auth/AuthForm';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-headline">
            QuestGenie
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isUserLoading ? (
            <div className="h-10 w-36 bg-muted rounded-md animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Accès à votre compte</DialogTitle>
                  <DialogDescription>
                    Connectez-vous ou créez un compte pour sauvegarder vos fiches et y accéder de n'importe où.
                  </DialogDescription>
                </DialogHeader>
                <AuthForm onAuthSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}
