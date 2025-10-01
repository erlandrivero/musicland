# Step 3A: SunoAPI Integration - Testing Guide

## ✅ What's Been Completed

### 1. **SunoAPI Client Utility** (`lib/sunoapi.ts`)
- ✅ Axios-based client with automatic retry logic
- ✅ Bearer token authentication
- ✅ Comprehensive TypeScript interfaces
- ✅ Error handling with exponential backoff
- ✅ Request/response logging
- ✅ Rate limiting support

### 2. **API Routes Created**

#### `/api/auth/validate-api` (GET)
- Validates API key with real SunoAPI
- Returns credit balance if valid
- **No authentication required** (for setup testing)

#### `/api/credits` (GET)
- Fetches real credit balance from SunoAPI
- Updates user's credits in database
- **Requires authentication**

#### `/api/music/generate` (POST)
- Generates music using real SunoAPI
- Supports custom and non-custom modes
- Validates credit balance before generation
- Saves tracks to database
- Deducts 10 credits per generation
- **Requires authentication**

#### `/api/music/status/[id]` (GET)
- Checks generation status from SunoAPI
- Updates track status in database
- Verifies user ownership
- **Requires authentication**

#### `/api/music/download/[id]` (GET)
- Returns download URL for completed tracks
- Supports audio and video downloads
- Verifies user ownership
- **Requires authentication**

#### `/api/test-connection` (GET)
- Comprehensive validation endpoint
- Tests API key validity
- Fetches credits
- Validates generation parameters
- Checks environment configuration
- **No authentication required** (for setup testing)

---

## 🔧 Setup Instructions

### 1. Add SunoAPI Key to `.env.local`

```bash
# Add these lines to your .env.local file
SUNOAPI_KEY=your-actual-api-key-from-sunoapi-com
SUNOAPI_BASE_URL=https://api.sunoapi.com/v1
```

**Get your API key from:** https://sunoapi.com

### 2. Start Development Server

```bash
npm run dev
```

---

## 🧪 Testing Endpoints

### Test 1: Validate API Connection
**No authentication required - Test first!**

```bash
# Using curl
curl http://localhost:3000/api/test-connection

# Using browser
# Navigate to: http://localhost:3000/api/test-connection
```

**Expected Response:**
```json
{
  "success": true,
  "timestamp": "2025-10-01T12:50:00.000Z",
  "summary": {
    "total": 4,
    "passed": 4,
    "failed": 0
  },
  "results": [
    {
      "test": "API Key Validation",
      "status": "success",
      "message": "API key is valid and authenticated",
      "data": { "credits": 100 }
    },
    {
      "test": "Fetch Credits",
      "status": "success",
      "message": "Successfully fetched credit balance",
      "data": {
        "credits": 100,
        "totalCredits": 100,
        "creditsUsed": 0
      }
    },
    {
      "test": "Generation Request Validation",
      "status": "success",
      "message": "Generation request parameters are valid"
    },
    {
      "test": "Environment Configuration",
      "status": "success",
      "message": "All required environment variables are configured"
    }
  ]
}
```

### Test 2: Validate API Key
**No authentication required**

```bash
curl http://localhost:3000/api/auth/validate-api
```

**Expected Response:**
```json
{
  "valid": true,
  "message": "API key is valid",
  "credits": 100
}
```

### Test 3: Get Credits
**Requires authentication - Sign in first!**

```bash
# Sign in at: http://localhost:3000
# Then test in browser console:
fetch('/api/credits')
  .then(r => r.json())
  .then(console.log)
```

**Expected Response:**
```json
{
  "credits": 100,
  "totalCredits": 100,
  "creditsUsed": 0
}
```

### Test 4: Generate Music (Non-Custom Mode)
**Requires authentication**

```bash
# In browser console after signing in:
fetch('/api/music/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    custom_mode: false,
    gpt_description_prompt: 'A happy upbeat pop song about coding',
    mv: 'chirp-v3-5',
    make_instrumental: false
  })
})
  .then(r => r.json())
  .then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "tracks": [
    {
      "id": "abc123",
      "title": "Generated Song",
      "status": "pending",
      "audioUrl": null,
      "videoUrl": null
    }
  ],
  "creditsUsed": 10
}
```

### Test 5: Generate Music (Custom Mode)
**Requires authentication**

