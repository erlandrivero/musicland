# Updated Windsurf Prompts: Professional AI Music App with Authentication

## 🎯 App Structure Overview

**Public Pages**: Landing page, pricing, about, demo
**Protected Pages**: Music generation, projects, credits, profile (behind sign-in)
**Authentication**: Google Sign-In + Magic Link (no username/password)

---

## Step 1: Project Foundation & Landing Page

### Prompt 1A: Initial Setup
```
Create a new Next.js 14 application called "ai-music-studio" with TypeScript and Tailwind CSS for a professional AI music generation platform. Set up:

FOLDER STRUCTURE:
- app/(public)/ - for landing page, pricing, about
- app/(protected)/ - for authenticated app features  
- app/api/ - for API routes
- components/ui/ - reusable UI components
- components/auth/ - authentication components
- components/landing/ - landing page sections
- lib/ - utilities and configurations
- types/ - TypeScript interfaces

DEPENDENCIES:
- @next/font for typography
- lucide-react for icons
- framer-motion for animations
- @headlessui/react for accessible components
- clsx and tailwind-merge for styling

CONFIGURATION:
- TypeScript strict mode
- Tailwind with custom design system colors
- Environment variables setup
- Professional folder structure with clear separation

Create a modern, professional design system with:
- Primary colors: Blue (#3B82F6) and Purple (#8B5CF6)
- Typography scale with Inter font
- Component variants for buttons, cards, inputs
- Mobile-first responsive breakpoints
```

### Testing Step 1A:
**Verify**: Project builds successfully, folder structure is correct, design system works

---

### Prompt 1B: Professional Landing Page
```
Create a professional landing page for the AI music generation platform with these sections:

HERO SECTION:
- Compelling headline: "Create Professional Music with AI in Seconds"
- Subheadline explaining the value proposition
- Two prominent CTAs: "Start Creating" (sign up) and "Watch Demo"
- Hero image/video placeholder or animated background
- Social proof indicators (user count, songs generated)

FEATURES SECTION:
- 6 key features with icons and descriptions:
  1. AI-Powered Generation
  2. Professional Quality
  3. Commercial Licensing  
  4. Mobile-First Design
  5. Real-time Collaboration
  6. Instant Download
- Each feature with icon, title, and 2-3 sentence description

DEMO SECTION:
- Interactive demo or embedded video
- "Try it yourself" call-to-action
- Sample generated tracks with audio players

PRICING SECTION:
- 3 tiers: Free, Creator ($9.99/mo), Team ($29.99/mo)
- Feature comparison table
- "Start Free Trial" buttons

TESTIMONIALS:
- 3-4 customer testimonials with photos
- Focus on different user types (content creators, agencies, musicians)

FOOTER:
- Company links, social media, legal pages
- Newsletter signup
- Contact information

DESIGN REQUIREMENTS:
- Modern, clean design with plenty of white space
- Smooth scroll animations using Framer Motion
- Mobile-responsive with touch-friendly elements
- Professional color scheme and typography
- Fast loading with optimized images
- Accessibility compliant (ARIA labels, keyboard navigation)

Make it conversion-focused with clear value propositions and multiple sign-up opportunities.
```

### Testing Step 1B:
**Verify**: Landing page loads, animations work, responsive design, all CTAs lead to sign-up

---

## Step 2: Authentication System

### Prompt 2A: Authentication Setup
```
Create a comprehensive authentication system with Google Sign-In and Magic Link options:

AUTHENTICATION PROVIDERS:
1. Google OAuth 2.0 integration
2. Magic Link (passwordless email authentication)
3. NO username/password option

SETUP REQUIREMENTS:
- Install and configure next-auth v5 (Auth.js)
- Google OAuth provider configuration
- Email provider for magic links
- JWT and session configuration
- Database adapter (use SQLite for development, PostgreSQL for production)

ENVIRONMENT VARIABLES NEEDED:
```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

AUTH CONFIGURATION:
- Session strategy: JWT
- Session max age: 30 days
- Callback URLs properly configured
- Error handling for auth failures
- Redirect logic after successful auth

