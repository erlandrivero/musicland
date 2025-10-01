'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Command } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  modifier?: 'ctrl' | 'alt' | 'shift';
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts: Shortcut[] = [
    {
      key: '/',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      },
    },
    {
      key: 'g',
      description: 'Go to Generate',
      action: () => router.push('/generate'),
    },
    {
      key: 'd',
      description: 'Go to Dashboard',
      action: () => router.push('/dashboard'),
    },
    {
      key: 't',
      description: 'Go to Tracks',
      action: () => router.push('/tracks'),
    },
    {
      key: 'p',
      description: 'Go to Projects',
      action: () => router.push('/projects'),
    },
    {
      key: 'a',
      description: 'Go to Analytics',
      action: () => router.push('/analytics'),
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(true),
    },
    {
      key: 'Escape',
      description: 'Close modals',
      action: () => setShowHelp(false),
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        // Allow Escape to blur inputs
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      const shortcut = shortcuts.find((s) => {
        if (s.modifier) {
          const modifierPressed =
            (s.modifier === 'ctrl' && (e.ctrlKey || e.metaKey)) ||
            (s.modifier === 'alt' && e.altKey) ||
            (s.modifier === 'shift' && e.shiftKey);
          return modifierPressed && e.key.toLowerCase() === s.key.toLowerCase();
        }
        return e.key === s.key;
      });

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Command size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-600">Power user features</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Navigation
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => ['g', 'd', 't', 'p', 'a'].includes(s.key))
                  .map((shortcut) => (
                    <ShortcutRow key={shortcut.key} shortcut={shortcut} />
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Actions
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => ['/', '?', 'Escape'].includes(s.key))
                  .map((shortcut) => (
                    <ShortcutRow key={shortcut.key} shortcut={shortcut} />
                  ))}
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">?</kbd> anytime to see this help menu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-700">{shortcut.description}</span>
      <div className="flex items-center gap-1">
        {shortcut.modifier && (
          <>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              {shortcut.modifier === 'ctrl' ? '⌘' : shortcut.modifier}
            </kbd>
            <span className="text-gray-400">+</span>
          </>
        )}
        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono min-w-[2rem] text-center">
          {shortcut.key === 'Escape' ? 'Esc' : shortcut.key}
        </kbd>
      </div>
    </div>
  );
}

// Hook to use keyboard shortcuts in components
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifier?: 'ctrl' | 'alt' | 'shift'
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const modifierPressed =
        !modifier ||
        (modifier === 'ctrl' && (e.ctrlKey || e.metaKey)) ||
        (modifier === 'alt' && e.altKey) ||
        (modifier === 'shift' && e.shiftKey);

      if (modifierPressed && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifier]);
}
