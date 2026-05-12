'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface PromptCardProps {
  title: string;
  prompt: string;
  characters: number;
  onUsePrompt: (prompt: string) => void;
}

export function PromptCard({ title, prompt, characters, onUsePrompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color code the character count
  const getCharColor = () => {
    if (characters > 380) return 'text-orange-500';
    if (characters > 300) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getCharBgColor = () => {
    if (characters > 380) return 'bg-orange-50';
    if (characters > 300) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          {title}
        </h4>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCharBgColor()} ${getCharColor()}`}>
          {characters}/400
        </span>
      </div>
      
      <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg font-mono leading-relaxed min-h-[100px]">
        {prompt}
      </p>
      
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
        <button
          onClick={() => onUsePrompt(prompt)}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Use Prompt
        </button>
      </div>
    </div>
  );
}
