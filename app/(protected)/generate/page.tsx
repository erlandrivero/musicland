'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CreditsBadge } from '@/components/credits';
import { UserMenu } from '@/components/auth/user-menu';
import { GenerationForm, GenerationStatus, TrackResult, type GenerationFormData } from '@/components/generation';
import { useCredits, useCreditHistory } from '@/hooks/use-credits';
import { InsufficientCreditsModal } from '@/components/credits';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface GeneratedTrack {
  id: string;
  audioUrl: string;
  title: string;
  tags?: string;
  duration?: number;
  createdAt: string;
}

export default function GeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { hasCredits, deductCredits, refreshCredits } = useCredits();
  const { addUsage } = useCreditHistory();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);

  const handleGenerate = async (formData: GenerationFormData) => {
    setError(null);
    
    // Check credits
    const GENERATION_COST = 10;
    if (!hasCredits(GENERATION_COST)) {
      setShowInsufficientCreditsModal(true);
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('pending');
    setGeneratedTrack(null);

    try {
      // Prepare request payload
      const payload = {
        custom_mode: formData.customMode,
        gpt_description_prompt: formData.customMode ? undefined : formData.description,
        prompt: formData.customMode ? formData.lyrics || formData.description : undefined,
        tags: formData.genre,
        title: formData.title,
        make_instrumental: formData.instrumental,
        mv: formData.modelVersion,
      };

      // Call generation API
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Generation failed');
      }

      const data = await response.json();
      
      // Assuming API returns array of tracks, take first one
      const track = Array.isArray(data) ? data[0] : data;
      
      setGenerationId(track.id);
      setGenerationStatus(track.status || 'processing');

      // Deduct credits optimistically
      deductCredits(GENERATION_COST);

      // Track usage
      addUsage(
        'generation',
        GENERATION_COST,
        `Generated: ${formData.title || formData.description.slice(0, 50)}`
      );

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate music. Please try again.');
      setIsGenerating(false);
      setGenerationStatus('failed');
      
      // Refresh credits to get accurate balance
      await refreshCredits();
    }
  };

  const handleStatusChange = (status: 'pending' | 'processing' | 'completed' | 'failed') => {
    setGenerationStatus(status);
    
    if (status === 'completed' || status === 'failed') {
      setIsGenerating(false);
    }
  };

  const handleGenerationComplete = async (audioUrl: string, data: any) => {
    setGeneratedTrack({
      id: data.id,
      audioUrl: audioUrl,
      title: data.title || 'Generated Track',
      tags: data.tags,
      duration: data.duration,
      createdAt: data.created_at || new Date().toISOString(),
    });

    // Refresh credits to get updated balance
    await refreshCredits();
  };

  const handleGenerationError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleRegenerate = () => {
    setGeneratedTrack(null);
    setGenerationId(null);
    setGenerationStatus('pending');
    setError(null);
  };

  const handleSaveTrack = async (trackId: string, projectName: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          trackId: trackId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save track');
      }

      alert('Track saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const response = await fetch(`/api/music/${trackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete track');
      }

      setGeneratedTrack(null);
      setGenerationId(null);
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={28} className="text-blue-600" />
                  Generate Music
                </h1>
                <p className="text-sm text-gray-600">Create amazing music with AI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditsBadge size="lg" showRefresh />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Generation Form */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create Your Music</h2>
              <GenerationForm
                onSubmit={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Tips Section */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Be specific about mood, tempo, and instruments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Mention the theme or story you want to convey</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Try different model versions for varied results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Use custom mode for full creative control</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            {error && !isGenerating && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Generation Failed</h3>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={handleRegenerate}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {isGenerating && generationId && (
              <GenerationStatus
                generationId={generationId}
                status={generationStatus}
                onStatusChange={handleStatusChange}
                onComplete={handleGenerationComplete}
                onError={handleGenerationError}
              />
            )}

            {generatedTrack && !isGenerating && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Generated Track</h2>
                <TrackResult
                  id={generatedTrack.id}
                  audioUrl={generatedTrack.audioUrl}
                  title={generatedTrack.title}
                  tags={generatedTrack.tags}
                  duration={generatedTrack.duration}
                  createdAt={generatedTrack.createdAt}
                  onRegenerate={handleRegenerate}
                  onSave={handleSaveTrack}
                  onDelete={handleDeleteTrack}
                />

                {/* Generate Another */}
                <button
                  onClick={handleRegenerate}
                  className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  Generate Another Track
                </button>
              </div>
            )}

            {!isGenerating && !generatedTrack && !error && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={40} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Create</h3>
                <p className="text-gray-600">
                  Fill out the form and click &quot;Generate Music&quot; to create your track
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={showInsufficientCreditsModal}
        onClose={() => setShowInsufficientCreditsModal(false)}
        requiredCredits={10}
      />
    </div>
  );
}
