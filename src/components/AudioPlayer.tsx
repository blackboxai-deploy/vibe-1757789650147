"use client";

import { useState, useEffect, useCallback, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface VoiceSettings {
  voice: string;
  speed: number;
  pitch: number;
  stability: number;
  clarity: number;
}

interface GeneratedAudio {
  id: string;
  text: string;
  voice: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
  settings: VoiceSettings;
}

interface AudioPlayerProps {
  audio: GeneratedAudio;
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function AudioPlayer({ audio, audioRef }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize audio element
  useEffect(() => {
    if (audioRef.current && audio) {
      const audioElement = audioRef.current;
      audioElement.src = audio.audioUrl;
      audioElement.volume = volume;
      audioElement.playbackRate = playbackRate;
      
      setIsLoading(true);
      setCurrentTime(0);
      setIsPlaying(false);

      const handleLoadedData = () => {
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      audioElement.addEventListener('loadeddata', handleLoadedData);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);

      return () => {
        audioElement.removeEventListener('loadeddata', handleLoadedData);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
      };
    }
    
    return undefined;
  }, [audio, audioRef, volume, playbackRate]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || isLoading) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
  }, [audioRef, isPlaying, isLoading]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [audioRef]);

  const seek = useCallback((newTime: number[]) => {
    if (!audioRef.current || isLoading) return;
    
    const time = newTime[0];
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, [audioRef, isLoading]);

  const changeVolume = useCallback((newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, [audioRef]);

  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [audioRef]);

  const downloadAudio = useCallback(() => {
    const link = document.createElement('a');
    link.href = audio.audioUrl;
    link.download = `voice-${audio.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [audio]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = audio.duration > 0 ? (currentTime / audio.duration) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Waveform/Progress Visualization */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audio.duration)}</span>
            </div>
          </div>

          {/* Seek Slider */}
          <div className="px-2">
            <Slider
              value={[currentTime]}
              onValueChange={seek}
              max={audio.duration}
              step={0.1}
              className="cursor-pointer"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={stop}
          disabled={isLoading}
          className="w-12 h-12 rounded-full"
        >
          ⏹️
        </Button>
        
        <Button
          size="lg"
          onClick={togglePlayPause}
          disabled={isLoading}
          className="w-16 h-16 rounded-full text-xl"
        >
          {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={downloadAudio}
          className="w-12 h-12 rounded-full"
        >
          ⬇️
        </Button>
      </div>

      {/* Advanced Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Volume Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            🔊 Volume: {Math.round(volume * 100)}%
          </label>
          <Slider
            value={[volume]}
            onValueChange={changeVolume}
            max={1}
            step={0.1}
            className="cursor-pointer"
          />
        </div>

        {/* Playback Speed */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            ⚡ Speed: {playbackRate}x
          </label>
          <div className="flex items-center gap-2">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <Button
                key={rate}
                variant={playbackRate === rate ? "default" : "outline"}
                size="sm"
                onClick={() => changePlaybackRate(rate)}
                className="text-xs px-2"
              >
                {rate}x
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Info */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Audio Details</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {audio.text}
              </p>
            </div>
            <Badge variant="secondary">{audio.voice}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2">{formatTime(audio.duration)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2">
                {audio.createdAt.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts Info */}
      <div className="text-xs text-muted-foreground">
        <p><strong>Keyboard shortcuts:</strong> Space (play/pause), ← → (seek), ↑ ↓ (volume)</p>
      </div>
    </div>
  );
}