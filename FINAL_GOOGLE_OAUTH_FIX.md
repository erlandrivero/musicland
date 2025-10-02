# 🔧 FINAL Google OAuth Fix - Add Redirect URIs

## The Issue
Your NEW OAuth client (`804354755189-pqtv2v5ftks7fa31pf53njv99e6do9ad`) doesn't have the redirect URIs configured yet.

---

## Quick Fix (5 minutes)

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Find Your NEW OAuth Client
Look for Client ID: `804354755189-pqtv2v5ftks7fa31pf53njv99e6do9ad`
- Click on it to edit

### 3. Add Authorized JavaScript Origins

Click **"+ ADD URI"** under "Authorized JavaScript origins" and add:

```
http://localhost:3000
```

Click **"+ ADD URI"** again and add:

```
https://soulmusicfest.netlify.app
```

### 4. Add Authorized Redirect URIs

Click **"+ ADD URI"** under "Authorized redirect URIs" and add:

```
http://localhost:3000/api/auth/callback/google
```

Click **"+ ADD URI"** again and add:

```
https://soulmusicfest.netlify.app/api/auth/callback/google
```

### 5. Save Changes
- Scroll down and click **"SAVE"**
- Wait 2-3 minutes for Google to propagate the changes

### 6. Test Again
1. Open a **new incognito/private window**
2. Go to: https://soulmusicfest.netlify.app
3. Click "Sign in with Google"
4. Should work now! ✅

---

## Visual Checklist

Your Google OAuth client should have:

### ✅ Authorized JavaScript origins (2 total):
```
1. http://localhost:3000
2. https://soulmusicfest.netlify.app
```

### ✅ Authorized redirect URIs (2 total):
```
1. http://localhost:3000/api/auth/callback/google
2. https://soulmusicfest.netlify.app/api/auth/callback/google
```

---

## Important Notes

⚠️ **Make sure you're editing the CORRECT OAuth client:**
- Client ID: `804354755189-pqtv2v5ftks7fa31pf53njv99e6do9ad`
- NOT the old one: `804354755189-h9k983lst54bfemp42phrvj1422viq3i`

⚠️ **Common mistakes:**
- Missing `/api/` in the redirect URI
- Adding trailing slashes
- Using HTTP instead of HTTPS for Netlify URL

⚠️ **After saving:**
- Wait 2-3 minutes for changes to take effect
- Use incognito mode to avoid cached errors
- Clear browser cookies if needed

---

## Screenshot Your Configuration

If it still doesn't work after following these steps, take a screenshot of:
1. The "Authorized JavaScript origins" section
2. The "Authorized redirect URIs" section

This will help verify the configuration is correct.

---

**This should be the final fix! 🎉**
