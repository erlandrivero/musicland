'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'succeeded' | 'failed';

interface GenerationStatusProps {
  generationId: string;
  status: GenerationStatus;
  onStatusChange?: (status: GenerationStatus) => void;
  onComplete?: (audioUrl: string, data: any) => void;
  onError?: (error: string) => void;
}

const STATUS_STAGES = [
  { status: 'pending', label: 'Submitting request...', icon: Loader2 },
  { status: 'processing', label: 'Processing with AI...', icon: Loader2 },
  { status: 'processing', label: 'Generating audio...', icon: Loader2 },
  { status: 'processing', label: 'Finalizing track...', icon: Loader2 },
  { status: 'completed', label: 'Complete!', icon: CheckCircle },
];

export function GenerationStatus({
  generationId,
  status: initialStatus,
  onStatusChange,
  onComplete,
  onError,
}: GenerationStatusProps) {
  const [status, setStatus] = useState<GenerationStatus>(initialStatus);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(60); // seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [hasCalledOnComplete, setHasCalledOnComplete] = useState(false);

  // Poll for status updates
  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/music/status/${generationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch generation status');
        }

        const data = await response.json();
        const newStatus = data.status as GenerationStatus;

        setStatus(newStatus);
        onStatusChange?.(newStatus);

        if (newStatus === 'completed' || newStatus === 'succeeded') {
          clearInterval(pollInterval);
          // Only call onComplete once
          if (!hasCalledOnComplete) {
            setHasCalledOnComplete(true);
            onComplete?.(data.audioUrl || data.audio_url, data);
          }
          setStatus('completed');
          onStatusChange?.('completed');
        } else if (newStatus === 'failed') {
          clearInterval(pollInterval);
          const errorMsg = data.error || 'Generation failed';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (err) {
        console.error('Status polling error:', err);
        setRetryCount((prev) => prev + 1);
        
        // Stop polling after 5 failed attempts
        if (retryCount >= 5) {
          clearInterval(pollInterval);
          const errorMsg = 'Failed to check generation status';
          setError(errorMsg);
          setStatus('failed');
          onStatusChange?.('failed');
          onError?.(errorMsg);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [generationId, status, retryCount, hasCalledOnComplete, onStatusChange, onComplete, onError]);

  // Update stage based on elapsed time
  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      // Progress through stages based on time
      if (elapsedTime < 10) {
        setCurrentStage(0); // Submitting
      } else if (elapsedTime < 25) {
        setCurrentStage(1); // Processing
      } else if (elapsedTime < 45) {
        setCurrentStage(2); // Generating
      } else {
        setCurrentStage(3); // Finalizing
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, elapsedTime]);

  // Calculate progress percentage
  const progressPercentage = status === 'completed' 
    ? 100 
    : Math.min((elapsedTime / estimatedTime) * 100, 95);

  if (status === 'completed') {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Generation Complete!</h3>
            <p className="text-sm text-green-700">Your music is ready to play</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <XCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900">Generation Failed</h3>
            <p className="text-sm text-red-700 mt-1">
              {error || 'An error occurred during generation'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStageInfo = STATUS_STAGES[currentStage];
  const StageIcon = currentStageInfo.icon;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-spin">
          <StageIcon size={24} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentStageInfo.label}
          </h3>
          <p className="text-sm text-gray-600">
            This usually takes 30-60 seconds
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">
            {Math.round(progressPercentage)}% complete
          </span>
          <span className="text-sm text-gray-600">
            {elapsedTime}s elapsed
          </span>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {STATUS_STAGES.slice(0, 4).map((stage, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-lg transition-all ${
              index <= currentStage
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <div className="text-xs font-medium truncate">
              {stage.label.replace('...', '')}
            </div>
          </div>
        ))}
      </div>

      {/* Retry Warning */}
      {retryCount > 0 && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Connection issue detected. Retrying... ({retryCount}/5)
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Keep this tab open while your music generates. 
          You&apos;ll be notified when it&apos;s ready!
        </p>
      </div>
    </div>
  );
}
