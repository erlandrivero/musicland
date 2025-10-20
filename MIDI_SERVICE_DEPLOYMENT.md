# MIDI Service Deployment Guide

**Date:** October 20, 2025
**Status:** ⚠️ Service Not Deployed

---

## 🚨 **Current Issue**

You're seeing **504 Gateway Timeout** errors because:
- ✅ Python MIDI service code exists (`python/midi_service.py`)
- ❌ **Service is NOT deployed** to Render.com
- ❌ `MIDI_SERVICE_URL` environment variable not set

---

## 🚀 **Quick Deployment to Render.com**

### **Step 1: Create Render Account**
1. Go to https://render.com
2. Sign up or log in with your GitHub account

### **Step 2: Create New Web Service**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `erlandrivero/musicland`
3. Configure service:

```
Name:              musicland-midi-service
Root Directory:    python
Environment:       Python 3
Build Command:     pip install -r requirements.txt
Start Command:     python midi_service.py
```

### **Step 3: Set Environment Variables**

In Render dashboard, add these environment variables:

```
PORT=5000
TEMP_DIR=/tmp
```

### **Step 4: Deploy**

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy the service URL (e.g., `https://musicland-midi-service.onrender.com`)

---

## 🔧 **Configure Next.js App**

### **Option A: Local Development (.env.local)**

Create/update `.env.local`:

```bash
MIDI_SERVICE_URL=https://musicland-midi-service.onrender.com
```

### **Option B: Production (Netlify)**

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add:
   - Key: `MIDI_SERVICE_URL`
   - Value: `https://musicland-midi-service.onrender.com`
4. Redeploy site

---

## ✅ **Verify Deployment**

### **Test Health Check**

```bash
curl https://musicland-midi-service.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "midi-generation",
  "version": "1.0.0"
}
```

### **Test MIDI Generation**

From your app:
1. Go to any track
2. Click **MIDI tab**
3. Select quality (Standard recommended)
4. Click **"Generate MIDI"**
5. Wait 30-90 seconds depending on quality

---

## 📋 **Requirements File (python/requirements.txt)**

Make sure this exists in `python/requirements.txt`:

```
Flask==3.0.0
flask-cors==4.0.0
basic-pitch==0.3.2
tensorflow==2.13.1
numpy==1.24.3
librosa==0.10.1
scipy==1.11.4
resampy==0.4.2
requests==2.31.0
```

---

## 🐛 **Troubleshooting**

### **Error: 504 Gateway Timeout**

**Cause:** MIDI service not deployed or `MIDI_SERVICE_URL` not set

**Fix:**
1. Deploy Python service to Render (see above)
2. Set `MIDI_SERVICE_URL` environment variable
3. Restart your Next.js app

---

### **Error: Connection Refused**

**Cause:** MIDI service URL is incorrect

**Fix:**
1. Check Render dashboard for correct URL
2. Update `MIDI_SERVICE_URL`
3. Restart app

---

### **Error: MIDI Generation Takes Too Long**

**Cause:** Using "high" quality or large audio file

**Fix:**
1. Use "standard" quality (60 seconds)
2. Ensure audio file is MP3 format
3. Check file size (< 10 MB recommended)

---

## 💰 **Render Pricing**

- **Free Tier**: 750 hours/month (enough for testing)
- **Starter**: $7/month (recommended for production)
- **Cold starts**: Free tier services sleep after 15 min of inactivity

---

## 🔐 **Security Notes**

- Service is publicly accessible (no authentication)
- **Recommendation**: Add API key authentication for production
- Rate limiting is not implemented (add if needed)

---

## 📊 **Expected Performance**

| Quality | Processing Time | Render CPU Usage |
|---------|----------------|------------------|
| Fast    | 20-30 seconds  | ~50% CPU         |
| Standard| 40-60 seconds  | ~70% CPU         |
| High    | 60-90 seconds  | ~90% CPU         |

---

## ✅ **Quick Start Commands**

```bash
# Test service locally (optional)
cd python
pip install -r requirements.txt
python midi_service.py

# Service will run on http://localhost:5000

# Test health check
curl http://localhost:5000/health
```

---

## 🎯 **Next Steps After Deployment**

1. ✅ Deploy Python service to Render
2. ✅ Set `MIDI_SERVICE_URL` in Netlify
3. ✅ Test MIDI generation with a real song
4. ✅ Try all 3 quality levels
5. ✅ Check sheet music quality

---

## 📞 **Support**

**Render Issues:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**Basic Pitch Issues:**
- GitHub: https://github.com/spotify/basic-pitch
- Docs: https://basicpitch.spotify.com

---

## 🎉 **Once Deployed**

Your MIDI feature will be fully functional:
- ✅ Generate MIDI from audio
- ✅ 3 quality levels (Fast/Standard/High)
- ✅ Download MIDI files
- ✅ Generate sheet music from MIDI
- ✅ Professional notation with VexFlow

**The 504 errors will be fixed!** 🚀
