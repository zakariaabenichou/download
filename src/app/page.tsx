"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Download, Film, Loader2, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface VideoDetails {
  title: string;
  thumbnail: string;
}

export default function AudioScriberPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('mp3');
  const { toast } = useToast();

  const progressText = useMemo(() => {
    if (progress < 30) return "Initializing...";
    if (progress < 60) return "Fetching video details...";
    if (progress < 90) return "Extracting audio track...";
    if (progress < 100) return "Finalizing...";
    return "Complete!";
  }, [progress]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => {
              setVideoDetails({
                title: 'Exploring the Alps: A Scenic Journey',
                thumbnail: 'https://placehold.co/1280x720.png',
              });
              setIsLoading(false);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleExtractAudio = () => {
    try {
      new URL(videoUrl);
    } catch (_) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid video URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setVideoDetails(null);
  };

  const handleDownload = () => {
    // This function is a placeholder as requested.
    // The user will implement the actual download logic.
    console.log(`Download triggered for format: ${selectedFormat}`);
    toast({
      title: 'Preparing Download',
      description: `Your ${selectedFormat.toUpperCase()} file will begin downloading shortly.`,
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden shadow-2xl shadow-primary/10 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center p-6">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4 border border-primary/30">
                <AudioLines className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-headline">AudioScriber</CardTitle>
            <CardDescription>
              Extract high-quality audio from any video with a single click.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <div className="relative">
                <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="video-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            
            <Button
              onClick={handleExtractAudio}
              disabled={isLoading || !videoUrl}
              className="w-full transition-all duration-300"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Extract Audio'
              )}
            </Button>
            
            {isLoading && (
              <div className="space-y-3 pt-4 text-center transition-opacity duration-500">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{progressText}</p>
              </div>
            )}
            
            {videoDetails && !isLoading && (
              <div className="pt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                <Card className="bg-background/50">
                  <CardContent className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                    <div className="w-full md:w-48 flex-shrink-0">
                      <Image
                        src={videoDetails.thumbnail}
                        alt="Video thumbnail"
                        width={1280}
                        height={720}
                        className="rounded-lg aspect-video object-cover"
                        data-ai-hint="video player"
                      />
                    </div>
                    <div className="w-full space-y-4">
                      <h3 className="text-lg font-semibold line-clamp-2">{videoDetails.title}</h3>
                      <div className="space-y-2">
                        <Label htmlFor="format-select">Audio Format</Label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                          <SelectTrigger id="format-select" className="w-full md:w-[180px]">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mp3">MP3</SelectItem>
                            <SelectItem value="wav">WAV</SelectItem>
                            <SelectItem value="aac">AAC</SelectItem>
                            <SelectItem value="flac">FLAC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleDownload} className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download Audio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
