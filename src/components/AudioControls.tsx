"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VoiceSettings {
  voice: string;
  speed: number;
  pitch: number;
  stability: number;
  clarity: number;
}

interface AudioControlsProps {
  settings: VoiceSettings;
  onChange: (settings: VoiceSettings) => void;
}

export default function AudioControls({ settings, onChange }: AudioControlsProps) {
  const updateSetting = (key: keyof VoiceSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const resetToDefaults = () => {
    onChange({
      voice: settings.voice, // Keep current voice
      speed: 1.0,
      pitch: 1.0,
      stability: 0.75,
      clarity: 0.75,
    });
  };

  const presets = [
    {
      name: "Natural",
      settings: { speed: 1.0, pitch: 1.0, stability: 0.75, clarity: 0.75 },
      description: "Balanced, natural speech"
    },
    {
      name: "Expressive",
      settings: { speed: 0.95, pitch: 1.05, stability: 0.6, clarity: 0.8 },
      description: "More emotional and varied"
    },
    {
      name: "Professional",
      settings: { speed: 0.9, pitch: 0.95, stability: 0.9, clarity: 0.9 },
      description: "Clear, consistent, formal"
    },
    {
      name: "Storytelling",
      settings: { speed: 0.85, pitch: 1.1, stability: 0.65, clarity: 0.75 },
      description: "Engaging narrative style"
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    onChange({
      ...settings,
      ...preset.settings,
    });
  };

  return (
    <div className="space-y-6">
      {/* Voice Parameter Controls */}
      <div className="space-y-4">
        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed" className="text-sm font-medium">
              Speed
            </Label>
            <Badge variant="outline" className="text-xs">
              {settings.speed.toFixed(2)}x
            </Badge>
          </div>
          <Slider
            id="speed"
            value={[settings.speed]}
            onValueChange={(value) => updateSetting('speed', value[0])}
            min={0.5}
            max={2.0}
            step={0.05}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow (0.5x)</span>
            <span>Fast (2.0x)</span>
          </div>
        </div>

        {/* Pitch Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pitch" className="text-sm font-medium">
              Pitch
            </Label>
            <Badge variant="outline" className="text-xs">
              {settings.pitch.toFixed(2)}
            </Badge>
          </div>
          <Slider
            id="pitch"
            value={[settings.pitch]}
            onValueChange={(value) => updateSetting('pitch', value[0])}
            min={0.5}
            max={1.5}
            step={0.05}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low (0.5)</span>
            <span>High (1.5)</span>
          </div>
        </div>

        {/* Stability Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="stability" className="text-sm font-medium">
              Stability
            </Label>
            <Badge variant="outline" className="text-xs">
              {Math.round(settings.stability * 100)}%
            </Badge>
          </div>
          <Slider
            id="stability"
            value={[settings.stability]}
            onValueChange={(value) => updateSetting('stability', value[0])}
            min={0.0}
            max={1.0}
            step={0.05}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Variable</span>
            <span>Consistent</span>
          </div>
        </div>

        {/* Clarity Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="clarity" className="text-sm font-medium">
              Clarity & Similarity
            </Label>
            <Badge variant="outline" className="text-xs">
              {Math.round(settings.clarity * 100)}%
            </Badge>
          </div>
          <Slider
            id="clarity"
            value={[settings.clarity]}
            onValueChange={(value) => updateSetting('clarity', value[0])}
            min={0.0}
            max={1.0}
            step={0.05}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Creative</span>
            <span>Precise</span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Voice Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="h-auto flex-col items-start p-3 text-left"
            >
              <div className="font-medium text-xs">{preset.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {preset.description}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs"
        >
          🔄 Reset to Defaults
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Adjust for perfect voice
        </div>
      </div>

      {/* Parameter Explanations */}
      <Card className="p-3">
        <div className="space-y-2 text-xs text-muted-foreground">
          <h4 className="font-medium text-foreground">Parameter Guide:</h4>
          <div className="space-y-1">
            <div><strong>Speed:</strong> How fast the voice speaks</div>
            <div><strong>Pitch:</strong> Voice tone (higher/lower)</div>
            <div><strong>Stability:</strong> Consistency vs variation in delivery</div>
            <div><strong>Clarity:</strong> Balance between creativity and voice accuracy</div>
          </div>
        </div>
      </Card>

      {/* Real-time Preview Tip */}
      <div className="text-xs text-muted-foreground text-center">
        💡 Tip: Use voice preview to test settings before generating long texts
      </div>
    </div>
  );
}