'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseClient, User } from '@/lib/firebase-rest';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = firebaseClient.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = await firebaseClient.signInWithEmailAndPassword(email, password);
    setUser(user);
    
    // Create user document in Firestore
    try {
      await firebaseClient.addDocument('users', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        createdAt: new Date(),
      });
    } catch (error) {
      // User document might already exist, ignore error
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const user = await firebaseClient.createUserWithEmailAndPassword(email, password);
    await firebaseClient.updateProfile(displayName);
    
    // Update local user state
    const updatedUser = { ...user, displayName };
    setUser(updatedUser);
    
    // Create user document in Firestore
    await firebaseClient.addDocument('users', {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: new Date(),
    });
  };

  const signInWithGoogle = async () => {
    try {
      const user = await firebaseClient.signInWithGoogle();
      setUser(user);
      
      // Create user document in Firestore
      await firebaseClient.addDocument('users', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
      });
    } catch (error: any) {
      if (error.message !== 'Redirecting to Google OAuth') {
        throw error;
      }
    }
  };

  const logout = async () => {
    await firebaseClient.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (user) {
      // Delete user document from Firestore
      const userDocs = await firebaseClient.queryDocuments('users', 'uid', 'EQUAL', user.uid);
      for (const doc of userDocs) {
        await firebaseClient.deleteDocument('users', doc.id);
      }
      
      // Delete user authentication
      await firebaseClient.deleteUser();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};