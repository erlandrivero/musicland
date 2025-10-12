/**
 * Lyrics Utilities
 * Helper functions for parsing, formatting, and processing song lyrics
 */

export interface LyricsLine {
  text: string;
  lineNumber: number;
}

export interface LyricsSection {
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'pre-chorus' | 'post-chorus' | 'hook' | 'instrumental' | 'unknown';
  label: string;
  lines: LyricsLine[];
  startLine: number;
  endLine: number;
}

export interface ParsedLyrics {
  sections: LyricsSection[];
  rawText: string;
  totalLines: number;
  hasSections: boolean;
}

/**
 * Parse lyrics text into structured sections
 */
export function parseLyrics(lyrics: string | null | undefined): ParsedLyrics {
  if (!lyrics || lyrics.trim() === '') {
    return {
      sections: [],
      rawText: '',
      totalLines: 0,
      hasSections: false,
    };
  }

  const lines = lyrics.split('\n');
  const sections: LyricsSection[] = [];
  let currentSection: LyricsSection | null = null;
  let lineNumber = 1;
  const sectionCount = { verse: 0, chorus: 0, bridge: 0, intro: 0, outro: 0, 'pre-chorus': 0, 'post-chorus': 0, hook: 0, instrumental: 0 };

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if line is a section marker (e.g., [Verse], [Chorus])
    const sectionMatch = trimmedLine.match(/^\[([^\]]+)\]$/i);
    
    if (sectionMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      
      // Determine section type
      const sectionText = sectionMatch[1].toLowerCase();
      let sectionType: LyricsSection['type'] = 'unknown';
      
      if (sectionText.includes('verse')) sectionType = 'verse';
      else if (sectionText.includes('chorus')) sectionType = 'chorus';
      else if (sectionText.includes('bridge')) sectionType = 'bridge';
      else if (sectionText.includes('intro')) sectionType = 'intro';
      else if (sectionText.includes('outro')) sectionType = 'outro';
      else if (sectionText.includes('pre-chorus') || sectionText.includes('prechorus')) sectionType = 'pre-chorus';
      else if (sectionText.includes('post-chorus') || sectionText.includes('postchorus')) sectionType = 'post-chorus';
      else if (sectionText.includes('hook')) sectionType = 'hook';
      else if (sectionText.includes('instrumental')) sectionType = 'instrumental';
      
      // Create new section
      currentSection = {
        type: sectionType,
        label: sectionMatch[1],
        lines: [],
        startLine: lineNumber,
        endLine: lineNumber,
      };
      
      if (sectionType !== 'unknown') {
        sectionCount[sectionType]++;
      }
    } else if (trimmedLine !== '') {
      // Add line to current section or create default section
      if (!currentSection) {
        currentSection = {
          type: 'unknown',
          label: 'Lyrics',
          lines: [],
          startLine: lineNumber,
          endLine: lineNumber,
        };
      }
      
      currentSection.lines.push({
        text: line,
        lineNumber,
      });
      currentSection.endLine = lineNumber;
    }
    
    lineNumber++;
  }
  
  // Add final section
  if (currentSection && currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return {
    sections,
    rawText: lyrics,
    totalLines: lineNumber - 1,
    hasSections: sections.some(s => s.type !== 'unknown'),
  };
}

/**
 * Search for text within lyrics
 */
export function searchLyrics(lyrics: ParsedLyrics, query: string): {
  sections: number[];
  lines: number[];
  matches: number;
} {
  if (!query.trim()) {
    return { sections: [], lines: [], matches: 0 };
  }

  const lowerQuery = query.toLowerCase();
  const matchingSections: number[] = [];
  const matchingLines: number[] = [];
  let totalMatches = 0;

  lyrics.sections.forEach((section, sectionIndex) => {
    let sectionHasMatch = false;
    
    section.lines.forEach((line) => {
      if (line.text.toLowerCase().includes(lowerQuery)) {
        sectionHasMatch = true;
        matchingLines.push(line.lineNumber);
        
        // Count how many times the query appears in this line
        const lineMatches = line.text.toLowerCase().split(lowerQuery).length - 1;
        totalMatches += lineMatches;
      }
    });
    
    if (sectionHasMatch) {
      matchingSections.push(sectionIndex);
    }
  });

  return {
    sections: matchingSections,
    lines: matchingLines,
    matches: totalMatches,
  };
}

/**
 * Highlight search query in text
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">$1</mark>');
}

/**
 * Escape regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Export lyrics to plain text format
 */
export function exportLyricsToText(lyrics: ParsedLyrics, title?: string): string {
  let output = '';
  
  if (title) {
    output += `${title}\n`;
    output += '='.repeat(title.length) + '\n\n';
  }
  
  lyrics.sections.forEach((section, index) => {
    if (section.type !== 'unknown') {
      output += `[${section.label}]\n`;
    }
    
    section.lines.forEach((line) => {
      output += `${line.text}\n`;
    });
    
    // Add spacing between sections
    if (index < lyrics.sections.length - 1) {
      output += '\n';
    }
  });
  
  return output;
}

/**
 * Get section color based on type
 */
export function getSectionColor(type: LyricsSection['type']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (type) {
    case 'verse':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
      };
    case 'chorus':
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800',
      };
    case 'bridge':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
      };
    case 'intro':
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
      };
    case 'outro':
      return {
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
      };
    case 'pre-chorus':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800',
      };
    case 'hook':
      return {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        text: 'text-pink-700 dark:text-pink-300',
        border: 'border-pink-200 dark:border-pink-800',
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-700',
      };
  }
}

/**
 * Format timestamp for display (MM:SS)
 */
export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Download text as file
 */
export function downloadTextFile(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
