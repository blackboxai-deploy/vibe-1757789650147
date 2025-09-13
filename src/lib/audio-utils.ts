/**
 * Audio utilities for voice generation and processing
 */

export interface AudioMetadata {
  duration: number;
  size: number;
  format: string;
  sampleRate?: number;
  bitRate?: number;
}

/**
 * Get audio metadata from a blob
 */
export const getAudioMetadata = (audioBlob: Blob): Promise<AudioMetadata> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(audioBlob);
    
    audio.addEventListener('loadedmetadata', () => {
      const metadata: AudioMetadata = {
        duration: audio.duration,
        size: audioBlob.size,
        format: audioBlob.type || 'audio/mpeg',
      };
      
      URL.revokeObjectURL(url);
      resolve(metadata);
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio metadata'));
    });
    
    audio.src = url;
  });
};

/**
 * Convert audio blob to different formats (browser-supported formats only)
 */
export const convertAudioFormat = async (
  audioBlob: Blob, 
  targetFormat: 'audio/wav' | 'audio/webm' | 'audio/mp4'
): Promise<Blob> => {
  // This is a simplified version - in a real app you'd use Web Audio API
  // or a library like ffmpeg.wasm for proper format conversion
  
  if (!MediaRecorder.isTypeSupported(targetFormat)) {
    throw new Error(`Format ${targetFormat} is not supported`);
  }
  
  // For now, return the original blob
  // In a production app, implement actual format conversion
  return audioBlob;
};

/**
 * Download audio file with proper filename
 */
export const downloadAudio = (audioBlob: Blob, filename: string = 'voice'): void => {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  
  // Ensure proper file extension
  let finalFilename = filename;
  if (!finalFilename.includes('.')) {
    finalFilename += '.mp3';
  }
  
  link.href = url;
  link.download = finalFilename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL after a delay to ensure download starts
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

/**
 * Validate audio blob
 */
export const validateAudioBlob = (blob: Blob): boolean => {
  if (!blob || blob.size === 0) {
    return false;
  }
  
  // Check if it's likely an audio file
  const audioTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4',
    'audio/aac'
  ];
  
  return audioTypes.some(type => blob.type.includes(type)) || blob.type === '';
};

/**
 * Format duration in seconds to human-readable format
 */
export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Estimate text reading time (words per minute)
 */
export const estimateReadingTime = (text: string, wpm: number = 150): number => {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return Math.ceil((words.length / wpm) * 60); // Convert to seconds
};

/**
 * Clean text for better TTS output
 */
export const cleanTextForTTS = (text: string): string => {
  return text
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Remove excessive punctuation
    .replace(/([.!?]){2,}/g, '$1')
    // Ensure proper spacing around punctuation
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    // Remove HTML tags if any
    .replace(/<[^>]*>/g, '')
    // Trim whitespace
    .trim();
};

/**
 * Calculate estimated cost based on text length (for display purposes)
 */
export const estimateGenerationCost = (text: string, pricePerChar: number = 0.0001): number => {
  const cleanText = cleanTextForTTS(text);
  return cleanText.length * pricePerChar;
};

/**
 * Generate audio analysis (simplified version)
 */
export const analyzeAudio = async (audioBlob: Blob): Promise<{
  duration: number;
  size: string;
  quality: 'low' | 'medium' | 'high';
}> => {
  const metadata = await getAudioMetadata(audioBlob);
  
  // Estimate quality based on file size vs duration ratio
  const bitsPerSecond = (metadata.size * 8) / metadata.duration;
  let quality: 'low' | 'medium' | 'high' = 'medium';
  
  if (bitsPerSecond < 64000) quality = 'low';
  else if (bitsPerSecond > 192000) quality = 'high';
  
  return {
    duration: metadata.duration,
    size: (metadata.size / 1024).toFixed(1) + ' KB',
    quality
  };
};

/**
 * Create audio visualization data (simplified)
 */
export const createVisualizationData = (): number[] => {
  // This is a simplified version - in a real app you'd use Web Audio API
  // to create proper waveform visualization data with actual audio buffer
  
  const dataPoints = 100;
  const data: number[] = [];
  
  // Generate sample visualization data
  for (let i = 0; i < dataPoints; i++) {
    const value = Math.sin(i * 0.1) * Math.random() * 0.5 + 0.5;
    data.push(Math.max(0.1, value));
  }
  
  return data;
};

interface VoiceSettings {
  voice?: string;
  speed?: number;
  pitch?: number;
  stability?: number;
  clarity?: number;
}

/**
 * Voice generation request builder
 */
export const buildVoiceRequest = (text: string, settings: VoiceSettings) => {
  const cleanText = cleanTextForTTS(text);
  
  return {
    text: cleanText,
    voice: settings.voice || 'rachel',
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: Math.max(0, Math.min(1, settings.stability || 0.75)),
      similarity_boost: Math.max(0, Math.min(1, settings.clarity || 0.75)),
      style: 0.0,
      use_speaker_boost: true,
    },
    pronunciation_dictionary_locators: [],
    seed: null,
    previous_text: null,
    next_text: null,
    previous_request_ids: [],
    next_request_ids: []
  };
};