DATABASE SCHEMA:
- Users table (id, email, name, image, created_at)
- Accounts table (for OAuth connections)
- Sessions table (for session management)
- Verification tokens table (for magic links)

Create the auth configuration file and database schema. Include proper TypeScript types for user sessions.
```

### Testing Step 2A:
**Verify**: Auth providers configured, environment variables set, database schema created

---

### Prompt 2B: Authentication UI Components
```
Create professional authentication UI components:

SIGN-IN MODAL:
- Modal overlay with backdrop blur
- Clean, centered design with company branding
- Two authentication options:
  1. "Continue with Google" button with Google icon
  2. "Send Magic Link" with email input field
- Loading states for both options
- Error handling with user-friendly messages
- "Close" option to return to landing page

SIGN-IN FLOW:
- Google: Redirect to Google OAuth, handle callback
- Magic Link: Email input → Send link → Check email message → Verify token
- Success: Redirect to protected dashboard
- Error: Show error message, allow retry

PROTECTED ROUTE WRAPPER:
- Check authentication status
- Redirect unauthenticated users to landing page
- Show loading spinner during auth check
- Handle session expiration gracefully

USER MENU COMPONENT:
- User avatar and name in header
- Dropdown with: Profile, Settings, Sign Out
- Smooth animations and hover effects

DESIGN SPECIFICATIONS:
- Consistent with landing page design system
- Mobile-responsive modal design
- Smooth transitions and micro-interactions
- Professional loading states
- Clear error messaging
- Accessibility compliant

INTEGRATION POINTS:
- Landing page CTAs open sign-in modal
- Protected pages check authentication
- Seamless user experience throughout

Include proper TypeScript types and error boundaries.
```

### Testing Step 2B:
**Verify**: 
- Sign-in modal opens from landing page
- Google sign-in redirects properly (test with real Google account)
- Magic link sends email (test with real email)
- Protected routes redirect unauthenticated users
- User menu works after authentication

---

## Step 3: API Integration with Real Validation

### Prompt 3A: SunoAPI Integration with Validation
```
Create robust SunoAPI integration with REAL API validation (no mock data):

API CONFIGURATION:
- Base URL: https://api.sunoapi.com/v1
- Authentication: Bearer token in headers
- Proper error handling for all scenarios
- Rate limiting and retry logic

ENVIRONMENT VARIABLES:
```
SUNOAPI_KEY=your-actual-api-key
SUNOAPI_BASE_URL=https://api.sunoapi.com/v1
```

API ROUTES TO CREATE:

1. /api/auth/validate-api - Test API key validity
2. /api/credits - Get current credit balance
3. /api/music/generate - Generate music
4. /api/music/status/[id] - Check generation status
5. /api/music/download/[id] - Download completed track

VALIDATION REQUIREMENTS:
- MUST use real API key provided in environment variables
- MUST make actual API calls to SunoAPI endpoints
- MUST handle real API responses and errors
- NO mock data or fake responses allowed
- Include comprehensive error handling for:
  - Invalid API key
  - Insufficient credits
  - Rate limiting
  - Network errors
  - Invalid parameters

API CLIENT UTILITY:
- Axios instance with interceptors
- Automatic token injection
- Response/error logging
- TypeScript interfaces for all endpoints
- Retry logic for transient failures

TYPESCRIPT INTERFACES:
```typescript
interface GenerationRequest {
  custom_mode: boolean;
  gpt_description_prompt?: string;
  prompt?: string;
  tags?: string;
  title?: string;
  make_instrumental?: boolean;
  mv: string;
}

interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audio_url?: string;
  video_url?: string;
  title?: string;
  tags?: string;
}

interface CreditsResponse {
  credits: number;
  total_credits: number;
  credits_used: number;
}
```

TESTING ENDPOINT:
Create /api/test-connection that validates:
- API key is valid
- Can fetch credits
- Can make a test generation request
- Returns detailed status of each check

