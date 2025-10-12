# Windsurf Prompts: Add Lyrics & Music Sheets to Suno Music App

**Author**: Manus AI
**Date**: October 12, 2025

## Introduction

These prompts will enhance your existing Suno music app by adding comprehensive lyrics display and music sheet generation capabilities. Each prompt builds upon your current application and includes detailed testing requirements.

## Phase 1: Enhanced Music Response & Lyrics Display

### Prompt 1A: Update SunoAPI Response Interface and Data Handling

```
Enhance the existing Suno music app to properly handle and display the complete SunoAPI response data including lyrics. Update the TypeScript interfaces and API integration:

1. **Update TypeScript Interfaces**:
   - Modify the existing SunoSongResponse interface to include all available fields from SunoAPI
   - Add fields: lyrics, image_url, video_url, tags, duration, created_at, mv
   - Ensure proper typing for all response fields

2. **Enhance API Integration**:
   - Update the existing SunoAPI integration to capture and store all response fields
   - Modify the music generation API calls to save complete song metadata
   - Update MongoDB schema to store lyrics and additional metadata

3. **Database Schema Updates**:
   - Add new fields to the existing song/track collection in MongoDB
   - Create indexes for lyrics search functionality
   - Ensure backward compatibility with existing data

4. **API Response Enhancement**:
   - Update existing API endpoints to return complete song data including lyrics
   - Modify the song retrieval endpoints to include all metadata
   - Ensure proper error handling for missing lyrics data

TESTING REQUIREMENTS:
- Verify all SunoAPI response fields are properly captured and stored
- Test database schema updates work with existing data
- Confirm API endpoints return complete song information including lyrics
- Validate TypeScript interfaces match actual API responses
- Test error handling when lyrics are missing or malformed
```

### Prompt 1B: Create Professional Lyrics Viewer Component

```
Create a comprehensive lyrics display component for the existing music app with advanced formatting and user interaction features:

1. **Lyrics Viewer Component**:
   - Create a new LyricsViewer React component with TypeScript
   - Implement structured lyrics parsing for [Verse], [Chorus], [Bridge] sections
   - Add syntax highlighting for different song sections
   - Include line-by-line display with proper spacing and typography

2. **Advanced Lyrics Features**:
   - Implement lyrics search functionality within songs
   - Add copy-to-clipboard functionality for lyrics
   - Create print-friendly lyrics formatting
   - Add font size adjustment controls
   - Implement dark/light theme support for lyrics display

3. **Integration with Existing UI**:
   - Add lyrics tab to the existing music player interface
   - Ensure responsive design works with current layout
   - Integrate with existing theme system and design components
   - Add lyrics preview in song cards/lists

4. **User Interaction Features**:
   - Implement lyrics scrolling sync with audio playback (basic version)
   - Add lyrics sharing functionality
   - Create lyrics export options (TXT format)
   - Add lyrics favoriting/bookmarking

5. **Performance Optimization**:
   - Implement lazy loading for lyrics content
   - Add caching for processed lyrics formatting
   - Optimize rendering for long lyrics content

TESTING REQUIREMENTS:
- Test lyrics parsing correctly identifies and formats song sections
- Verify copy-to-clipboard functionality works across browsers
- Test responsive design on mobile, tablet, and desktop
- Confirm integration with existing music player interface
- Validate search functionality finds lyrics content accurately
- Test theme switching affects lyrics display properly
- Verify export functionality generates proper text files
```

## Phase 2: Music Sheet Generation Infrastructure

### Prompt 2A: Basic Pitch Integration for Audio-to-MIDI Conversion

```
Integrate Spotify's Basic Pitch library into the existing Node.js backend to convert SunoAPI audio files to MIDI format:

1. **Backend Dependencies Setup**:
   - Install and configure Basic Pitch Python library in the Node.js environment
   - Set up Python-Node.js bridge using child_process or python-shell
   - Configure TensorFlow dependencies for Basic Pitch model
   - Set up file system handling for audio and MIDI files

2. **Audio Processing Service**:
   - Create a new AudioProcessingService class in the backend
   - Implement downloadAudio() method to fetch audio from SunoAPI URLs
   - Create convertAudioToMidi() method using Basic Pitch
   - Add file management for temporary audio and generated MIDI files
   - Implement error handling for audio processing failures

3. **MIDI Generation API Endpoints**:
   - Create POST /api/songs/:id/generate-midi endpoint
   - Add GET /api/songs/:id/midi endpoint to retrieve MIDI files
   - Implement background job processing for MIDI generation
   - Add progress tracking for long-running audio processing tasks

4. **Database Integration**:
   - Update MongoDB schema to store MIDI file references
   - Add processing status tracking (pending, processing, completed, failed)
   - Store MIDI metadata (duration, note count, key signature)
   - Implement cleanup for temporary files

5. **Security and Performance**:
   - Add file size limits for audio processing
   - Implement rate limiting for MIDI generation requests
   - Add virus scanning for uploaded/processed files
   - Configure proper file permissions and storage

TESTING REQUIREMENTS:
- Test Basic Pitch installation and model loading
- Verify audio download from SunoAPI URLs works correctly
- Test MIDI generation with various audio formats and lengths
- Confirm API endpoints handle requests and responses properly
- Test error handling for corrupted or unsupported audio files
- Verify file cleanup prevents storage bloat
- Test rate limiting prevents system overload
- Validate MIDI files are properly formatted and playable
```

