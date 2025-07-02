'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateNameCardForm } from '@/components/name-card/CreateNameCardForm';
import { redirect } from 'next/navigation';

export default function CreatePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/auth');
  }

  return <div className="mt-20"><CreateNameCardForm /></div>;
}