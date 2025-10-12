# Phase 2A: MIDI Generation with Render.com

## 🎯 Overview

This implementation uses:
- **Python/Basic Pitch** on Render.com for audio-to-MIDI conversion
- **Next.js API** on Netlify as the main app
- **MongoDB** for storing MIDI references
- **Caching** to avoid regenerating existing MIDIs

---

## 📋 Prerequisites

1. ✅ Render.com account with Standard plan
2. ✅ MongoDB Atlas database
3. ✅ Netlify deployment

---

## 🚀 Deployment Steps

### **Step 1: Deploy Python Service to Render**

1. **Create New Web Service on Render:**
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - **Root Directory:** `python`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python midi_service.py`

2. **Configure Environment Variables:**
   ```
   PORT=10000
   PYTHON_VERSION=3.11
   TEMP_DIR=/tmp
   ```

3. **Set Plan:**
   - Select "Standard" plan (your existing plan)
   - Region: Choose closest to your users

4. **Deploy:**
   - Click "Create Web Service"
   - Wait 15-20 minutes for first build
   - Note the service URL: `https://your-service.onrender.com`

---

### **Step 2: Update Next.js Environment Variables**

Add to your `.env.local`:

```bash
# Render MIDI Service
MIDI_SERVICE_URL=https://your-midi-service.onrender.com
```

Add to Netlify environment variables:
- Key: `MIDI_SERVICE_URL`
- Value: `https://your-midi-service.onrender.com`

---

### **Step 3: Update MongoDB Schema**

Your tracks collection will now include:

```javascript
{
  id: string,
  audioUrl: string,
  // ... existing fields
  
  // New MIDI fields
  midiUrl?: string,              // "/midi/track-123.mid"
  midiStatus?: string,           // "not_generated" | "generating" | "completed" | "failed"
  midiGeneratedAt?: Date,
  midiSize?: number,
  midiError?: string
}
```

No migration needed - fields added automatically on first MIDI generation.

---

### **Step 4: Create Public MIDI Directory**

```bash
mkdir -p public/midi
```

Add to `.gitignore`:
```
/public/midi/*.mid
```

---

### **Step 5: Install Dependencies**

```bash
npm install
```

---

### **Step 6: Deploy to Netlify**

```bash
git add .
git commit -m "Add Phase 2A MIDI generation"
git push
```

Netlify will auto-deploy.

---

## 🧪 Testing

### **Test 1: Python Service Health**

```bash
curl https://your-midi-service.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "midi-generation",
  "version": "1.0.0"
}
```

### **Test 2: Generate MIDI for a Track**

1. Open your app
2. Go to a track
3. Click "Sheet Music" tab
4. Click "Generate Sheet Music"
5. Wait 30-90 seconds
6. Should see real transcription!

---

## 📊 How It Works

```
User clicks "Generate Sheet Music"
    ↓
Next.js API (/api/tracks/[id]/generate-midi)
    ↓
Check MongoDB for existing MIDI (cache)
    ↓
If not cached:
    ↓
Call Python service on Render
    ↓
Basic Pitch converts audio → MIDI
    ↓
MIDI file returned to Next.js
    ↓
Saved to /public/midi/
    ↓
URL stored in MongoDB
    ↓
Sheet music viewer loads MIDI
    ↓
Parses MIDI → VexFlow notation
    ↓
Real sheet music displayed!
```

---

## ⚡ Performance

### **First Generation (Cold):**
- MIDI generation: 30-60 seconds
- One-time per track

### **Subsequent Views (Cached):**
- MIDI load: < 1 second
- Instant sheet music display

---

## 💰 Cost Estimate

**Render Standard Plan:**
- Your existing plan
- No additional cost
- Handles 10-50 MIDI generations/hour

**Storage:**
- MIDI files: ~10-50KB each
- 1000 tracks = ~30MB
- Negligible storage cost

---

## 🔧 Troubleshooting

### **Issue: "MIDI service error"**

**Check:**
1. Render service is running: https://your-service.onrender.com/health
2. `MIDI_SERVICE_URL` environment variable is set correctly
3. Check Render logs for Python errors

### **Issue: Timeout**

**Solution:**
- Increase timeout in `generate-midi/route.ts` (currently 120 seconds)
- Or implement async job queue

### **Issue: Out of memory**

**Solution:**
- Limit concurrent requests to 1-2
- Or upgrade Render plan

---

## 🎯 Next Steps After Deployment

1. ✅ Test with a short track (< 1 minute)
2. ✅ Test with full 2:29 track
3. ✅ Verify MIDI caching works
4. ✅ Check sheet music displays correctly
5. ✅ Monitor Render logs for errors

---

## 📝 Future Enhancements

### **Phase 2A Advanced (Optional):**
- ✅ Job queue (Bull + Redis)
- ✅ Progress tracking UI
- ✅ MIDI download button
- ✅ Multiple instrument tracks
- ✅ MIDI editing

---

## ⚠️ Important Notes

1. **First build takes 15-20 minutes** (TensorFlow is large)
2. **Render Standard doesn't sleep** (instant response)
3. **MIDI files are cached** (only generate once per track)
4. **Process one at a time** (prevent memory issues)

---

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Render health check returns 200
2. ✅ "Generate Sheet Music" completes in 30-90 sec
3. ✅ Real melody appears (not C scale demo)
4. ✅ MIDI file exists in `/public/midi/`
5. ✅ Second generation instant (cached)

---

**Ready to deploy? Follow Step 1 and create your Render service!**
