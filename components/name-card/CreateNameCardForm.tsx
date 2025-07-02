'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioRecorder } from './AudioRecorder';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { firebaseClient } from '@/lib/firebase-rest';
import { toast } from 'sonner';
import { Loader2, Mic, Palette } from 'lucide-react';

export const CreateNameCardForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneticSpelling: '',
    pronouns: '',
    description: '',
    languages: [] as string[],
    theme: 'default',
  });

  const handleAudioReady = (blob: Blob) => {
    setAudioBlob(blob);
    // Only store the audio blob, don't trigger any save operations
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !audioBlob) {
      toast.error('Please complete all required fields and record your pronunciation');
      return;
    }

    setLoading(true);

    try {
      // Upload audio file to Firebase Storage
      const audioPath = `audio/${user.uid}/${Date.now()}.wav`;
      const audioUrl = await firebaseClient.uploadFile(audioPath, audioBlob);

      // Save name card to Firestore
      const nameCardData = {
        ...formData,
        audioUrl,
        audioPath,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || null,
        createdAt: new Date(),
        shareId: crypto.randomUUID(),
      };

      const docId = await firebaseClient.addDocument('nameCards', nameCardData);
      
      toast.success('Name card created successfully!');
      router.push('/profile');
    } catch (error: any) {
      console.error('Error creating name card:', error);
      toast.error('Failed to create name card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4">
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create Your Name Card
            </CardTitle>
            <CardDescription className="text-center">
              Share the correct pronunciation of your name with the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneticSpelling">Phonetic Spelling *</Label>
                  <Input
                    id="phoneticSpelling"
                    type="text"
                    placeholder="How your name sounds (e.g., JOHN-ah-than)"
                    value={formData.phoneticSpelling}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneticSpelling: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pronouns">Preferred Pronouns (Optional)</Label>
                  <Input
                    id="pronouns"
                    type="text"
                    placeholder="e.g., they/them, she/her, he/him"
                    value={formData.pronouns}
                    onChange={(e) =>
                      setFormData({ ...formData, pronouns: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Name Meaning/Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Share the meaning or origin of your name"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Languages Section */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Name Languages (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select the languages or cultural origins of your name to help others understand the context.
                  </p>
                  <LanguageSelector
                    selectedLanguages={formData.languages}
                    onLanguagesChange={(languages) =>
                      setFormData({ ...formData, languages })
                    }
                  />
                </div>

                {/* Audio Recording */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Audio Pronunciation *</Label>
                  <AudioRecorder onAudioReady={handleAudioReady} />
                </div>

                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Card Theme</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose a theme that represents your personality or cultural background.
                  </p>
                  <ThemeSelector
                    selectedTheme={formData.theme}
                    onThemeChange={(theme) =>
                      setFormData({ ...formData, theme })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={loading || !formData.fullName || !formData.phoneticSpelling || !audioBlob}
                  className="w-full"
                  size="lg"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Name Card
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};