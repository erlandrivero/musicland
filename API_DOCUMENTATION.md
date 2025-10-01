# API Documentation - AI Music Studio

## Overview

This document describes all API endpoints available in the AI Music Studio application. All endpoints use real SunoAPI integration with no mock data.

---

## Authentication

Most endpoints require authentication using NextAuth.js session tokens. Protected endpoints will return `401 Unauthorized` if no valid session exists.

**Authentication Methods:**
- Google OAuth 2.0
- Magic Link (Email)

---

## Base URL

```
Development: http://localhost:3000
Production: https://your-app.netlify.app
```

---

## Endpoints

### 1. Validate API Key

**Endpoint:** `GET /api/auth/validate-api`

**Description:** Validates the SunoAPI key configured in environment variables.

**Authentication:** Not required

**Response:**
```json
{
  "valid": true,
  "message": "API key is valid",
  "credits": 100
}
```

**Error Response:**
```json
{
  "valid": false,
  "message": "Invalid API key"
}
```

---

### 2. Get Credits

**Endpoint:** `GET /api/credits`

**Description:** Fetches the current credit balance from SunoAPI and updates the user's database record.

**Authentication:** Required

**Response:**
```json
{
  "credits": 100,
  "totalCredits": 100,
  "creditsUsed": 0
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to check credits"
}
```

**500 Internal Error:**
```json
{
  "error": "INTERNAL_ERROR",
  "message": "Failed to fetch credits"
}
```

---

### 3. Generate Music

**Endpoint:** `POST /api/music/generate`

**Description:** Generates music using SunoAPI. Supports both custom and non-custom modes.

**Authentication:** Required

**Request Body (Non-Custom Mode):**
```json
{
  "custom_mode": false,
  "gpt_description_prompt": "A happy upbeat pop song about coding",
  "mv": "chirp-v3-5",
  "make_instrumental": false,
  "projectId": "optional-project-id"
}
```

**Request Body (Custom Mode):**
```json
{
  "custom_mode": true,
  "prompt": "Verse 1:\nCoding all day...\n\nChorus:\nWe are developers",
  "tags": "pop, upbeat, electronic",
  "title": "Developer Anthem",
  "mv": "chirp-v3-5",
  "make_instrumental": false,
  "projectId": "optional-project-id"
}
```

**Parameters:**
- `custom_mode` (boolean, required): Whether to use custom mode
- `gpt_description_prompt` (string, required if non-custom): Description for AI to generate from
- `prompt` (string, required if custom): Custom lyrics
- `tags` (string, required if custom): Music style tags (comma-separated)
- `title` (string, optional): Song title
- `mv` (string, required): Model version (chirp-v3-5, chirp-v4, chirp-v4-5, chirp-v5)
- `make_instrumental` (boolean, optional): Generate instrumental version
- `projectId` (string, optional): Associate with existing project

**Response:**
```json
{
  "success": true,
  "tracks": [
    {
      "id": "abc123def456",
      "title": "Developer Anthem",
      "status": "pending",
      "audioUrl": null,
      "videoUrl": null
    },
    {
      "id": "xyz789ghi012",
      "title": "Developer Anthem",
      "status": "pending",
      "audioUrl": null,
      "videoUrl": null
    }
  ],
  "creditsUsed": 10
}
```

**Note:** Suno typically generates 2 songs per request. Use the status endpoint to check when they're ready.

**Error Responses:**

