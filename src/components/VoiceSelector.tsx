"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Voice {
  id: string;
  name: string;
  gender: "male" | "female";
  accent: string;
  description: string;
  sample?: string;
  premium?: boolean;
}

const voices: Voice[] = [
  {
    id: "rachel",
    name: "Rachel",
    gender: "female",
    accent: "American",
    description: "Warm, professional voice perfect for narrations",
  },
  {
    id: "domi",
    name: "Domi",
    gender: "female",
    accent: "American",
    description: "Strong, confident voice with clear articulation",
  },
  {
    id: "bella",
    name: "Bella",
    gender: "female",
    accent: "American",
    description: "Soft, gentle voice ideal for storytelling",
  },
  {
    id: "antoni",
    name: "Antoni",
    gender: "male",
    accent: "American",
    description: "Deep, authoritative voice for professional content",
  },
  {
    id: "elli",
    name: "Elli",
    gender: "female",
    accent: "American",
    description: "Young, energetic voice with natural flow",
  },
  {
    id: "josh",
    name: "Josh",
    gender: "male",
    accent: "American",
    description: "Friendly, conversational voice for casual content",
  },
  {
    id: "arnold",
    name: "Arnold",
    gender: "male",
    accent: "American",
    description: "Mature, distinguished voice for formal presentations",
  },
  {
    id: "adam",
    name: "Adam",
    gender: "male",
    accent: "American",
    description: "Clear, reliable voice for educational content",
  },
  {
    id: "sam",
    name: "Sam",
    gender: "male",
    accent: "American",
    description: "Versatile voice suitable for various content types",
  }
];

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  
  const selectedVoice = voices.find(voice => voice.id === value);

  const previewVoice = async (voiceId: string) => {
    setPreviewingVoice(voiceId);
    
    try {
      // Preview with a short sample text - call AI service directly
      const response = await fetch("https://oi-server.onrender.com/chat/completions", {
        method: "POST",
        headers: {
          "CustomerId": "cus_Sc64a7mwlJwpuu",
          "Content-Type": "application/json",
          "Authorization": "Bearer xxx"
        },
        body: JSON.stringify({
          model: "elevenlabs/eleven-multilingual-v2",
          messages: [
            {
              role: "user",
              content: JSON.stringify({
                text: "Hello! This is a voice preview sample.",
                voice: voiceId || "rachel",
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                  stability: 0.75,
                  similarity_boost: 0.75,
                  style: 0.0,
                  use_speaker_boost: true,
                },
              })
            }
          ]
        })
      });

      if (response.ok) {
        // Handle response similar to main generation
        const contentType = response.headers.get("content-type");
        let audioBlob: Blob;

        if (contentType?.includes("application/json")) {
          const jsonResponse = await response.json();
          if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message) {
            const message = jsonResponse.choices[0].message.content;
            
            if (typeof message === "string" && message.startsWith("data:audio")) {
              const base64Data = message.split(",")[1];
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
            } else if (typeof message === "string" && (message.startsWith("http") || message.startsWith("https"))) {
              const audioResponse = await fetch(message);
              audioBlob = await audioResponse.blob();
            } else {
              return; // Skip if no audio
            }
          } else {
            return;
          }
        } else {
          audioBlob = await response.blob();
        }
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(audioUrl);
        });
        
        await audio.play();
      }
    } catch (error) {
      console.error("Preview failed:", error);
    } finally {
      setPreviewingVoice(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Selection Dropdown */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedVoice ? (
              <div className="flex items-center gap-2">
                <span>{selectedVoice.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedVoice.gender === "male" ? "👨" : "👩"} {selectedVoice.accent}
                </Badge>
              </div>
            ) : (
              "Select a voice"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>{voice.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {voice.gender === "male" ? "👨" : "👩"} {voice.accent}
                  </Badge>
                  {voice.premium && (
                    <Badge className="text-xs bg-gradient-to-r from-gold-500 to-yellow-600">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected Voice Info Card */}
      {selectedVoice && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">
                    {selectedVoice.gender === "male" ? "👨" : "👩"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedVoice.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{selectedVoice.gender === "male" ? "Male" : "Female"}</span>
                    <span>•</span>
                    <span>{selectedVoice.accent}</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewVoice(selectedVoice.id)}
                disabled={previewingVoice === selectedVoice.id}
                className="text-xs"
              >
                {previewingVoice === selectedVoice.id ? "Playing..." : "🔊 Preview"}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {selectedVoice.description}
            </p>
          </div>
        </Card>
      )}

      {/* Voice Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Popular Voices</h4>
        <div className="grid grid-cols-2 gap-2">
          {voices.slice(0, 4).map((voice) => (
            <Button
              key={voice.id}
              variant={value === voice.id ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(voice.id)}
              className="justify-start text-xs h-8"
            >
              <span className="mr-1">
                {voice.gender === "male" ? "👨" : "👩"}
              </span>
              {voice.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Voice Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Voice Tips:</strong></p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Try different voices to find your perfect match</li>
          <li>Female voices often work better for storytelling</li>
          <li>Male voices are great for professional presentations</li>
          <li>Use the preview feature to test before generating</li>
        </ul>
      </div>
    </div>
  );
}