### Prompt 2B: VexFlow Sheet Music Rendering System

```
Implement VexFlow-based sheet music rendering to convert MIDI data into professional music notation:

1. **VexFlow Integration Setup**:
   - Install VexFlow TypeScript library in the frontend
   - Set up canvas and SVG rendering capabilities
   - Configure VexFlow with proper fonts and styling
   - Create responsive sheet music display components

2. **MIDI to VexFlow Conversion**:
   - Create MidiParser utility to read MIDI file data
   - Implement convertMidiToVexFlow() function for notation conversion
   - Add support for multiple clefs (treble, bass, alto)
   - Handle time signatures, key signatures, and tempo markings
   - Implement note duration and pitch conversion

3. **Sheet Music Renderer Component**:
   - Create SheetMusicViewer React component with TypeScript
   - Implement multi-staff rendering for complex pieces
   - Add zoom and pan functionality for large scores
   - Create print-friendly sheet music layouts
   - Add measure numbering and page breaks

4. **Advanced Notation Features**:
   - Implement chord symbol display above staff
   - Add lyrics positioning below notes (when available)
   - Support for basic articulations and dynamics
   - Handle grace notes and ornaments from MIDI data
   - Add support for guitar tablature (optional)

5. **User Interaction Features**:
   - Implement sheet music playback highlighting
   - Add transposition controls (change key)
   - Create sheet music export options (PDF, SVG, PNG)
   - Add annotation and markup tools
   - Implement sheet music sharing functionality

6. **Performance Optimization**:
   - Implement virtual scrolling for long pieces
   - Add progressive rendering for complex scores
   - Cache rendered notation for faster loading
   - Optimize SVG output for smaller file sizes

TESTING REQUIREMENTS:
- Test VexFlow renders basic notation correctly
- Verify MIDI parsing extracts notes, timing, and key information
- Test sheet music displays properly on different screen sizes
- Confirm export functionality generates proper PDF/SVG files
- Test transposition changes key signatures and notes correctly
- Verify playback highlighting syncs with audio
- Test performance with complex multi-staff pieces
- Validate print layouts are properly formatted
```

## Phase 3: Complete Music Viewer Integration

### Prompt 3A: Enhanced Music Player with Multi-Format Support

```
Enhance the existing music player to support the new lyrics and sheet music features with a professional tabbed interface:

1. **Enhanced Music Player Interface**:
   - Modify existing music player to include tabbed navigation
   - Add tabs: Audio, Lyrics, Sheet Music, MIDI, Details
   - Ensure seamless switching between different content types
   - Maintain audio playback state across tab changes

2. **Unified Music Viewer Component**:
   - Create EnhancedMusicViewer component that wraps existing player
   - Integrate LyricsViewer and SheetMusicViewer components
   - Add MIDI player component for MIDI file playback
   - Create detailed metadata display component

3. **Synchronized Playback Features**:
   - Implement basic audio-lyrics synchronization
   - Add sheet music playback highlighting (measure-by-measure)
   - Create unified playback controls affecting all views
   - Add tempo adjustment that affects all synchronized content

4. **Download and Export Features**:
   - Add comprehensive download menu for all formats
   - Implement batch export (audio + lyrics + sheet music + MIDI)
   - Create shareable links for complete music packages
   - Add social media sharing with preview cards

5. **Mobile Optimization**:
   - Ensure tabbed interface works well on mobile devices
   - Implement swipe gestures for tab navigation
   - Optimize sheet music display for mobile screens
   - Add mobile-specific controls and layouts

6. **Accessibility Features**:
   - Add screen reader support for all new components
   - Implement keyboard navigation for sheet music
   - Add high contrast mode for lyrics and notation
   - Include audio descriptions for visual elements

TESTING REQUIREMENTS:
- Test tabbed interface switches smoothly between content types
- Verify audio playback continues when switching tabs
- Test synchronized playback features work correctly
- Confirm download functionality provides all available formats
- Test mobile interface and swipe gestures
- Verify accessibility features work with screen readers
- Test performance with large sheet music files
- Validate sharing functionality generates proper previews
```

### Prompt 3B: Background Processing and User Experience

