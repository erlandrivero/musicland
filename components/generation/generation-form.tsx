'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';
import { useCredits } from '@/hooks/use-credits';
import { CreditCostPreview } from '@/components/credits';

// Style/Genre options
const GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Classical', 
  'Jazz', 'Country', 'R&B', 'Folk', 'Reggae', 'Blues', 
  'Metal', 'Indie', 'Soul', 'Funk', 'Disco'
];

// Model versions
const MODEL_VERSIONS = [
  { value: 'chirp-v4', label: 'Suno v4 (Balanced)' },
  { value: 'chirp-v4-5', label: 'Suno v4.5 (Enhanced)' },
  { value: 'chirp-v5', label: 'Suno v5 (Latest)' },
];

export interface GenerationFormData {
  description: string;
  genre: string;
  customMode: boolean;
  instrumental: boolean;
  vocalGender: 'male' | 'female' | 'auto';
  modelVersion: string;
  styleWeight: number;
  weirdness: number;
  title?: string;
  lyrics?: string;
}

interface GenerationFormProps {
  onSubmit: (data: GenerationFormData) => void;
  isGenerating: boolean;
}

export function GenerationForm({ onSubmit, isGenerating }: GenerationFormProps) {
  const { credits, hasCredits, isLoading: creditsLoading } = useCredits();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Form state
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [instrumental, setInstrumental] = useState(false);
  const [vocalGender, setVocalGender] = useState<'male' | 'female' | 'auto'>('auto');
  const [modelVersion, setModelVersion] = useState('chirp-v5');
  const [styleWeight, setStyleWeight] = useState(0.5);
  const [weirdness, setWeirdness] = useState(0.5);
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');

  const MAX_DESCRIPTION_LENGTH = 400;
  const MAX_LYRICS_LENGTH = 3000;
  const GENERATION_COST = 10;

  const canGenerate = 
    description.trim().length > 0 && 
    (!customMode || (title.trim().length > 0 && genre.trim().length > 0)) &&
    hasCredits(GENERATION_COST) &&
    !isGenerating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerate) return;

    const formData: GenerationFormData = {
      description: description.trim(),
      genre: genre.trim(),
      customMode,
      instrumental,
      vocalGender,
      modelVersion,
      styleWeight,
      weirdness,
      title: title.trim() || undefined,
      lyrics: lyrics.trim() || undefined,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Describe Your Music
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
          placeholder="Describe the music you want to create... (e.g., 'An upbeat pop song about summer adventures with catchy chorus')"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          disabled={isGenerating}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">
            Be specific about mood, tempo, instruments, and theme
          </p>
          <span className={`text-sm font-medium ${
            description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-500'
          }`}>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </div>

      {/* Genre Selector */}
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
          Style/Genre {customMode && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                genre === g
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Or type custom genre/style..."
          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        />
      </div>

      {/* Advanced Options */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left"
          disabled={isGenerating}
        >
          <span className="text-sm font-medium text-gray-700">Advanced Options</span>
          {showAdvanced ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* Custom Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Custom Mode</h4>
                <p className="text-xs text-gray-600">Full control over title, style, and lyrics</p>
              </div>
              <button
                type="button"
                onClick={() => setCustomMode(!customMode)}
                disabled={isGenerating}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  customMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    customMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Custom Mode Fields */}
            {customMode && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Track Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter track title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Lyrics (Optional)
                  </label>
                  <textarea
                    id="lyrics"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value.slice(0, MAX_LYRICS_LENGTH))}
                    placeholder="Enter your custom lyrics... (Leave empty for AI-generated lyrics)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                    disabled={isGenerating}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {lyrics.length}/{MAX_LYRICS_LENGTH}
                  </span>
                </div>
              </div>
            )}

            {/* Instrumental Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Instrumental Only</h4>
                <p className="text-xs text-gray-600">Generate music without vocals</p>
              </div>
              <button
                type="button"
                onClick={() => setInstrumental(!instrumental)}
                disabled={isGenerating}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  instrumental ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    instrumental ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Vocal Gender (only if not instrumental) */}
            {!instrumental && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vocal Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'auto'] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setVocalGender(gender)}
                      disabled={isGenerating}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        vocalGender === gender
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Model Version */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                AI Model Version
              </label>
              <select
                id="model"
                value={modelVersion}
                onChange={(e) => setModelVersion(e.target.value)}
                disabled={isGenerating}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {MODEL_VERSIONS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style Weight Slider */}
            <div>
              <label htmlFor="styleWeight" className="block text-sm font-medium text-gray-700 mb-2">
                Style Weight: {styleWeight.toFixed(2)}
              </label>
              <input
                type="range"
                id="styleWeight"
                min="0"
                max="1"
                step="0.1"
                value={styleWeight}
                onChange={(e) => setStyleWeight(parseFloat(e.target.value))}
                disabled={isGenerating}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Subtle</span>
                <span>Balanced</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Weirdness Slider */}
            <div>
              <label htmlFor="weirdness" className="block text-sm font-medium text-gray-700 mb-2">
                Creativity Level: {weirdness.toFixed(2)}
              </label>
              <input
                type="range"
                id="weirdness"
                min="0"
                max="1"
                step="0.1"
                value={weirdness}
                onChange={(e) => setWeirdness(parseFloat(e.target.value))}
                disabled={isGenerating}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Experimental</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Credit Cost Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <CreditCostPreview generationType="STANDARD_GENERATION" />
      </div>

      {/* Validation Messages */}
      {!hasCredits(GENERATION_COST) && !creditsLoading && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-900">Insufficient Credits</h4>
            <p className="text-sm text-amber-700 mt-1">
              You need {GENERATION_COST} credits to generate music. You currently have {credits} credits.
            </p>
          </div>
        </div>
      )}

      {customMode && (!title.trim() || !genre.trim()) && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Custom Mode Requirements</h4>
            <p className="text-sm text-blue-700 mt-1">
              Please provide both a track title and genre/style for custom mode.
            </p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!canGenerate}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
          canGenerate
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Sparkles size={24} />
        {isGenerating ? 'Generating...' : 'Generate Music'}
      </button>
    </form>
  );
}
