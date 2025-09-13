"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface VoiceHistoryProps {
  history: GeneratedAudio[];
  onSelect: (audio: GeneratedAudio) => void;
  currentAudio: GeneratedAudio | null;
}

export default function VoiceHistory({ history, onSelect, currentAudio }: VoiceHistoryProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const downloadAudio = (audio: GeneratedAudio, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selection
    
    const link = document.createElement('a');
    link.href = audio.audioUrl;
    link.download = `voice-${audio.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteFromHistory = (audioId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selection
    
    // In a real app, you'd want to update the parent state
    // For now, we'll just revoke the URL to free memory
    const audio = history.find(a => a.id === audioId);
    if (audio) {
      URL.revokeObjectURL(audio.audioUrl);
    }
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice History</CardTitle>
          <CardDescription>Your generated voices will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">🎵</div>
            <p className="text-sm">No voices generated yet</p>
            <p className="text-xs mt-1">Generate your first voice to see it here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice History</span>
          <Badge variant="secondary" className="text-xs">
            {history.length}/10
          </Badge>
        </CardTitle>
        <CardDescription>Click to replay previous generations</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4">
            {history.map((audio, index) => (
              <div
                key={audio.id}
                onClick={() => onSelect(audio)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                  currentAudio?.id === audio.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-accent-foreground/20'
                }`}
              >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {index === 0 ? '🆕' : '🎵'} {audio.voice}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(audio.duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => downloadAudio(audio, e)}
                        className="h-6 w-6 p-0 text-xs"
                        title="Download"
                      >
                        ⬇️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => deleteFromHistory(audio.id, e)}
                        className="h-6 w-6 p-0 text-xs text-red-500 hover:text-red-600"
                        title="Remove"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                  
                  {/* Text Preview */}
                  <p className="text-sm line-clamp-2 text-muted-foreground">
                    {audio.text}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(audio.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      <span>Speed: {audio.settings.speed}x</span>
                      <span>•</span>
                      <span>Pitch: {audio.settings.pitch}</span>
                    </div>
                  </div>
                </div>
                
                {/* Current Playing Indicator */}
                {currentAudio?.id === audio.id && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span>Currently selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}