This endpoint MUST use real API calls and return actual results.
```

### Testing Step 3A:
**Verify**: 
- API key validation works with real SunoAPI
- Credits endpoint returns actual balance
- Test generation request succeeds
- Error handling works for invalid keys
- All responses use real data (no mocks)

---

### Prompt 3B: Credits Management System
```
Create a comprehensive credits management system using REAL SunoAPI data:

CREDITS DISPLAY COMPONENT:
- Real-time credit balance in header
- Visual progress bar showing usage
- Credit cost preview before generation
- Low credit warnings (< 10 credits)
- Automatic refresh after operations

CREDITS API INTEGRATION:
- Fetch actual credits from SunoAPI /credits endpoint
- Update credits after each generation
- Handle credit insufficient errors
- Cache credits data with React Query (5-minute cache)
- Background refresh every 30 seconds when app is active

CREDITS TRACKING:
- Local storage for credit usage history
- Daily/weekly usage analytics
- Cost calculator for different generation types
- Upgrade prompts when credits are low

CREDIT COSTS:
- Standard generation: 5 credits
- Extended generation: 10 credits
- Custom mode: 8 credits
- Instrumental only: 3 credits

UI COMPONENTS:
- Credits counter in header with icon
- Credits history page
- Usage analytics dashboard
- Upgrade/purchase credits flow

ERROR HANDLING:
- Insufficient credits: Show upgrade modal
- API errors: Retry mechanism
- Network issues: Cached fallback

REAL-TIME UPDATES:
- WebSocket connection for credit updates (if available)
- Polling fallback every 30 seconds
- Optimistic updates with rollback on failure

TESTING REQUIREMENTS:
- Must fetch real credit balance from SunoAPI
- Must accurately track credit usage
- Must handle actual API responses
- No simulated or mock credit data

Include comprehensive TypeScript types and proper error boundaries.
```

### Testing Step 3B:
**Verify**:
- Credits display shows real balance from SunoAPI
- Credits update after actual music generation
- Low credit warnings appear at correct thresholds
- Error handling works for insufficient credits
- Real-time updates function properly

---

## Step 4: Music Generation Interface

### Prompt 4A: Professional Music Generation UI
```
Create a professional, mobile-first music generation interface:

MAIN GENERATION FORM:
- Large, prominent text area for music description (placeholder: "Describe the music you want to create...")
- Character counter (max 400 characters for description)
- Style/Genre selector with popular options:
  - Pop, Rock, Hip-Hop, Electronic, Classical, Jazz, Country, R&B, Folk, Reggae
- Advanced options collapsible section:
  - Custom mode toggle
  - Instrumental only toggle
  - Vocal gender selection (Male/Female/Auto)
  - Model version selector (v4, v4.5, v5)
  - Style weight slider (0-1)
  - Weirdness constraint slider (0-1)

GENERATION CONTROLS:
- Large "Generate Music" button (disabled when insufficient credits)
- Credit cost display ("This will cost 5 credits")
- Generation queue status
- Cancel generation option

GENERATION STATUS:
- Real-time status updates from SunoAPI
- Progress indicator with stages:
  1. "Submitting request..."
  2. "Processing with AI..."
  3. "Generating audio..."
  4. "Finalizing track..."
  5. "Complete!"
- Estimated time remaining
- Error handling with retry options

RESULTS DISPLAY:
- Audio player with waveform visualization
- Track metadata (title, duration, style)
- Download options (MP3, WAV)
- Regenerate with same parameters
- Save to project functionality
- Share track options

MOBILE OPTIMIZATION:
- Touch-friendly controls (min 44px height)
- Swipe gestures for advanced options
- Responsive layout for all screen sizes
- Optimized for portrait and landscape
- Fast loading and smooth animations

PROFESSIONAL DESIGN:
- Clean, modern interface
- Consistent with landing page design
- Professional color scheme
- Clear visual hierarchy
- Accessibility compliant
- Loading states for all interactions

INTEGRATION REQUIREMENTS:
- Real SunoAPI integration (no mock data)
- Actual credit deduction
- Real generation status polling
- Proper error handling for API failures
```

### Testing Step 4A:
**Verify**:
- Form submits to real SunoAPI
- Generation status updates in real-time
- Credits are actually deducted
- Audio player works with generated tracks
- Mobile interface is fully functional
- Error handling works for API failures

---

### Prompt 4B: Audio Player and Track Management
```
Create a professional audio player and track management system:

