# 🚀 Deployment Guide - AI Music Studio

**Quick Start Guide for Production Deployment**

---

## 🎯 Overview

This guide will walk you through deploying your AI Music Studio to production in **under 30 minutes**.

**Recommended Platform:** Vercel (easiest and fastest)

---

## ⚡ Quick Deploy (Vercel - Recommended)

### Step 1: Prepare Repository (5 minutes)

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - AI Music Studio"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/ai-music-studio.git
git branch -M main
git push -u origin main
```

### Step 2: Setup Database (5 minutes)

**Option A: Supabase (Recommended - Free tier)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

**Option B: Neon (Serverless PostgreSQL)**
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string

**Option C: Railway**
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string

### Step 3: Update Prisma Schema (2 minutes)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 4: Deploy to Vercel (10 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure Environment Variables:**

```env
# Required
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SUNOAPI_KEY=your-api-key
SUNOAPI_BASE_URL=https://api.sunoapi.com/v1

# Optional (if using Magic Links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

4. **Deploy!**

### Step 5: Run Database Migration (3 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migration
vercel env pull .env.production
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### Step 6: Update Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "Credentials"
4. Edit OAuth 2.0 Client
5. Add Authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Save

### Step 7: Test! (5 minutes)

Visit your app and test:
- [ ] Sign in with Google
- [ ] Generate music
- [ ] Play audio
- [ ] All features working

---

## 🐳 Alternative: Docker Deployment

### Build Docker Image

```dockerfile
# Dockerfile (already provided in checklist)
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Deploy with Docker

```bash
# Build
docker build -t ai-music-studio .

# Run locally to test
docker run -p 3000:3000 --env-file .env.production ai-music-studio

# Push to registry
docker tag ai-music-studio your-registry/ai-music-studio
docker push your-registry/ai-music-studio

# Deploy to your server
# (DigitalOcean, AWS, GCP, etc.)
```

---

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | From Google Cloud Console |
| `SUNOAPI_KEY` | SunoAPI API Key | From SunoAPI dashboard |
| `SUNOAPI_BASE_URL` | SunoAPI Base URL | `https://api.sunoapi.com/v1` |

### Optional Variables

| Variable | Description | When Needed |
|----------|-------------|-------------|
| `EMAIL_SERVER_HOST` | SMTP server host | If using Magic Links |
| `EMAIL_SERVER_PORT` | SMTP server port | If using Magic Links |
| `EMAIL_SERVER_USER` | SMTP username | If using Magic Links |
| `EMAIL_SERVER_PASSWORD` | SMTP password | If using Magic Links |
| `EMAIL_FROM` | From email address | If using Magic Links |

---

## 🔐 Security Checklist

Before going live:

- [ ] All environment variables set
- [ ] NEXTAUTH_SECRET is unique and secure
- [ ] Google OAuth redirect URIs updated
- [ ] Database has strong password
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] API keys not exposed in client code
- [ ] Rate limiting configured (optional but recommended)

---

## 📊 Post-Deployment Checklist

### Immediate (First Hour)
- [ ] Test sign in with Google
- [ ] Test music generation
- [ ] Verify credits system working
- [ ] Check all pages load
- [ ] Test on mobile device
- [ ] Verify analytics tracking (if configured)

### First Day
- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Verify database connections stable
- [ ] Test with real users
- [ ] Monitor SunoAPI usage

### First Week
- [ ] Review user feedback
- [ ] Check performance metrics
- [ ] Optimize slow queries
- [ ] Fix any reported bugs
- [ ] Monitor costs

---

## 🆘 Troubleshooting

### Build Fails

**Issue:** Build fails on Vercel
**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

### Database Connection Fails

**Issue:** Can't connect to database
**Solution:**
1. Verify DATABASE_URL is correct
2. Check database is accessible from Vercel
3. Ensure Prisma schema matches database
4. Run migrations: `npx prisma migrate deploy`

### OAuth Not Working

**Issue:** Google sign-in fails
**Solution:**
1. Verify NEXTAUTH_URL matches your domain
2. Check Google OAuth redirect URIs include your domain
3. Ensure GOOGLE_CLIENT_ID and SECRET are correct
4. Clear browser cookies and try again

### SunoAPI Errors

**Issue:** Music generation fails
**Solution:**
1. Verify SUNOAPI_KEY is valid
2. Check API key has credits
3. Test API key with curl:
   ```bash
   curl -H "api-key: YOUR_KEY" https://api.sunoapi.com/v1/get-credits
   ```
4. Check SunoAPI status page

---

## 📈 Scaling Considerations

### When You Grow

**Database:**
- Upgrade to larger PostgreSQL instance
- Add read replicas
- Implement connection pooling

**Hosting:**
- Vercel scales automatically
- Consider CDN for static assets
- Add Redis for caching

**API:**
- Implement rate limiting
- Add API key management
- Consider API gateway

**Monitoring:**
- Setup Sentry for errors
- Add performance monitoring
- Configure alerts

---

## 💰 Cost Estimates

### Free Tier (Getting Started)
- **Vercel:** Free (Hobby plan)
- **Supabase:** Free (500MB database)
- **SunoAPI:** Pay per use (~$0.08 per 10 credits)
- **Total:** ~$0-10/month initially

### Growing (100-1000 users)
- **Vercel:** $20/month (Pro plan)
- **Database:** $25/month (Supabase Pro or Neon)
- **SunoAPI:** $50-200/month (depends on usage)
- **Monitoring:** $0-29/month (Sentry)
- **Total:** ~$95-275/month

### Scale (1000+ users)
- **Vercel:** $20-100/month
- **Database:** $100-500/month
- **SunoAPI:** $200-1000/month
- **Monitoring:** $29-99/month
- **CDN:** $20-100/month
- **Total:** ~$370-1800/month

---

## 🎉 You're Live!

Once deployed, share your app:
- [ ] Add to Product Hunt
- [ ] Share on Twitter/X
- [ ] Post on Reddit (r/SideProject, r/webdev)
- [ ] Share on LinkedIn
- [ ] Add to your portfolio

---

## 📞 Need Help?

- **Vercel Support:** https://vercel.com/support
- **Next.js Discord:** https://nextjs.org/discord
- **Prisma Discord:** https://pris.ly/discord
- **SunoAPI Support:** Check their documentation

---

**Deployment Time:** ~30 minutes  
**Difficulty:** Easy with Vercel  
**Cost:** Free to start

**Good luck with your launch! 🚀**

