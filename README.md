# AI Music Studio

A professional AI music generation platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎵 **AI-Powered Music Generation** - Create studio-quality music using advanced AI models
- ⚡ **Lightning Fast** - Generate complete songs in under 60 seconds
- 📱 **Mobile-First Design** - Responsive interface optimized for all devices
- 🔐 **Secure Authentication** - Google OAuth and Magic Link authentication
- 💳 **Credits Management** - Real-time credit tracking and usage analytics
- 🎧 **Professional Audio Player** - Custom player with waveform visualization
- 📊 **Project Management** - Organize and manage your music projects

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js v5
- **AI Integration**: SunoAPI (Suno, Riffusion, Nuro models)
- **Database**: SQLite (dev) / MongoDB (production)
- **Deployment**: Netlify

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `SUNOAPI_KEY` - Get from https://sunoapi.com
   - `DATABASE_URL` - SQLite path (default: `file:./dev.db`)

3. **Initialize database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Test API integration**:
   Navigate to [http://localhost:3000/api/test-connection](http://localhost:3000/api/test-connection)
   
   See `STEP_3A_TESTING.md` for comprehensive testing guide.

## Project Structure

```
├── app/
│   ├── (public)/          # Public pages (landing, pricing, about)
│   ├── (protected)/       # Protected pages (dashboard, generation)
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   └── landing/          # Landing page sections
├── lib/                  # Utilities and configurations
├── types/                # TypeScript interfaces
└── public/               # Static assets
```

## Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main brand color
- **Secondary**: Purple (#8B5CF6) - Accent color
- **Gray Scale**: Comprehensive gray palette for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Responsive typography scale from xs to 6xl

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Default, Hover, Bordered variants
- **Inputs**: Standard input with error states and validation

## Development Guidelines

- **TypeScript**: Strict mode enabled for better type safety
- **Mobile-First**: All components designed for mobile first
- **Accessibility**: WCAG compliant components with proper ARIA labels
- **Performance**: Optimized for Core Web Vitals

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## License

Private project - All rights reserved
