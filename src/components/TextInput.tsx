"use client";

import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const insertText = useCallback((textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + textToInsert + value.substring(end);
    
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  }, [value, onChange]);

  const formatText = useCallback((format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText) {
      let formattedText = "";
      switch (format) {
        case "emphasis":
          formattedText = `*${selectedText}*`;
          break;
        case "pause":
          formattedText = `${selectedText}...`;
          break;
        case "slow":
          formattedText = `[slow]${selectedText}[/slow]`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newValue = value.substring(0, start) + formattedText + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  }, [value, onChange]);

  const clearText = useCallback(() => {
    onChange("");
    textareaRef.current?.focus();
  }, [onChange]);

  const pasteExample = useCallback(() => {
    const examples = [
      "Welcome to our innovative text-to-speech platform! Experience the power of AI-generated human voices that bring your words to life with remarkable clarity and natural expression.",
      "The future of communication lies in the seamless integration of artificial intelligence and human creativity. Our advanced voice synthesis technology transforms written text into authentic, engaging speech patterns.",
      "Imagine a world where every word you write can be heard with perfect pronunciation, natural rhythm, and emotional depth. That world is now at your fingertips with our cutting-edge voice generation system."
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    onChange(randomExample);
    textareaRef.current?.focus();
  }, [onChange]);

  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => formatText("emphasis")}
            className="text-xs"
          >
            *Emphasis*
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertText("... ")}
            className="text-xs"
          >
            Add Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => formatText("slow")}
            className="text-xs"
          >
            [Slow]
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={pasteExample}
            className="text-xs"
          >
            📝 Example
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearText}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`resize-none transition-all duration-300 ${
            isExpanded ? "min-h-[300px]" : "min-h-[150px]"
          }`}
        />
        
        {/* Character/Word Count Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {wordCount} words
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {charCount} chars
          </Badge>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Use *text* for emphasis and natural speech patterns</li>
          <li>Add commas and periods for natural pauses</li>
          <li>Select text and use formatting buttons for advanced control</li>
          <li>Longer texts may take more time to generate</li>
        </ul>
      </div>
    </div>
  );
}