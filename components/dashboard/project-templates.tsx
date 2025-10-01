'use client';

import { useState } from 'react';
import { X, Mic, Video, Music, Headphones, Radio, Film } from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  defaultSettings: {
    genre?: string;
    duration?: number;
    instrumental?: boolean;
  };
}

interface ProjectTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ProjectTemplate) => void;
}

const templates: ProjectTemplate[] = [
  {
    id: 'podcast-intro',
    name: 'Podcast Intro',
    description: 'Short, catchy intro music for podcasts (15-30 seconds)',
    icon: Mic,
    color: 'blue',
    defaultSettings: {
      duration: 30,
      instrumental: true,
      genre: 'Electronic',
    },
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Upbeat background music for social media content',
    icon: Video,
    color: 'purple',
    defaultSettings: {
      duration: 60,
      instrumental: true,
      genre: 'Pop',
    },
  },
  {
    id: 'background-music',
    name: 'Background Music',
    description: 'Ambient music for videos, presentations, or work',
    icon: Music,
    color: 'green',
    defaultSettings: {
      duration: 180,
      instrumental: true,
      genre: 'Ambient',
    },
  },
  {
    id: 'meditation',
    name: 'Meditation & Relaxation',
    description: 'Calm, soothing music for meditation and relaxation',
    icon: Headphones,
    color: 'indigo',
    defaultSettings: {
      duration: 300,
      instrumental: true,
      genre: 'Ambient',
    },
  },
  {
    id: 'radio-jingle',
    name: 'Radio Jingle',
    description: 'Short, memorable jingle for radio or ads',
    icon: Radio,
    color: 'amber',
    defaultSettings: {
      duration: 15,
      instrumental: false,
      genre: 'Pop',
    },
  },
  {
    id: 'film-score',
    name: 'Film Score',
    description: 'Cinematic music for films and videos',
    icon: Film,
    color: 'red',
    defaultSettings: {
      duration: 120,
      instrumental: true,
      genre: 'Classical',
    },
  },
];

export function ProjectTemplatesModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: ProjectTemplatesModalProps) {
  if (!isOpen) return null;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    amber: 'bg-amber-100 text-amber-600 border-amber-200',
    red: 'bg-red-100 text-red-600 border-red-200',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
            <p className="text-sm text-gray-600 mt-1">
              Start with a pre-configured template or create from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {templates.map((template) => {
              const Icon = template.icon;
              const colorClass = colorClasses[template.color as keyof typeof colorClasses];

              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="text-left p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.defaultSettings.genre && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {template.defaultSettings.genre}
                      </span>
                    )}
                    {template.defaultSettings.duration && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {template.defaultSettings.duration}s
                      </span>
                    )}
                    {template.defaultSettings.instrumental && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        Instrumental
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Blank Project Option */}
          <button
            onClick={() => onSelectTemplate({
              id: 'blank',
              name: 'Blank Project',
              description: 'Start from scratch',
              icon: Music,
              color: 'blue',
              defaultSettings: {},
            })}
            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Music size={24} className="text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Start from Scratch</h3>
              <p className="text-sm text-gray-600">Create a blank project with no presets</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
