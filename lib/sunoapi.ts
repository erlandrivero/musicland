import axios, { AxiosInstance, AxiosError } from 'axios';

// TypeScript Interfaces for SunoAPI
export interface GenerationRequest {
  custom_mode: boolean;
  gpt_description_prompt?: string;
  prompt?: string;
  tags?: string;
  title?: string;
  make_instrumental?: boolean;
  mv: string; // Model version: chirp-v3-5, chirp-v4, chirp-v5, etc.
  style_weight?: number; // 0.0-1.0: How closely to follow the style
  weirdness_constraint?: number; // 0.0-1.0: Creativity level
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'running' | 'processing' | 'succeeded' | 'completed' | 'failed';
  audio_url?: string;
  video_url?: string;
  title?: string;
  tags?: string;
  lyrics?: string;
  duration?: number;
  created_at?: string;
  error?: string;
}

export interface CreditsResponse {
  credits: number;
  extra_credits?: number;
}

export interface APIValidationResponse {
  valid: boolean;
  message: string;
  credits?: number;
}

export interface SunoAPIError {
  error: string;
  message: string;
  statusCode: number;
}

// SunoAPI Client Class
class SunoAPIClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.SUNOAPI_BASE_URL || 'https://api.sunoapi.com/api/v1';
    this.apiKey = process.env.SUNOAPI_KEY || '';

    if (!this.apiKey) {
      console.error('SUNOAPI_KEY is not configured in environment variables');
    }

    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[SunoAPI] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[SunoAPI] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[SunoAPI] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  // Error handler with retry logic
  private async handleError(error: AxiosError): Promise<never> {
    const config = error.config;
    
    if (!config) {
      throw this.formatError(error);
    }

    // Retry logic for transient failures (5xx errors)
    const retryCount = (config as any).retryCount || 0;
    const maxRetries = 3;

    if (error.response?.status && error.response.status >= 500 && retryCount < maxRetries) {
      (config as any).retryCount = retryCount + 1;
      console.log(`[SunoAPI] Retrying request (${retryCount + 1}/${maxRetries})...`);
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      
      return this.client.request(config);
    }

    throw this.formatError(error);
  }

  // Format error for consistent error handling
  private formatError(error: AxiosError): SunoAPIError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      return {
        error: 'API_ERROR',
        message: data?.message || data?.error || 'An error occurred with the SunoAPI service',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        error: 'NETWORK_ERROR',
        message: 'Unable to reach SunoAPI service. Please check your connection.',
        statusCode: 0,
      };
    } else {
      // Error in request setup
      return {
        error: 'REQUEST_ERROR',
        message: error.message || 'Failed to create API request',
        statusCode: 0,
      };
    }
  }

  // Validate API key
  async validateAPIKey(): Promise<APIValidationResponse> {
    try {
      if (!this.apiKey) {
        return {
          valid: false,
          message: 'API key is not configured',
        };
      }

      // Test API key by fetching credits
      const credits = await this.getCredits();
      
      return {
        valid: true,
        message: 'API key is valid',
        credits: credits.credits,
      };
    } catch (error) {
      const sunoError = error as SunoAPIError;
      return {
        valid: false,
        message: sunoError.message || 'Invalid API key',
      };
    }
  }

  // Get current credit balance
  async getCredits(): Promise<CreditsResponse> {
    try {
      const response = await this.client.get<CreditsResponse>('/get-credits');
      return response.data;
    } catch (error) {
      console.error('[SunoAPI] Failed to fetch credits:', error);
      throw error;
    }
  }

  // Generate music with Suno
  async generateMusic(request: GenerationRequest): Promise<GenerationResponse[]> {
    try {
      // Validate required fields
      if (!request.mv) {
        throw {
          error: 'VALIDATION_ERROR',
          message: 'Model version (mv) is required',
          statusCode: 400,
        } as SunoAPIError;
      }

      if (request.custom_mode) {
        if (!request.prompt || !request.tags) {
          throw {
            error: 'VALIDATION_ERROR',
            message: 'Custom mode requires prompt and tags',
            statusCode: 400,
          } as SunoAPIError;
        }
      } else {
        if (!request.gpt_description_prompt) {
          throw {
            error: 'VALIDATION_ERROR',
            message: 'Non-custom mode requires gpt_description_prompt',
            statusCode: 400,
          } as SunoAPIError;
        }
      }

      const response = await this.client.post<GenerationResponse[]>('/suno/create', request);
      console.log('[SunoAPI] Generate music response:', JSON.stringify(response.data, null, 2));
      
      // Handle different response formats from SunoAPI
      if (response.data && typeof response.data === 'object') {
        // If response has a 'data' property, use that
        if ('data' in response.data && Array.isArray((response.data as any).data)) {
          return (response.data as any).data;
        }
        // If response is already an array, return it
        if (Array.isArray(response.data)) {
          return response.data;
        }
        // If response is a single object, wrap it in an array
        return [response.data as GenerationResponse];
      }
      
      return response.data;
    } catch (error) {
      console.error('[SunoAPI] Failed to generate music:', error);
      throw error;
    }
  }

  // Check generation status
  async getGenerationStatus(id: string): Promise<GenerationResponse> {
    try {
      const response = await this.client.get<{code: number, data: any[], message: string}>(`/suno/task/${id}`);
      
      console.log('[SunoAPI] Status response:', JSON.stringify(response.data, null, 2));
      
      // HTTP 202 means still processing - return pending status
      if (response.status === 202) {
        return {
          id: id,
          status: 'processing',
          title: 'Generating...',
        };
      }
      
      // SunoAPI returns { code, data: [...], message }
      if (response.data.code === 200 && response.data.data && response.data.data.length > 0) {
        const clip = response.data.data[0];
        return {
          id: clip.clip_id,
          title: clip.title,
          status: clip.state, // pending, running, succeeded
          audio_url: clip.audio_url,
          video_url: clip.video_url,
          duration: clip.duration,
          created_at: clip.created_at,
          lyrics: clip.lyrics,
          tags: clip.tags,
        };
      }
      
      // If no data but successful response, still processing
      return {
        id: id,
        status: 'processing',
        title: 'Generating...',
      };
    } catch (error) {
      console.error('[SunoAPI] Failed to fetch generation status:', error);
      throw error;
    }
  }
  // Get multiple generation statuses
  async getGenerationStatuses(ids: string[]): Promise<GenerationResponse[]> {
    try {
      const response = await this.client.get<GenerationResponse[]>('/suno/status', {
        params: { ids: ids.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('[SunoAPI] Failed to fetch generation statuses:', error);
      throw error;
    }
  }

  // Generate lyrics (costs 2 credits)
  async generateLyrics(prompt: string): Promise<{ text: string; title: string }> {
    try {
      const response = await this.client.post<{ text: string; title: string }>('/suno/lyrics', {
        prompt,
      });
      return response.data;
    } catch (error) {
      console.error('[SunoAPI] Failed to generate lyrics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const sunoAPI = new SunoAPIClient();

// Helper function to check if error is SunoAPIError
export function isSunoAPIError(error: any): error is SunoAPIError {
  return error && typeof error === 'object' && 'error' in error && 'message' in error && 'statusCode' in error;
}
