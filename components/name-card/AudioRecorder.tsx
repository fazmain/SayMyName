'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
  maxDuration?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  maxDuration = 5000,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onAudioReady(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setProgress(0);
      setDuration(0);

      // Progress tracking
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 100;
          setProgress((newDuration / maxDuration) * 100);
          return newDuration;
        });
      }, 100);

      // Auto-stop after max duration
      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, maxDuration);

    } catch (error) {
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Stop event bubbling
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const playRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Record Your Name Pronunciation</h3>
            <p className="text-sm text-muted-foreground">
              Maximum {maxDuration / 1000} seconds
            </p>
          </div>

          {isRecording && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-center text-sm text-muted-foreground">
                {(duration / 1000).toFixed(1)}s / {maxDuration / 1000}s
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-2">
            {!audioBlob ? (
              <Button
                type="button" // Explicitly set type to button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="flex items-center space-x-2"
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Start Recording</span>
                  </>
                )}
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  type="button" // Explicitly set type to button
                  onClick={isPlaying ? pauseRecording : playRecording}
                  variant="outline"
                  size="lg"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  type="button" // Explicitly set type to button
                  onClick={resetRecording} 
                  variant="outline" 
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};