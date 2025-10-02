# 🔧 Fix Google OAuth Redirect URI Mismatch

## Error
```
Error 400: redirect_uri_mismatch
```

This means the redirect URI in Google Cloud Console doesn't match your Netlify URL.

---

## Quick Fix Steps

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Find Your OAuth 2.0 Client ID
- Look for the client ID that starts with: `804354755189-...`
- Click on it to edit

### 3. Add These EXACT Redirect URIs

**CRITICAL:** Add these exact URIs (copy-paste to avoid typos):

```
https://soulmusicfest.netlify.app/api/auth/callback/google
```

**Also keep your localhost URI for development:**
```
http://localhost:3000/api/auth/callback/google
```

### 4. Authorized JavaScript Origins

Also add these to **Authorized JavaScript origins**:
```
https://soulmusicfest.netlify.app
http://localhost:3000
```

### 5. Save Changes
- Click **SAVE** at the bottom
- Wait 1-2 minutes for changes to propagate

### 6. Test Again
- Clear your browser cache/cookies OR use incognito mode
- Go to: https://soulmusicfest.netlify.app
- Try signing in with Google

---

## Visual Guide

Your Google OAuth Console should look like this:

**Authorized redirect URIs:**
```
✅ http://localhost:3000/api/auth/callback/google
✅ https://soulmusicfest.netlify.app/api/auth/callback/google
```

**Authorized JavaScript origins:**
```
✅ http://localhost:3000
✅ https://soulmusicfest.netlify.app
```

---

## Common Mistakes to Avoid

❌ **Wrong:** `https://soulmusicfest.netlify.app/auth/callback/google`
✅ **Correct:** `https://soulmusicfest.netlify.app/api/auth/callback/google`

❌ **Wrong:** Adding trailing slash: `https://soulmusicfest.netlify.app/`
✅ **Correct:** No trailing slash: `https://soulmusicfest.netlify.app`

❌ **Wrong:** Using HTTP instead of HTTPS for production
✅ **Correct:** Always use HTTPS for Netlify URLs

---

## Still Not Working?

### Check 1: Verify Environment Variables in Netlify
Go to Netlify Dashboard → Site settings → Environment variables

Confirm these are set:
```
NEXTAUTH_URL=https://soulmusicfest.netlify.app
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Check 2: Clear Browser Cache
- Open incognito/private window
- Or clear all cookies for soulmusicfest.netlify.app

### Check 3: Wait for Google Changes
- Google OAuth changes can take 1-5 minutes to propagate
- Try again after a few minutes

### Check 4: Verify Latest Deploy
- Go to Netlify → Deploys
- Confirm the latest deploy with `trustHost: true` is live
- Check deploy logs for any errors

---

## Screenshot Your Google Console

If still having issues, take a screenshot of:
1. Your "Authorized redirect URIs" section
2. Your "Authorized JavaScript origins" section

This will help debug any configuration issues.

---

## Quick Checklist

- [ ] Added `https://soulmusicfest.netlify.app/api/auth/callback/google` to redirect URIs
- [ ] Added `https://soulmusicfest.netlify.app` to JavaScript origins
- [ ] Saved changes in Google Console
- [ ] Waited 2-3 minutes for changes to propagate
- [ ] Cleared browser cache or used incognito mode
- [ ] Verified `NEXTAUTH_URL` is set correctly in Netlify
- [ ] Verified `AUTH_TRUST_HOST=true` is set in Netlify
- [ ] Latest code is deployed on Netlify

---

**After completing these steps, Google OAuth should work! 🎉**
