/**
 * Extended Suno API Types for New Features
 */

export interface LyricsGenerationRequest {
  prompt: string;
  callBackUrl?: string;
}

export interface LyricsGenerationResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

export interface LyricsResult {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lyrics?: string;
  title?: string;
  createdAt?: string;
}

export interface ExtendMusicRequest {
  audioId: string;
  prompt?: string;
  style?: string;
  title?: string;
  continueAt: number; // timestamp in seconds
  model?: 'V3_5' | 'V4' | 'V4_5' | 'V5';
  negativeTags?: string;
  vocalGender?: 'm' | 'f';
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  callBackUrl?: string;
}

export interface ExtendMusicResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

export interface TimestampedLyricsRequest {
  taskId?: string;
  audioId?: string;
  musicIndex?: number;
}

export interface AlignedWord {
  word: string;
  success: boolean;
  startS: number;
  endS: number;
  palign: number;
}

export interface TimestampedLyricsResponse {
  code: number;
  msg: string;
  data: {
    alignedWords: AlignedWord[];
    waveformData: number[];
    hootCer: number;
    isStreamed: boolean;
  };
}

export interface MusicVideoRequest {
  taskId: string;
  audioId: string;
  author?: string;
  domainName?: string;
  callBackUrl?: string;
}

export interface MusicVideoResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

export interface WAVConversionRequest {
  taskId: string;
  audioId: string;
  callBackUrl?: string;
}

export interface WAVConversionResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

export interface TaskStatusResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    audioUrl?: string;
    videoUrl?: string;
    imageUrl?: string;
    lyrics?: string;
    title?: string;
    createdAt?: string;
    metadata?: Record<string, any>;
  };
}

// Credit cost constants
export const CREDIT_COSTS = {
  LYRICS_GENERATION: 2,
  FULL_SONG: 10,
  EXTEND_MUSIC: 6, // average of 5-7
  TIMESTAMPED_LYRICS: 2,
  MUSIC_VIDEO: 5,
  WAV_CONVERSION: 3,
  REPLACE_SECTION: 7, // average of 5-10
  SWAP_SOUND: 7,
  SWAP_VOCAL: 7,
} as const;

export type FeatureType = keyof typeof CREDIT_COSTS;
