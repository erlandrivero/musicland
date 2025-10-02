# ⚠️ URGENT: Update Netlify Environment Variables

## The Problem
Netlify is still using your OLD Google OAuth credentials. You need to update them with the NEW ones.

---

## Step-by-Step Fix

### 1. Go to Netlify Dashboard
Visit: https://app.netlify.com

### 2. Navigate to Your Site
- Find: **soulmusicfest**
- Click on it

### 3. Go to Environment Variables
- Click **Site settings** (in the top menu)
- Scroll down to **Environment variables** (in the left sidebar)
- Click **Environment variables**

### 4. Update These Two Variables

#### Update `GOOGLE_CLIENT_ID`:
1. Find `GOOGLE_CLIENT_ID` in the list
2. Click the **three dots** (⋮) next to it
3. Click **Edit**
4. Replace with:
   ```
   804354755189-pqtv2v5ftks7fa31pf53njv99e6do9ad.apps.googleusercontent.com
   ```
5. Click **Save**

#### Update `GOOGLE_CLIENT_SECRET`:
1. Find `GOOGLE_CLIENT_SECRET` in the list
2. Click the **three dots** (⋮) next to it
3. Click **Edit**
4. Replace with:
   ```
   <your-google-client-secret>
   ```
5. Click **Save**

### 5. Verify All Required Variables Are Set

Make sure these are ALL present in Netlify:

```
✅ NEXTAUTH_URL=https://soulmusicfest.netlify.app
✅ NEXTAUTH_SECRET=<your-nextauth-secret>
✅ AUTH_TRUST_HOST=true
✅ GOOGLE_CLIENT_ID=804354755189-pqtv2v5ftks7fa31pf53njv99e6do9ad.apps.googleusercontent.com
✅ GOOGLE_CLIENT_SECRET=<your-google-client-secret>
✅ MONGODB_URI=<your-mongodb-uri>
✅ SUNOAPI_KEY=<your-sunoapi-key>
✅ SUNOAPI_BASE_URL=https://api.sunoapi.com/api/v1
```

### 6. Trigger a New Deployment

After updating the environment variables:

**Option A: Manual Deploy**
1. Go to **Deploys** tab
2. Click **Trigger deploy** button
3. Select **Deploy site**

**Option B: Clear Cache and Deploy**
1. Go to **Deploys** tab
2. Click **Trigger deploy** button
3. Select **Clear cache and deploy site** (RECOMMENDED)

### 7. Wait for Deployment
- Watch the deployment progress (usually 1-3 minutes)
- Wait until it shows **"Published"**

### 8. Test Authentication
1. Open a **new incognito/private window**
2. Go to: https://soulmusicfest.netlify.app
3. Click **Sign in with Google**
4. Should work now! ✅

---

## Quick Copy-Paste Values

### New Client ID:
```
804354755189-pqtv2v5ftks7fa31pf53njv99e6do9ad.apps.googleusercontent.com
```

### New Client Secret:
```
<your-google-client-secret>
```

---

## Troubleshooting

### If you still see the old Client ID in the error:
1. Make sure you clicked **Save** after editing each variable
2. Make sure you triggered a **new deployment** after updating
3. Clear your browser cache or use incognito mode
4. Wait 2-3 minutes for the deployment to complete

### To verify the deployment is using new credentials:
1. Check the deployment timestamp in Netlify
2. Make sure it's AFTER you updated the environment variables
3. Check the function logs during sign-in attempt

---

## Important Notes

⚠️ **Environment variables are only loaded during deployment**
- Changing env vars does NOT automatically update your live site
- You MUST trigger a new deployment after changing env vars

⚠️ **Clear cache deployment is recommended**
- This ensures no old cached values are used
- Guarantees fresh build with new credentials

---

**After completing these steps, your Google OAuth will work! 🎉**