**400 Validation Error:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Model version (mv) is required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to generate music"
}
```

**402 Insufficient Credits:**
```json
{
  "error": "INSUFFICIENT_CREDITS",
  "message": "You need at least 10 credits to generate music"
}
```

---

### 4. Check Generation Status

**Endpoint:** `GET /api/music/status/[id]`

**Description:** Checks the generation status of a specific track from SunoAPI.

**Authentication:** Required

**URL Parameters:**
- `id` (string): Track ID returned from generation endpoint

**Response (Pending):**
```json
{
  "id": "abc123def456",
  "status": "pending",
  "audioUrl": null,
  "videoUrl": null,
  "title": null,
  "duration": null
}
```

**Response (Processing):**
```json
{
  "id": "abc123def456",
  "status": "processing",
  "audioUrl": null,
  "videoUrl": null,
  "title": "Developer Anthem",
  "duration": null
}
```

**Response (Completed):**
```json
{
  "id": "abc123def456",
  "status": "completed",
  "audioUrl": "https://cdn.sunoapi.com/audio/abc123.mp3",
  "videoUrl": "https://cdn.sunoapi.com/video/abc123.mp4",
  "title": "Developer Anthem",
  "duration": 180
}
```

**Response (Failed):**
```json
{
  "id": "abc123def456",
  "status": "failed",
  "audioUrl": null,
  "videoUrl": null,
  "title": null,
  "duration": null,
  "error": "Generation failed due to content policy violation"
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to check generation status"
}
```

**403 Forbidden:**
```json
{
  "error": "FORBIDDEN",
  "message": "You do not have access to this track"
}
```

**404 Not Found:**
```json
{
  "error": "NOT_FOUND",
  "message": "Track not found"
}
```

---

### 5. Download Track

**Endpoint:** `GET /api/music/download/[id]?type=audio`

**Description:** Returns the download URL for a completed track.

**Authentication:** Required

**URL Parameters:**
- `id` (string): Track ID

**Query Parameters:**
- `type` (string, optional): Download type - "audio" or "video" (default: "audio")

**Response:**
```json
{
  "downloadUrl": "https://cdn.sunoapi.com/audio/abc123.mp3",
  "title": "Developer Anthem",
  "type": "audio"
}
```

**Error Responses:**

**400 Not Ready:**
```json
{
  "error": "NOT_READY",
  "message": "Track is not ready for download yet"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to download tracks"
}
```

**403 Forbidden:**
```json
{
  "error": "FORBIDDEN",
  "message": "You do not have access to this track"
}
```

**404 Not Found:**
```json
{
  "error": "NOT_FOUND",
  "message": "Track not found"
}
```

**404 No Audio:**
```json
{
  "error": "NO_AUDIO",
  "message": "No audio file available for this track"
}
```

---

### 6. Test Connection

**Endpoint:** `GET /api/test-connection`

**Description:** Comprehensive endpoint to validate API configuration and connectivity.

**Authentication:** Not required

**Response:**
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
      "data": {
        "credits": 100
      }
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
      "message": "Generation request parameters are valid",
      "data": {
        "note": "Actual generation not performed to preserve credits",
        "validatedRequest": {
          "custom_mode": false,
          "gpt_description_prompt": "A happy upbeat pop song about coding",
          "mv": "chirp-v3-5",
          "make_instrumental": false
        }
      }
    },
    {
      "test": "Environment Configuration",
      "status": "success",
      "message": "All required environment variables are configured",
      "data": {
        "configured": [
          "SUNOAPI_KEY",
          "SUNOAPI_BASE_URL",
          "DATABASE_URL",
          "NEXTAUTH_SECRET"
        ]
      }
    }
  ]
}
```

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `Unauthorized` | 401 | User not authenticated |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `INSUFFICIENT_CREDITS` | 402 | Not enough credits |
| `API_ERROR` | 500 | SunoAPI service error |
| `NETWORK_ERROR` | 500 | Network connectivity issue |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

The SunoAPI client includes automatic retry logic with exponential backoff for transient failures (5xx errors). Maximum 3 retries per request.

---

## Model Versions

Available model versions for the `mv` parameter:

| Model | Description | Quality |
|-------|-------------|---------|
| `chirp-v3-5` | Stable, fast generation | Good |
| `chirp-v4` | Improved quality | Better |
| `chirp-v4-5` | Enhanced audio quality | Great |
| `chirp-v4-5-plus` | Premium quality | Excellent |
| `chirp-v5` | Latest model | Best |

**Note:** All models cost 10 credits per generation (typically 2 songs).

---

## Credit Costs

| Operation | Credits | Notes |
|-----------|---------|-------|
| Music Generation | 10 | Returns 2 songs (Suno/Riffusion) or 1 song (Nuro) |
| Lyrics Generation | 2 | Text only |
| Stem Separation | 10-50 | Depends on complexity |

---

## Best Practices

1. **Check Credits First:** Always verify credit balance before generation
2. **Poll Status:** Use status endpoint to check generation progress (typically 30-60 seconds)
3. **Handle Errors:** Implement proper error handling for all API calls
4. **Validate Input:** Validate user input before sending to API
5. **Store Track IDs:** Save track IDs immediately after generation
6. **Retry Logic:** Client includes automatic retries, but implement UI-level retries for user actions

---

## Example Workflows

### Complete Generation Workflow

```javascript
// 1. Check credits
const credits = await fetch('/api/credits').then(r => r.json());
if (credits.credits < 10) {
  alert('Insufficient credits');
  return;
}

// 2. Generate music
const generation = await fetch('/api/music/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    custom_mode: false,
    gpt_description_prompt: 'A happy upbeat pop song',
    mv: 'chirp-v3-5'
  })
}).then(r => r.json());

// 3. Poll for completion
const trackId = generation.tracks[0].id;
const pollStatus = async () => {
  const status = await fetch(`/api/music/status/${trackId}`).then(r => r.json());
  
  if (status.status === 'completed') {
    console.log('Audio URL:', status.audioUrl);
    return status;
  } else if (status.status === 'failed') {
    console.error('Generation failed:', status.error);
    return null;
  } else {
    // Still processing, check again in 5 seconds
    setTimeout(pollStatus, 5000);
  }
};

pollStatus();
```

---

## Support

For issues with:
- **API Integration:** Check `STEP_3A_TESTING.md`
- **SunoAPI Service:** Visit https://sunoapi.com/support
- **Authentication:** Check NextAuth.js configuration
- **Database:** Verify Prisma schema and migrations