CUSTOM AUDIO PLAYER:
- Modern design with waveform visualization using wavesurfer.js
- Controls: Play/Pause, Previous/Next, Volume, Seek
- Progress bar with time display (current/total)
- Loop and shuffle options
- Playback speed control (0.5x to 2x)
- Mobile-optimized with large touch targets

WAVEFORM FEATURES:
- Visual waveform representation
- Click/tap to seek
- Progress highlighting
- Loading animation while processing
- Responsive design for all screen sizes

TRACK MANAGEMENT:
- Save tracks to projects
- Add custom titles and descriptions
- Tag tracks with genres/moods
- Favorite/bookmark system
- Track history and analytics

DOWNLOAD FUNCTIONALITY:
- Multiple format options (MP3, WAV, FLAC)
- Quality selection (128kbps, 320kbps, lossless)
- Batch download for multiple tracks
- Download progress indicators

SHARING FEATURES:
- Generate shareable links
- Social media integration
- Embed code for websites
- QR code generation for mobile sharing

PLAYLIST MANAGEMENT:
- Create custom playlists
- Drag-and-drop reordering
- Playlist sharing
- Auto-generated playlists by genre/mood

PROFESSIONAL FEATURES:
- Stem separation display (if available from API)
- Audio analysis (BPM, key, loudness)
- Export to DAW formats
- Collaboration features (comments, versions)

PERFORMANCE OPTIMIZATION:
- Lazy loading for large track lists
- Audio preloading for smooth playback
- Efficient waveform rendering
- Memory management for long sessions

INTEGRATION:
- Real audio files from SunoAPI
- Actual download functionality
- Proper file handling and storage
- Error handling for corrupted files

Include comprehensive TypeScript types and proper error boundaries.
```

### Testing Step 4B:
**Verify**:
- Audio player works with real generated tracks
- Waveform visualization displays correctly
- Download functionality works with actual files
- Track management saves and retrieves properly
- Mobile audio playback functions correctly
- Sharing features generate valid links

---

## Step 5: Project Management and Dashboard

### Prompt 5A: Project Dashboard
```
Create a comprehensive project management dashboard:

DASHBOARD LAYOUT:
- Header with user info, credits, and quick actions
- Sidebar navigation (collapsible on mobile)
- Main content area with project grid/list view
- Quick stats: Total projects, tracks generated, credits used

PROJECT GRID VIEW:
- Card-based layout with project thumbnails
- Project metadata: Name, track count, last modified
- Quick actions: Play, Edit, Share, Delete
- Drag-and-drop for organization
- Infinite scroll for large collections

PROJECT LIST VIEW:
- Table format with sortable columns
- Bulk selection and actions
- Advanced filtering options
- Export functionality

PROJECT CREATION:
- "New Project" modal with template options
- Project templates: Podcast Intro, Social Media, Background Music
- Collaborative project setup
- Import existing tracks

SEARCH AND FILTERING:
- Global search across all projects and tracks
- Filter by: Date, Genre, Collaborators, Status
- Saved search queries
- Tag-based organization

ANALYTICS DASHBOARD:
- Usage statistics and trends
- Popular genres and styles
- Credit usage patterns
- Performance metrics

MOBILE OPTIMIZATION:
- Bottom sheet navigation
- Swipe gestures for actions
- Touch-friendly grid layout
- Optimized for one-handed use

PROFESSIONAL FEATURES:
- Project templates and presets
- Bulk operations
- Advanced search capabilities
- Export and backup options
- Team collaboration tools

DATA MANAGEMENT:
- Local storage with cloud sync
- Automatic backups
- Version control for projects
- Data export/import

Include proper TypeScript types and comprehensive error handling.
```

### Testing Step 5A:
**Verify**:
- Dashboard loads with real project data
- Project creation and editing works
- Search and filtering functions properly
- Mobile navigation is smooth
- Analytics display accurate data
- Bulk operations work correctly

---

## Step 6: Professional Polish and Testing

### Prompt 6A: Professional UI Polish
```
Add professional polish and refinement to the entire application:

DESIGN SYSTEM REFINEMENT:
- Consistent spacing and typography throughout
- Professional color palette with proper contrast ratios
- Smooth micro-interactions and animations
- Loading states for all async operations
- Empty states with helpful messaging

PERFORMANCE OPTIMIZATION:
- Image optimization and lazy loading
- Code splitting for faster initial load
- Bundle analysis and optimization
- Lighthouse score optimization (90+ on all metrics)
- Progressive Web App features

ACCESSIBILITY IMPROVEMENTS:
- ARIA labels and roles throughout
- Keyboard navigation for all features
- Screen reader compatibility
- High contrast mode support
- Focus management and indicators

ERROR HANDLING:
- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms for failed operations
- Offline functionality where possible
- Graceful degradation

PROFESSIONAL FEATURES:
- Keyboard shortcuts for power users
- Bulk operations and batch processing
- Advanced search with filters
- Data export and backup options
- User preferences and settings

MOBILE ENHANCEMENTS:
- Native app-like experience
- Gesture support and haptic feedback
- Optimized for various screen sizes
- Fast touch responses
- Smooth scrolling and animations

TESTING INTEGRATION:
- Unit tests for critical components
- Integration tests for API calls
- E2E tests for user workflows
- Performance testing
- Accessibility testing

DOCUMENTATION:
- User onboarding flow
- Help documentation
- Keyboard shortcuts guide
- API documentation
- Troubleshooting guides

Ensure every interaction feels polished and professional.
```

### Testing Step 6A:
**Verify**:
- All animations are smooth and purposeful
- Loading states appear consistently
- Error handling provides helpful feedback
- Accessibility features work properly
- Performance metrics meet professional standards
- Mobile experience feels native

---

### Prompt 6B: Comprehensive Testing and Validation
```
Create a comprehensive testing suite and validation system:

API TESTING:
- Real API integration tests with SunoAPI
- Credit balance validation
- Music generation end-to-end tests
- Error handling for all API scenarios
- Rate limiting and retry logic tests

USER FLOW TESTING:
- Complete user journey from landing to generation
- Authentication flow testing
- Project creation and management
- Audio playback and download
- Mobile user experience validation

PERFORMANCE TESTING:
- Page load speed optimization
- Audio streaming performance
- Large project handling
- Memory usage monitoring
- Network efficiency testing

SECURITY TESTING:
- Authentication security validation
- API key protection
- User data privacy
- XSS and CSRF protection
- Secure file handling

BROWSER COMPATIBILITY:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile browser optimization
- Progressive Web App functionality
- Offline capability testing

ACCESSIBILITY TESTING:
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management
- ARIA implementation

DEPLOYMENT PREPARATION:
- Environment configuration
- Production build optimization
- CDN setup for assets
- Database migration scripts
- Monitoring and logging setup

DOCUMENTATION:
- User manual and guides
- Developer documentation
- API integration guide
- Troubleshooting documentation
- Deployment instructions

Create automated tests that validate real API integration and user workflows.
```

### Testing Step 6B:
**Verify**:
- All tests pass with real API integration
- User flows work end-to-end
- Performance meets professional standards
- Security measures are properly implemented
- Application is ready for production deployment

---

## 🔧 Professional Development Guidelines

### Code Quality Standards:
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Comprehensive error handling
- Proper logging and monitoring
- Security best practices

### Testing Requirements:
- Every API call must use real endpoints
- No mock data in production code
- Comprehensive error scenario testing
- Mobile-first testing approach
- Performance benchmarking

### Professional Features:
- Loading states for all async operations
- Optimistic UI updates with rollback
- Comprehensive error boundaries
- Accessibility compliance
- SEO optimization

### Deployment Checklist:
- Environment variables properly configured
- API keys secured and validated
- Performance optimized (Lighthouse 90+)
- Security headers implemented
- Monitoring and analytics setup

Each step must be fully tested and validated before proceeding to the next step. Focus on creating a professional, production-ready application that provides real value to users.