```
Implement background processing for MIDI generation and sheet music rendering with proper user feedback and queue management:

1. **Background Job System**:
   - Implement job queue system for audio processing tasks
   - Create progress tracking for MIDI generation and sheet music rendering
   - Add retry logic for failed processing attempts
   - Implement job prioritization based on user subscription level

2. **Real-time Progress Updates**:
   - Add WebSocket integration for real-time processing updates
   - Create progress indicators for each processing stage
   - Implement estimated time remaining calculations
   - Add cancellation functionality for long-running jobs

3. **User Experience Enhancements**:
   - Create processing status indicators in the UI
   - Add notification system for completed processing
   - Implement automatic refresh when processing completes
   - Create fallback UI for when features are not yet available

4. **Caching and Performance**:
   - Implement intelligent caching for generated MIDI and sheet music
   - Add cache invalidation strategies
   - Create background pre-processing for popular songs
   - Implement CDN integration for faster file delivery

5. **Error Handling and Recovery**:
   - Create comprehensive error handling for all processing stages
   - Implement graceful degradation when features fail
   - Add user-friendly error messages with suggested actions
   - Create manual retry mechanisms for failed processes

6. **Analytics and Monitoring**:
   - Add processing time tracking and analytics
   - Implement error rate monitoring
   - Create usage statistics for different features
   - Add performance metrics for optimization

TESTING REQUIREMENTS:
- Test background job processing handles multiple concurrent requests
- Verify progress updates display accurately in real-time
- Test error handling provides helpful user feedback
- Confirm caching improves performance for repeated requests
- Test job cancellation works properly without corrupting data
- Verify notification system alerts users of completed processing
- Test graceful degradation when processing services are unavailable
- Validate analytics tracking captures relevant usage data
```

## Phase 4: Testing and Quality Assurance

### Prompt 4A: Comprehensive Testing Suite

```
Create a comprehensive testing suite for all new lyrics and sheet music features:

1. **Unit Tests**:
   - Test lyrics parsing and formatting functions
   - Test MIDI conversion accuracy with sample files
   - Test VexFlow rendering with various notation types
   - Test API endpoints with mock data and edge cases

2. **Integration Tests**:
   - Test complete workflow from SunoAPI to sheet music
   - Test database operations with new schema fields
   - Test file upload, processing, and cleanup workflows
   - Test WebSocket real-time updates

3. **End-to-End Tests**:
   - Test complete user journey from song generation to sheet music viewing
   - Test cross-browser compatibility for all new features
   - Test mobile responsiveness and touch interactions
   - Test accessibility compliance with screen readers

4. **Performance Tests**:
   - Test audio processing performance with various file sizes
   - Test sheet music rendering performance with complex scores
   - Test concurrent user processing load
   - Test memory usage and cleanup

5. **Error Scenario Tests**:
   - Test handling of corrupted audio files
   - Test network failures during processing
   - Test invalid MIDI data handling
   - Test storage limit scenarios

TESTING REQUIREMENTS:
- All unit tests must pass with >90% code coverage
- Integration tests must verify complete data flow
- End-to-end tests must work across Chrome, Firefox, Safari
- Performance tests must meet specified response time requirements
- Error tests must provide appropriate user feedback
```

## Environment Setup Requirements

### Additional Dependencies

```bash
# Backend Dependencies
npm install python-shell midi-parser-js
pip install basic-pitch tensorflow

# Frontend Dependencies
npm install vexflow midi-player-js
npm install @types/vexflow

# Development Dependencies
npm install @testing-library/react @testing-library/jest-dom
npm install cypress # for E2E testing
```

### Environment Variables

```bash
# Add to existing .env files
PYTHON_PATH=/usr/bin/python3
BASIC_PITCH_MODEL_PATH=./models/basic_pitch
MIDI_STORAGE_PATH=./storage/midi
SHEET_MUSIC_CACHE_PATH=./storage/sheets
MAX_AUDIO_FILE_SIZE=50MB
PROCESSING_TIMEOUT=300000
```

## Professional Development Standards

### Code Quality Requirements
- All new components must use TypeScript with strict mode
- Implement proper error boundaries for new features
- Add comprehensive JSDoc documentation
- Follow existing code style and patterns
- Implement proper loading states and error handling

### Security Requirements
- Validate all file uploads and processing inputs
- Implement proper rate limiting for processing endpoints
- Add CSRF protection for new API endpoints
- Sanitize all user inputs and file contents
- Implement proper file access controls

### Performance Requirements
- Sheet music rendering must complete within 5 seconds
- MIDI generation must complete within 30 seconds for typical songs
- UI must remain responsive during background processing
- Implement proper memory cleanup for large files
- Cache generated content for improved performance

This comprehensive prompt set will add professional lyrics display and music sheet generation capabilities to your existing Suno music app, making it significantly more valuable than competitors while maintaining the same high-quality development standards.
