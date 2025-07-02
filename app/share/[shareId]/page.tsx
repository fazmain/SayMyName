"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { firebaseClient } from "@/lib/firebase-rest";
import { NameCard } from "@/components/name-card/NameCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

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

export default function SharePage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [nameCard, setNameCard] = useState<NameCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchNameCard();
  }, [shareId]);

  const fetchNameCard = async () => {
    try {
      const cards = await firebaseClient.queryDocuments(
        "nameCards",
        "shareId",
        "EQUAL",
        shareId
      );

      if (cards.length === 0) {
        setNotFound(true);
      } else {
        setNameCard(cards[0] as NameCardData);
      }
    } catch (error) {
      console.error("Error fetching name card:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4 mt-20">
        <Card className="w-full max-w-md mx-auto">
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
      </div>
    );
  }

  if (notFound || !nameCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center p-4 mt-20">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Name Card Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The name card you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Learn to say {nameCard.fullName}&apos;s name.
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {nameCard.fullName} shared their card with you.
          </p>
        </div>

        <NameCard nameCard={nameCard} showActions={false} />

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Want to share your own name pronunciation?
          </p>
          <Link href="/">
            <Button variant="outline">Create Your Own Name Card</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
