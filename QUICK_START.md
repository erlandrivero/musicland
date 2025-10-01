# Quick Start Guide - AI Music Studio

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- SunoAPI account and API key
- Google OAuth credentials (optional for auth)

---

## Step 1: Install Dependencies

```bash
cd "C:\Users\Erland\Desktop\School\CAP3321 Data Wrangeling\New Music"
npm install
```

---

## Step 2: Configure Environment Variables

Create `.env.local` file:

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional - for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (Optional - for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Database
DATABASE_URL="file:./dev.db"

# SunoAPI Configuration (REQUIRED)
SUNOAPI_KEY=your-actual-api-key-from-sunoapi-com
SUNOAPI_BASE_URL=https://api.sunoapi.com/v1
```

**Get your SunoAPI key:** https://sunoapi.com/dashboard

---

## Step 3: Initialize Database

```bash
npx prisma generate
npx prisma db push
```

---

## Step 4: Start Development Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

---

## Step 5: Test API Connection

Open in browser:
```
http://localhost:3000/api/test-connection
```

**Expected:** All 4 tests should pass ✅

---

## 🎯 What You Can Do Now

### 1. View Landing Page
```
http://localhost:3000
```

### 2. Sign In
- Click "Get Started" or "Sign In"
- Use Google OAuth or Magic Link

### 3. View Credits Dashboard
```
http://localhost:3000/credits
```
- See your credit balance
- View usage analytics
- Track transaction history

### 4. Test API Endpoints

**Check Credits:**
```bash
curl http://localhost:3000/api/credits
```

**Generate Music:**
```bash
curl -X POST http://localhost:3000/api/music/generate \
  -H "Content-Type: application/json" \
  -d '{
    "custom_mode": false,
    "gpt_description_prompt": "A happy upbeat pop song",
    "mv": "chirp-v3-5"
  }'
```

---

## 📁 Project Structure

```
New Music/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (protected)/       # Protected pages
│   └── auth/              # Auth pages
├── components/            # React components
│   ├── credits/          # Credits management
│   └── auth/             # Authentication
├── hooks/                # Custom React hooks
├── lib/                  # Utilities
│   ├── sunoapi.ts       # SunoAPI client
│   ├── auth.ts          # NextAuth config
│   └── db.ts            # Prisma client
└── prisma/              # Database schema
```

---

## 🧪 Available Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

---

## 📊 Features Available

### ✅ Completed (Steps 1-3)
- Landing page with animations
- Google OAuth + Magic Link authentication
- SunoAPI integration (6 endpoints)
- Credits management system
- Real-time credit tracking
- Usage analytics
- Transaction history

### 🚧 Coming Next (Step 4)
- Music generation interface
- Audio player
- Track management
- Project organization

---

## 🔧 Troubleshooting

### Issue: "API key is not configured"
**Solution:** Add `SUNOAPI_KEY` to `.env.local`

### Issue: "Database not found"
**Solution:** Run `npx prisma db push`

### Issue: "Port 3000 already in use"
**Solution:** Kill the process or use different port:
```bash
PORT=3001 npm run dev
```

### Issue: Build fails
**Solution:** 
```bash
rm -rf .next
npm run build
```

---

## 📚 Documentation

- **`README.md`** - Main project documentation
- **`README_STEP_3.md`** - Step 3 completion summary
- **`API_DOCUMENTATION.md`** - API reference
- **`STEP_3A_TESTING.md`** - API testing guide
- **`STEP_3B_TESTING.md`** - Credits testing guide

---

## 🆘 Need Help?

1. Check documentation files
2. Review error messages in console
3. Verify environment variables
4. Check SunoAPI dashboard for credit balance
5. Ensure database is initialized

---

## 🎉 You're Ready!

Your AI Music Studio is now running with:
- ✅ Real SunoAPI integration
- ✅ Credits management
- ✅ Authentication system
- ✅ Professional UI

**Next:** Start building the music generation interface (Step 4)
