# 🔧 Netlify OAuth Configuration Fix

## Problem
Getting `ERR_FAILED` error when trying to sign in with Google on Netlify because OAuth is configured for `http://localhost:3000` instead of your production HTTPS URL.

## Solution Steps

### 1. Your Netlify URL
Your site is deployed at:
- **`https://soulmusicfest.netlify.app`**

### 2. Configure Environment Variables in Netlify

1. **Go to Netlify Dashboard**
   - Navigate to your site: https://app.netlify.com
   - Click on **Site settings** → **Environment variables**

2. **Add/Update These Variables:**

```env
# Required - YOUR PRODUCTION URL
NEXTAUTH_URL=https://soulmusicfest.netlify.app
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
AUTH_TRUST_HOST=true

# Google OAuth (copy from your .env.local)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (MongoDB - copy from your .env.local)
MONGODB_URI=your-mongodb-connection-string

# SunoAPI (copy from your .env.local)
SUNOAPI_KEY=your-sunoapi-key
SUNOAPI_BASE_URL=https://api.sunoapi.com/api/v1

# Email (Optional - if using magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=your-resend-api-key
AUTH_RESEND_KEY=your-resend-api-key
```

**CRITICAL:** 
- ✅ `NEXTAUTH_URL` must be: `https://soulmusicfest.netlify.app`
- ✅ `AUTH_TRUST_HOST` must be set to `true` (required for Netlify)
- ⚠️ Copy the other values from your local `.env.local` file

### 3. Update Google OAuth Redirect URIs

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Select your project

2. **Navigate to Credentials**
   - APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID

3. **Add Authorized Redirect URIs**
   
   Add these EXACT URIs:
   ```
   https://soulmusicfest.netlify.app/api/auth/callback/google
   https://soulmusicfest.netlify.app/api/auth/callback/resend
   ```

4. **Keep localhost for development:**
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/resend
   ```

5. **Save Changes**

### 4. Commit and Push Code Changes

**IMPORTANT:** I've made code changes that fix the auth issue:

```bash
# Commit the auth.ts and netlify.toml changes
git add auth.ts netlify.toml
git commit -m "Fix: Add trustHost for Netlify deployment"
git push
```

This will automatically trigger a new deployment with the fixes.

### 5. Verify Deployment

After the deployment completes (usually 1-3 minutes):

1. **Check Netlify Deploy Logs**
   - Go to **Deploys** tab
   - Click on the latest deploy
   - Verify build succeeded

2. **Verify Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Confirm `NEXTAUTH_URL` and `AUTH_TRUST_HOST` are set

### 5. Test Authentication

1. Visit your Netlify site: `https://your-site-name.netlify.app`
2. Click **Sign In**
3. Try signing in with Google
4. You should now be redirected properly!

## Common Issues & Solutions

### Issue: Still getting localhost redirect
**Solution:** Clear your browser cache and cookies, or try in an incognito window.

### Issue: "Configuration" error
**Solution:** 
- Verify `NEXTAUTH_URL` is set correctly in Netlify
- Ensure `NEXTAUTH_SECRET` is set
- Check that all required environment variables are present

### Issue: "Access blocked" from Google
**Solution:**
- Verify the redirect URI in Google Console exactly matches your Netlify URL
- Make sure you saved the changes in Google Console
- Wait a few minutes for Google's changes to propagate

### Issue: Database connection errors
**Solution:**
- Verify `MONGODB_URI` is correct
- Ensure your MongoDB instance allows connections from Netlify's IP addresses
- For MongoDB Atlas, add `0.0.0.0/0` to IP whitelist (or Netlify's specific IPs)

## Verification Checklist

- [ ] `NEXTAUTH_URL` in Netlify uses HTTPS and matches your domain
- [ ] `NEXTAUTH_SECRET` is set in Netlify
- [ ] Google OAuth redirect URIs include your Netlify domain
- [ ] All environment variables are set in Netlify
- [ ] Site has been redeployed after env var changes
- [ ] Tested sign-in in incognito/private window
- [ ] Database connection is working

## Quick Reference: Environment Variable Locations

### Development (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
```

### Production (Netlify Dashboard)
```env
NEXTAUTH_URL=https://soulmusicfest.netlify.app
```

### Google OAuth Console
```
Authorized redirect URIs:
- http://localhost:3000/api/auth/callback/google (dev)
- https://soulmusicfest.netlify.app/api/auth/callback/google (prod)
```

## Need More Help?

### Check Netlify Logs
1. Go to Netlify Dashboard
2. Click on **Deploys**
3. Click on the latest deploy
4. Check **Function logs** for any errors

### Enable Debug Mode
The app already has `debug: true` in the auth config, so check browser console for detailed error messages.

### Test Environment Variables
You can verify your environment variables are set by checking the Netlify function logs during a sign-in attempt.

---

**After following these steps, your Google OAuth should work correctly on Netlify! 🎉**
