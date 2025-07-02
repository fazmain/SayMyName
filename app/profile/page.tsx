'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NameCard } from '@/components/name-card/NameCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { firebaseClient } from '@/lib/firebase-rest';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

interface NameCardData {
  id: string;
  fullName: string;
  phoneticSpelling: string;
  pronouns?: string;
  description?: string;
  audioUrl: string;
  audioPath?: string;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  createdAt: any;
  shareId: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [nameCards, setNameCards] = useState<NameCardData[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserNameCards();
    }
  }, [user]);

  const fetchUserNameCards = async () => {
    if (!user) return;

    try {
      const cards = await firebaseClient.queryDocuments('nameCards', 'userId', 'EQUAL', user.uid);
      setNameCards(cards as NameCardData[]);
    } catch (error) {
      console.error('Error fetching user name cards:', error);
      toast.error('Failed to load your name cards');
    } finally {
      setLoadingCards(false);
    }
  };

  const handleDeleteNameCard = async (nameCard: NameCardData) => {
    try {
      // Delete audio file from storage
      if (nameCard.audioPath) {
        await firebaseClient.deleteFile(nameCard.audioPath);
      }
      
      // Delete document from Firestore
      await firebaseClient.deleteDocument('nameCards', nameCard.id);
      
      // Update local state
      setNameCards(prev => prev.filter(card => card.id !== nameCard.id));
      toast.success('Name card deleted successfully');
    } catch (error) {
      console.error('Error deleting name card:', error);
      toast.error('Failed to delete name card');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-4 mt-20">
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback className="text-lg">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  {user.displayName || 'User Profile'}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary">{nameCards.length} Name Cards</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Name Cards Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Name Cards</CardTitle>
                <CardDescription>
                  Manage and share your name pronunciation cards
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingCards ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="w-full">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <Skeleton className="h-6 w-32 mx-auto" />
                          <Skeleton className="h-4 w-24 mx-auto" />
                        </div>
                        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : nameCards.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="bg-muted p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Name Cards Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first name card to share your pronunciation with others
                </p>
                <Link href="/create">
                  <Button>Create Your First Name Card</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nameCards.map((nameCard) => (
                  <div key={nameCard.id} className="relative">
                    <NameCard
                      nameCard={nameCard}
                      currentUserId={user.uid}
                      onDelete={() => handleDeleteNameCard(nameCard)}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}