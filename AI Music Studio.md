# AI Music Studio

## Application Description

**AI Music Studio** is a professional web-based music generation platform that leverages artificial intelligence to create studio-quality music tracks in under 60 seconds. The application transforms user text prompts into complete, professionally-mixed music tracks without requiring any musical background or experience. Built with modern web technologies, it provides an intuitive, mobile-first interface designed for content creators, podcasters, marketers, musicians, and creative professionals.

## APIs Used and Their Purpose

### Primary APIs

1. **SunoAPI (https://sunoapi.com)**
   - **Purpose**: Core AI music generation functionality
   - **Usage**: Processes text prompts and generates professional music tracks
   - **Models**: Integrates with Suno, Riffusion, and Nuro AI models
   - **Features**: Supports various genres, moods, instruments, and musical styles

2. **NextAuth.js v5**
   - **Purpose**: Authentication and session management
   - **Usage**: Handles user registration, login, and secure session management
   - **Providers**: Google OAuth and Magic Link authentication

3. **Google OAuth API**
   - **Purpose**: Social authentication
   - **Usage**: Enables users to sign in with their Google accounts
   - **Integration**: Seamless authentication flow with profile data retrieval

### Supporting APIs and Services

4. **MongoDB/SQLite Database API**
   - **Purpose**: Data persistence and user management
   - **Usage**: Stores user profiles, generated music metadata, project information, and usage analytics
   - **Features**: Real-time credit tracking and project organization

5. **Stripe API** (Planned Integration)
   - **Purpose**: Payment processing and subscription management
   - **Usage**: Handles tiered subscription plans and credit allocation
   - **Features**: Secure payment processing and billing management

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js v5
- **Database**: SQLite (development) / MongoDB (production)
- **Deployment**: Netlify
- **AI Integration**: SunoAPI
- **Audio Processing**: Custom Web Audio API implementation

## Installation Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/erlandrivero/musicland.git
   cd musicland
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   Edit `.env.local` and add the following required variables:
   ```env
   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # SunoAPI Integration
   SUNOAPI_KEY=your-sunoapi-key
   SUNOAPI_BASE_URL=https://api.sunoapi.com/v1

   # Database
   DATABASE_URL=file:./dev.db
   ```

5. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access Application**
   Open your browser and navigate to `http://localhost:3000`

8. **Test API Integration**
   Visit `http://localhost:3000/api/test-connection` to verify API connectivity

## Usage Instructions

### Getting Started

1. **Access the Application**
   - Visit the deployed application at: https://soulmusicfest.netlify.app/
   - Or run locally at: http://localhost:3000

2. **User Authentication**
   - Click "Start Creating Music" on the homepage
   - Choose authentication method:
     - **Google Sign-In**: Use your Google account for instant access
     - **Magic Link**: Enter your email to receive a secure login link

3. **Music Generation Process**
   - **Step 1**: Enter a text description of the music you want to create
     - Example: "Upbeat pop song with electronic beats for a workout video"
   - **Step 2**: Select genre and style preferences (optional)
   - **Step 3**: Choose advanced options like instrumental-only or vocal gender
   - **Step 4**: Click "Generate Music" (costs 5 credits)
   - **Step 5**: Wait 30-60 seconds for AI processing

4. **Managing Generated Music**
   - **Play**: Use the built-in audio player with waveform visualization
   - **Download**: Save tracks in MP3, WAV, or FLAC formats
   - **Save to Project**: Organize tracks in custom project folders
   - **Share**: Generate shareable links for collaboration

5. **Credit System**
   - **Free Tier**: 50 one-time credits for new users
   - **Paid Plans**: Monthly credit allocations (500-5000 credits)
   - **Usage Tracking**: Real-time credit balance and usage analytics
   - **Credit Costs**: 
     - Standard generation: 5 credits
     - Extended generation: 10 credits
     - Custom mode: 8 credits

### Advanced Features

6. **Project Management**
   - Create and organize music projects
   - Add custom titles and descriptions
   - Tag tracks with genres and moods
   - Search and filter your music library

7. **Collaboration Features**
   - Share projects with team members
   - Real-time collaboration on music projects
   - Comment and feedback system
   - Version control for track iterations

8. **Commercial Usage**
   - All generated music includes commercial licensing
   - Use in YouTube videos, podcasts, advertisements
   - No additional royalty fees
   - Full ownership of generated content

## Screenshots

### 1. Landing Page
![Landing Page](screenshots/landing-page.png)
*Professional landing page with clear value proposition and call-to-action buttons*

### 2. Features Overview
![Features Section](screenshots/features-section.png)
*Comprehensive feature showcase including AI-powered generation, professional quality, and commercial licensing*

### 3. Pricing Plans
![Pricing Plans](screenshots/pricing-plans.png)
*Transparent pricing structure with Free, Basic ($9.99), Creator ($19.99), and Team ($29.99) tiers*

### 4. User Testimonials
![Testimonials](screenshots/testimonials.png)
*Real user testimonials from content creators, agencies, and musicians showcasing platform success*

### 5. Music Generation Interface
![Generation Interface](screenshots/generation-interface.png)
*Clean, intuitive interface for creating music with text prompts and customization options*

### 6. Audio Player
![Audio Player](screenshots/audio-player.png)
*Professional audio player with waveform visualization and download options*

## Project Structure

```
├── app/
│   ├── (public)/              # Public pages (landing, pricing, about)
│   ├── (protected)/           # Protected pages (dashboard, generation)
│   ├── api/                   # API routes and endpoints
│   ├── globals.css            # Global styles and design system
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Home page component
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── auth/                  # Authentication components
│   ├── landing/               # Landing page sections
│   ├── music/                 # Music generation components
│   └── dashboard/             # Dashboard and project management
├── lib/
│   ├── auth.ts                # Authentication configuration
│   ├── database.ts            # Database connection and queries
│   ├── sunoapi.ts             # SunoAPI integration
│   └── utils.ts               # Utility functions
├── types/
│   ├── auth.ts                # Authentication type definitions
│   ├── music.ts               # Music generation types
│   └── database.ts            # Database schema types
├── public/
│   ├── images/                # Static images and assets
│   └── icons/                 # Application icons
├── hooks/                     # Custom React hooks
├── scripts/                   # Database and deployment scripts
└── Research/                  # Project documentation and research
```

## Key Features Demonstrated

### Technical Implementation
- **Modern React Architecture**: Utilizes Next.js 14 App Router for optimal performance
- **Type Safety**: Full TypeScript implementation with strict mode
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure user management with NextAuth.js
- **API Integration**: Real-time communication with AI music generation services
- **Database Management**: Efficient data persistence and retrieval
- **Performance Optimization**: Code splitting, lazy loading, and caching strategies

### User Experience
- **Intuitive Interface**: Clean, professional design with clear navigation
- **Fast Generation**: Music creation in under 60 seconds
- **Commercial Licensing**: Full rights included for all generated content
- **Project Organization**: Comprehensive project and track management
- **Real-time Feedback**: Live credit tracking and generation status updates
- **Cross-platform Compatibility**: Seamless experience across devices

### Business Features
- **Freemium Model**: Free tier with upgrade options
- **Subscription Management**: Tiered pricing with different feature access
- **Usage Analytics**: Detailed tracking of user engagement and credit usage
- **Scalable Architecture**: Built to handle growing user base and feature expansion

## Live Application

**Deployed URL**: https://soulmusicfest.netlify.app/
**GitHub Repository**: https://github.com/erlandrivero/musicland

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis
- `npm run type-check` - Run TypeScript compiler checks

## License

Private project - All rights reserved

---

*This application demonstrates advanced full-stack development skills, AI API integration, modern web technologies, and professional user experience design.*