```bash
# In browser console after signing in:
fetch('/api/music/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    custom_mode: true,
    prompt: 'Verse 1:\nCoding all day and night\nMaking everything right\n\nChorus:\nWe are developers, we are strong',
    tags: 'pop, upbeat, electronic',
    title: 'Developer Anthem',
    mv: 'chirp-v3-5',
    make_instrumental: false
  })
})
  .then(r => r.json())
  .then(console.log)
```

### Test 6: Check Generation Status
**Requires authentication**

```bash
# Replace {id} with actual track ID from generation response
fetch('/api/music/status/{id}')
  .then(r => r.json())
  .then(console.log)
```

**Expected Response (Completed):**
```json
{
  "id": "abc123",
  "status": "completed",
  "audioUrl": "https://cdn.sunoapi.com/...",
  "videoUrl": "https://cdn.sunoapi.com/...",
  "title": "Developer Anthem",
  "duration": 180
}
```

### Test 7: Download Track
**Requires authentication**

```bash
# Replace {id} with actual track ID
fetch('/api/music/download/{id}?type=audio')
  .then(r => r.json())
  .then(console.log)
```

**Expected Response:**
```json
{
  "downloadUrl": "https://cdn.sunoapi.com/...",
  "title": "Developer Anthem",
  "type": "audio"
}
```

---

## 🔍 Verification Checklist

### ✅ API Key Validation
- [ ] `/api/test-connection` returns success
- [ ] `/api/auth/validate-api` returns valid: true
- [ ] Real credit balance is displayed

### ✅ Credits Management
- [ ] `/api/credits` returns actual balance from SunoAPI
- [ ] User credits are updated in database
- [ ] Credits are synced with SunoAPI

### ✅ Music Generation
- [ ] Non-custom mode generates music successfully
- [ ] Custom mode generates music successfully
- [ ] Credits are deducted (10 per generation)
- [ ] Tracks are saved to database
- [ ] Generation returns track IDs

### ✅ Status Tracking
- [ ] Status endpoint returns real generation status
- [ ] Status updates in database
- [ ] Completed tracks have audio/video URLs

### ✅ Error Handling
- [ ] Invalid API key returns proper error
- [ ] Insufficient credits returns 402 error
- [ ] Invalid parameters return validation errors
- [ ] Network errors are handled gracefully
- [ ] Unauthorized requests return 401

### ✅ No Mock Data
- [ ] All responses use real SunoAPI data
- [ ] No hardcoded or fake responses
- [ ] Actual API calls are made for all operations

---

## 🐛 Troubleshooting

### Error: "API key is not configured"
**Solution:** Add `SUNOAPI_KEY` to `.env.local` file

### Error: "Invalid API key"
**Solution:** 
1. Verify your API key at https://sunoapi.com
2. Check for extra spaces in `.env.local`
3. Restart development server after adding key

### Error: "Insufficient credits"
**Solution:** 
1. Check your credit balance at https://sunoapi.com
2. Purchase additional credits if needed
3. Each generation costs 10 credits

### Error: "Unauthorized"
**Solution:** 
1. Sign in at http://localhost:3000
2. Ensure session is active
3. Check browser cookies are enabled

### Error: "Network error"
**Solution:**
1. Check internet connection
2. Verify SunoAPI service status
3. Check firewall settings

---

## 📊 API Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Request completed successfully |
| 201 | Created | Music generation started |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Sign in required |
| 402 | Payment Required | Insufficient credits |
| 403 | Forbidden | Access denied to resource |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Check server logs |

---

## 🎯 Next Steps

After verifying all tests pass:

1. **Proceed to Step 3B:** Credits Management System
   - Real-time credit display in header
   - Credit usage tracking
   - Low credit warnings
   - Credit purchase flow

2. **Step 4:** Music Generation UI
   - Generation form with validation
   - Real-time status updates
   - Audio player integration
   - Track management

---

## 📝 Notes

- **All API calls use real SunoAPI** - No mock data
- **Credits are deducted** - Each generation costs 10 credits
- **Generation is asynchronous** - Use status endpoint to check progress
- **Retry logic included** - Transient failures are automatically retried
- **Rate limiting respected** - Client handles rate limits gracefully

---

## 🔗 Useful Links

- **SunoAPI Documentation:** https://sunoapi.com/docs
- **Get API Key:** https://sunoapi.com/dashboard
- **Check Credits:** https://sunoapi.com/credits
- **Model Versions:** chirp-v3-5, chirp-v4, chirp-v4-5, chirp-v5
