# 🔐 Google OAuth Client Setup for Netlify

## Step-by-Step Guide to Create New OAuth Client

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Create OAuth Client ID

1. Click **"+ CREATE CREDENTIALS"**
2. Select **"OAuth client ID"**
3. Choose **"Web application"**

### 3. Configure the OAuth Client

#### **Name:**
```
AI Music Studio - Production
```

#### **Authorized JavaScript origins:**
Add these TWO origins:
```
http://localhost:3000
https://soulmusicfest.netlify.app
```

#### **Authorized redirect URIs:**
Add these TWO URIs:
```
http://localhost:3000/api/auth/callback/google
https://soulmusicfest.netlify.app/api/auth/callback/google
```

### 4. Create and Save Credentials

1. Click **"CREATE"**
2. A popup will show your **Client ID** and **Client Secret**
3. **IMPORTANT:** Copy both values immediately

---

## Update Environment Variables

### In Your Local `.env.local`:
```env
GOOGLE_CLIENT_ID=your-new-client-id-here
GOOGLE_CLIENT_SECRET=your-new-client-secret-here
```

### In Netlify Dashboard:
Go to: https://app.netlify.com → Your Site → Site settings → Environment variables

Update these variables:
```
GOOGLE_CLIENT_ID=your-new-client-id-here
GOOGLE_CLIENT_SECRET=your-new-client-secret-here
```

---

## Redeploy After Updating

### Option 1: Trigger Manual Deploy
- Go to Netlify → Deploys
- Click **"Trigger deploy"** → **"Deploy site"**

### Option 2: Push Empty Commit
```bash
git commit --allow-empty -m "Update Google OAuth credentials"
git push
```

---

## Complete Configuration Checklist

### ✅ Google Cloud Console
- [ ] Created new OAuth 2.0 Client ID
- [ ] Added `http://localhost:3000` to JavaScript origins
- [ ] Added `https://soulmusicfest.netlify.app` to JavaScript origins
- [ ] Added `http://localhost:3000/api/auth/callback/google` to redirect URIs
- [ ] Added `https://soulmusicfest.netlify.app/api/auth/callback/google` to redirect URIs
- [ ] Copied Client ID and Client Secret

### ✅ Local Environment
- [ ] Updated `GOOGLE_CLIENT_ID` in `.env.local`
- [ ] Updated `GOOGLE_CLIENT_SECRET` in `.env.local`
- [ ] Tested locally: `npm run dev`
- [ ] Verified Google sign-in works on localhost

### ✅ Netlify Environment
- [ ] Updated `GOOGLE_CLIENT_ID` in Netlify Dashboard
- [ ] Updated `GOOGLE_CLIENT_SECRET` in Netlify Dashboard
- [ ] Verified `NEXTAUTH_URL=https://soulmusicfest.netlify.app`
- [ ] Verified `AUTH_TRUST_HOST=true`
- [ ] Triggered new deployment
- [ ] Waited for deployment to complete

### ✅ Testing
- [ ] Opened incognito/private browser window
- [ ] Visited https://soulmusicfest.netlify.app
- [ ] Clicked "Sign in with Google"
- [ ] Successfully authenticated
- [ ] Redirected back to app

---

## Important Notes

### ⚠️ Common Mistakes to Avoid

1. **Missing `/api/` in redirect URI**
   - ❌ Wrong: `https://soulmusicfest.netlify.app/auth/callback/google`
   - ✅ Correct: `https://soulmusicfest.netlify.app/api/auth/callback/google`

2. **Trailing slashes**
   - ❌ Wrong: `https://soulmusicfest.netlify.app/`
   - ✅ Correct: `https://soulmusicfest.netlify.app`

3. **HTTP vs HTTPS**
   - ❌ Wrong: `http://soulmusicfest.netlify.app` (production)
   - ✅ Correct: `https://soulmusicfest.netlify.app` (production)
   - ✅ Correct: `http://localhost:3000` (development)

4. **Forgetting to redeploy**
   - After updating environment variables in Netlify, you MUST trigger a new deployment

### 🔒 Security Best Practices

- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ Keep Client Secret confidential
- ✅ Use different OAuth clients for dev/staging/production if needed
- ✅ Regularly rotate secrets for production apps

---

## Quick Copy-Paste Values

### For Google Console Setup:

**JavaScript Origins:**
```
http://localhost:3000
https://soulmusicfest.netlify.app
```

**Redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://soulmusicfest.netlify.app/api/auth/callback/google
```

---

## Troubleshooting

### If sign-in still fails after setup:

1. **Wait 2-3 minutes** - Google OAuth changes take time to propagate
2. **Clear browser cache** or use incognito mode
3. **Check Netlify logs** - Go to Deploys → Function logs
4. **Verify environment variables** - Make sure they're set in Netlify
5. **Check deployment status** - Ensure latest code is deployed

### Check Environment Variables Are Loaded:
You can verify by checking the Netlify function logs during a sign-in attempt. The `debug: true` setting in `auth.ts` will show detailed logs.

---

**After completing these steps, your Google OAuth should work perfectly! 🎉**
