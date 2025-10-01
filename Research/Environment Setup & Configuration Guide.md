# Environment Setup & Configuration Guide

## 🔧 Required Environment Variables

Create a `.env.local` file in your project root with these variables:

```bash
# Authentication (NextAuth.js)
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Provider for Magic Links
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com

# SunoAPI Integration
SUNOAPI_KEY=your-actual-sunoapi-key
SUNOAPI_BASE_URL=https://api.sunoapi.com/v1

# Database (Development)
DATABASE_URL=file:./dev.db

# Database (Production - PostgreSQL)
# DATABASE_URL=postgresql://username:password@localhost:5432/aimusic
```

## 🔑 Getting Your API Keys

### 1. SunoAPI Key
1. Visit [SunoAPI.com](https://sunoapi.com/en)
2. Sign up for an account
3. Choose a paid plan (required for API access)
4. Navigate to your dashboard
5. Copy your API key
6. **Test your key**: Use the validation endpoint to ensure it works

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

### 3. Email Configuration (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in EMAIL_SERVER_PASSWORD

## 🗄️ Database Setup

### Development (SQLite)
```bash
# Install Prisma (if using)
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Generate database
npx prisma db push

# View database
npx prisma studio
```

### Production (PostgreSQL)
```bash
# Install PostgreSQL client
npm install pg @types/pg

# Create production database
createdb aimusic_production

# Run migrations
npx prisma migrate deploy
```

## 🧪 API Key Validation

### Test SunoAPI Connection
```bash
# Create a test script: test-api.js
const axios = require('axios');

async function testSunoAPI() {
  try {
    const response = await axios.get('https://api.sunoapi.com/v1/credits', {
      headers: {
        'Authorization': `Bearer ${process.env.SUNOAPI_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ SunoAPI connection successful:', response.data);
  } catch (error) {
    console.error('❌ SunoAPI connection failed:', error.response?.data || error.message);
  }
}

testSunoAPI();
```

Run with: `node test-api.js`

### Test Google OAuth
1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/auth/providers`
3. Should return JSON with Google provider configured
4. Test sign-in flow with real Google account

### Test Email Configuration
```javascript
// Add to your test script
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ Email configuration successful');
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
  }
}

testEmail();
```

## 🔒 Security Best Practices

### Environment Variable Security
- Never commit `.env.local` to version control
- Add `.env.local` to your `.gitignore` file
- Use different keys for development and production
- Rotate API keys regularly

### NextAuth Secret Generation
```bash
# Generate a secure secret
openssl rand -base64 32
```

### Production Environment Variables
For production deployment (Vercel, Netlify, etc.):
1. Set all environment variables in your hosting platform
2. Use production URLs for NEXTAUTH_URL
3. Use production database URLs
4. Enable HTTPS for all OAuth redirects

## 🚀 Development Workflow

### 1. Initial Setup
```bash
# Clone or create project
git clone your-repo
cd ai-music-studio

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual keys
nano .env.local

# Test API connections
node test-api.js

# Start development server
npm run dev
```

### 2. Validation Checklist
- [ ] SunoAPI key works and returns real credit balance
- [ ] Google OAuth redirects to actual Google sign-in
- [ ] Magic link sends real emails
- [ ] Database connections work
- [ ] All environment variables loaded correctly

### 3. Common Issues and Solutions

**Issue**: "Invalid API key" from SunoAPI
**Solution**: Verify your API key is correct and your account has sufficient credits

**Issue**: Google OAuth redirect mismatch
**Solution**: Ensure redirect URIs in Google Console match your NEXTAUTH_URL

**Issue**: Magic link emails not sending
**Solution**: Check Gmail app password and enable "Less secure app access" if needed

**Issue**: Database connection errors
**Solution**: Verify DATABASE_URL format and database server is running

## 📱 Mobile Testing Setup

### Local Network Testing
```bash
# Find your local IP
ipconfig getifaddr en0  # macOS
ip route get 1.2.3.4 | awk '{print $7}'  # Linux

# Update NEXTAUTH_URL for mobile testing
NEXTAUTH_URL=http://192.168.1.100:3000
```

### Mobile Browser Testing
1. Connect mobile device to same WiFi network
2. Visit `http://your-local-ip:3000` on mobile
3. Test all functionality on actual mobile browsers
4. Verify touch interactions and responsive design

## 🔍 Debugging Tools

### API Request Logging
```javascript
// Add to your API routes for debugging
console.log('Request:', {
  method: req.method,
  url: req.url,
  headers: req.headers,
  body: req.body
});
```

### Environment Variable Debugging
```javascript
// Check if variables are loaded
console.log('Environment check:', {
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasSunoApiKey: !!process.env.SUNOAPI_KEY,
  hasEmailConfig: !!process.env.EMAIL_SERVER_USER
});
```

### Network Request Monitoring
- Use browser DevTools Network tab
- Monitor API calls to SunoAPI
- Check for CORS issues
- Verify authentication headers

## ✅ Production Deployment Checklist

Before deploying to production:
- [ ] All API keys tested and working
- [ ] Environment variables configured in hosting platform
- [ ] Database migrations completed
- [ ] HTTPS enabled for all OAuth redirects
- [ ] Error monitoring configured
- [ ] Performance optimization completed
- [ ] Security headers implemented
- [ ] API rate limiting configured

Remember: Professional applications require professional setup. Take time to configure everything correctly before starting development.
