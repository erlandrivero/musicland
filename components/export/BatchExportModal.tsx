'use client';

import { useState } from 'react';
import { Download, X, Check, Loader2, FileAudio, FileText, Music, Sheet } from 'lucide-react';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: {
    id: string;
    title: string;
    audioUrl: string;
    lyrics?: string | null;
    midiUrl?: string | null;
  };
}

type ExportFormat = 'audio' | 'lyrics' | 'midi' | 'sheet';

interface ExportOption {
  id: ExportFormat;
  label: string;
  icon: typeof FileAudio;
  available: boolean;
  description: string;
}

export function BatchExportModal({ isOpen, onClose, track }: BatchExportModalProps) {
  const [selectedFormats, setSelectedFormats] = useState<Set<ExportFormat>>(new Set<ExportFormat>(['audio']));
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ [key in ExportFormat]?: 'pending' | 'downloading' | 'done' | 'error' }>({});

  const exportOptions: ExportOption[] = [
    {
      id: 'audio',
      label: 'Audio File',
      icon: FileAudio,
      available: !!track.audioUrl,
      description: 'MP3 format, high quality',
    },
    {
      id: 'lyrics',
      label: 'Lyrics',
      icon: FileText,
      available: !!track.lyrics,
      description: 'TXT format with sections',
    },
    {
      id: 'midi',
      label: 'MIDI File',
      icon: Music,
      available: !!track.midiUrl,
      description: 'Musical notation data',
    },
    {
      id: 'sheet',
      label: 'Sheet Music',
      icon: Sheet,
      available: !!track.midiUrl, // Sheet music requires MIDI
      description: 'PDF format (coming soon)',
    },
  ];

  const toggleFormat = (format: ExportFormat) => {
    const newSet = new Set(selectedFormats);
    if (newSet.has(format)) {
      newSet.delete(format);
    } else {
      newSet.add(format);
    }
    setSelectedFormats(newSet);
  };

  const downloadFile = async (url: string, filename: string): Promise<void> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const progress: { [key in ExportFormat]?: 'pending' | 'downloading' | 'done' | 'error' } = {};
    
    for (const format of Array.from(selectedFormats)) {
      progress[format] = 'downloading';
      setExportProgress({ ...progress });

      try {
        const sanitizedTitle = track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        switch (format) {
          case 'audio':
            await downloadFile(track.audioUrl, `${sanitizedTitle}.mp3`);
            break;
            
          case 'lyrics':
            if (track.lyrics) {
              const blob = new Blob([track.lyrics], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${sanitizedTitle}_lyrics.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }
            break;
            
          case 'midi':
            if (track.midiUrl) {
              await downloadFile(track.midiUrl, `${sanitizedTitle}.mid`);
            }
            break;
            
          case 'sheet':
            // Sheet music PDF export would go here (not implemented yet)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate
            break;
        }
        
        progress[format] = 'done';
        setExportProgress({ ...progress });
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error exporting ${format}:`, error);
        progress[format] = 'error';
        setExportProgress({ ...progress });
      }
    }
    
    setIsExporting(false);
    
    // Auto-close after 2 seconds if all successful
    if (Object.values(progress).every(status => status === 'done')) {
      setTimeout(() => onClose(), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Batch Export
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {track.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the formats you want to download:
          </p>

          {/* Format Options */}
          <div className="space-y-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedFormats.has(option.id);
              const progress = exportProgress[option.id];

              return (
                <button
                  key={option.id}
                  onClick={() => toggleFormat(option.id)}
                  disabled={!option.available || isExporting}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${
                    !option.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } disabled:cursor-not-allowed`}
                >
                  <div className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {option.label}
                      </span>
                      {!option.available && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          N/A
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Progress indicator */}
                  {progress === 'downloading' && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {progress === 'done' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedFormats.size} {selectedFormats.size === 1 ? 'format' : 'formats'} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedFormats.size === 0 || isExporting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
