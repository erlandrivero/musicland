# FFmpeg Video Generation Implementation Guide

**Status**: Planned for future implementation
**Estimated Time**: 1-1.5 days
**Cost**: $0 (uses free tiers)

## Overview

Generate MP4 video files from audio tracks using FFmpeg on Render.com backend. Videos combine static album art with audio, creating shareable video content.

## Architecture

```
Frontend (Netlify)
    ↓ Request video generation
Backend API (Render.com)
    ↓ Trigger video job
Video Service (Render.com)
    ↓ FFmpeg processes audio + image
    ↓ Upload to Cloudinary
Database (MongoDB)
    ↓ Store video URL
Frontend displays video
```

## Implementation Steps

### 1. Backend Setup (4-6 hours)

#### Install FFmpeg on Render

**Option A: Docker (Recommended)**
```dockerfile
# Add to Dockerfile or use build command
FROM python:3.9

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy application
COPY . /app
WORKDIR /app

# Install Python dependencies
RUN pip install -r requirements.txt

CMD ["python", "video_service.py"]
```

**Option B: Buildpack**
```bash
# Add to render.yaml
services:
  - type: web
    name: video-service
    env: python
    buildCommand: apt-get install -y ffmpeg && pip install -r requirements.txt
```

#### Install Cloudinary SDK

```bash
# requirements.txt
cloudinary==1.36.0
```

```python
# config.py
import cloudinary
import cloudinary.uploader

cloudinary.config(
  cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME'),
  api_key = os.environ.get('CLOUDINARY_API_KEY'),
  api_secret = os.environ.get('CLOUDINARY_API_SECRET')
)
```

### 2. Video Generation Service (2-3 hours)

```python
# services/video_generator.py
import subprocess
import os
import requests
import cloudinary.uploader
from pymongo import MongoClient

class VideoGenerator:
    def __init__(self):
        self.temp_dir = '/tmp/videos'
        os.makedirs(self.temp_dir, exist_ok=True)
    
    def download_file(self, url, filename):
        """Download audio or image file"""
        response = requests.get(url, stream=True)
        filepath = os.path.join(self.temp_dir, filename)
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return filepath
    
    def generate_cover_image(self, track_id, title, artist):
        """Generate a simple cover image using PIL"""
        from PIL import Image, ImageDraw, ImageFont
        
        # Create gradient background
        img = Image.new('RGB', (1280, 720), color='#1e3a8a')
        draw = ImageDraw.Draw(img)
        
        # Add title and artist (simplified - enhance as needed)
        font = ImageFont.load_default()
        draw.text((640, 300), title, fill='white', font=font, anchor='mm')
        draw.text((640, 360), artist, fill='#93c5fd', font=font, anchor='mm')
        
        # Save
        image_path = os.path.join(self.temp_dir, f'{track_id}_cover.jpg')
        img.save(image_path)
        return image_path
    
    def generate_video(self, track_id, audio_url, image_url=None, title='Untitled', artist='AI Generated'):
        """Main video generation function"""
        try:
            print(f'[Video Generator] Starting generation for {track_id}')
            
            # Download audio
            audio_path = self.download_file(audio_url, f'{track_id}.mp3')
            
            # Get or generate cover image
            if image_url:
                image_path = self.download_file(image_url, f'{track_id}_cover.jpg')
            else:
                image_path = self.generate_cover_image(track_id, title, artist)
            
            # Output path
            output_path = os.path.join(self.temp_dir, f'{track_id}.mp4')
            
            # FFmpeg command
            command = [
                'ffmpeg',
                '-loop', '1',                    # Loop the image
                '-i', image_path,                # Input image
                '-i', audio_path,                # Input audio
                '-c:v', 'libx264',               # Video codec
                '-tune', 'stillimage',           # Optimize for still image
                '-c:a', 'aac',                   # Audio codec
                '-b:a', '192k',                  # Audio bitrate
                '-pix_fmt', 'yuv420p',          # Pixel format (compatibility)
                '-shortest',                     # End when audio ends
                '-y',                            # Overwrite output
                output_path
            ]
            
            print(f'[Video Generator] Running FFmpeg...')
            result = subprocess.run(command, capture_output=True, text=True)
            
            if result.returncode != 0:
                raise Exception(f'FFmpeg error: {result.stderr}')
            
            print(f'[Video Generator] FFmpeg complete, uploading to Cloudinary...')
            
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                output_path,
                resource_type='video',
                public_id=f'videos/{track_id}',
                overwrite=True
            )
            
            video_url = upload_result['secure_url']
            
            print(f'[Video Generator] Upload complete: {video_url}')
            
            # Cleanup
            self.cleanup([audio_path, image_path, output_path])
            
            # Update database
            self.update_database(track_id, video_url)
            
            return video_url
            
        except Exception as e:
            print(f'[Video Generator] Error: {str(e)}')
            raise
    
    def cleanup(self, files):
        """Remove temporary files"""
        for filepath in files:
            try:
                if os.path.exists(filepath):
                    os.remove(filepath)
            except Exception as e:
                print(f'Cleanup error: {e}')
    
    def update_database(self, track_id, video_url):
        """Update track with video URL"""
        client = MongoClient(os.environ.get('MONGODB_URI'))
        db = client['music_app']
        
        db.tracks.update_one(
            {'id': track_id},
            {'$set': {
                'videoUrl': video_url,
                'videoStatus': 'completed',
                'videoGeneratedAt': datetime.utcnow()
            }}
        )
```

### 3. API Endpoint (1 hour)

```python
# api/generate_video.py
from flask import Flask, request, jsonify
from services.video_generator import VideoGenerator

app = Flask(__name__)
generator = VideoGenerator()

@app.route('/generate-video', methods=['POST'])
def generate_video():
    try:
        data = request.json
        track_id = data.get('trackId')
        audio_url = data.get('audioUrl')
        image_url = data.get('imageUrl')
        title = data.get('title', 'Untitled')
        artist = data.get('artist', 'AI Generated')
        
        if not track_id or not audio_url:
            return jsonify({'error': 'Missing trackId or audioUrl'}), 400
        
        # Generate video (async in production)
        video_url = generator.generate_video(
            track_id, audio_url, image_url, title, artist
        )
        
        return jsonify({
            'success': True,
            'videoUrl': video_url
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

### 4. Frontend Integration (1-2 hours)

```typescript
// app/api/tracks/[id]/generate-video/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Get track data
  const track = await getTrack(id);
  
  // Call video generation service
  const response = await fetch(`${VIDEO_SERVICE_URL}/generate-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trackId: id,
      audioUrl: track.audioUrl,
      imageUrl: track.imageUrl,
      title: track.title,
      artist: track.artist
    })
  });
  
  const data = await response.json();
  
  return NextResponse.json(data);
}
```

```typescript
// components/video/VideoViewer.tsx - Enhanced
useEffect(() => {
  // If no video URL, check if generation is in progress or trigger it
  if (!videoUrl && trackId) {
    checkOrGenerateVideo(trackId);
  }
}, [videoUrl, trackId]);

const checkOrGenerateVideo = async (trackId: string) => {
  try {
    const response = await fetch(`/api/tracks/${trackId}/generate-video`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const data = await response.json();
      // Video URL will be updated via database
      console.log('Video generation started');
    }
  } catch (error) {
    console.error('Video generation error:', error);
  }
};
```

### 5. Environment Variables

```bash
# Render.com environment variables
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
VIDEO_SERVICE_URL=https://your-render-service.onrender.com
```

## Advanced Features (Optional)

### Add Waveform Overlay

```python
# Generate waveform image
import librosa
import matplotlib.pyplot as plt

def generate_waveform(audio_path, output_path):
    y, sr = librosa.load(audio_path)
    plt.figure(figsize=(12, 2))
    plt.plot(y)
    plt.axis('off')
    plt.savefig(output_path, transparent=True)
    return output_path

# Overlay on video with FFmpeg
command = [
    'ffmpeg',
    '-i', base_image,
    '-i', waveform_image,
    '-i', audio,
    '-filter_complex', '[0:v][1:v]overlay=0:H-h',
    # ... rest of command
]
```

### Add Lyrics Text Overlays

```python
def create_lyrics_overlay(lyrics, duration):
    """Create SRT subtitle file from lyrics"""
    # Parse lyrics and create timed subtitles
    # Use FFmpeg to burn subtitles into video
```

## Testing

```bash
# Local testing
python -m pytest tests/test_video_generator.py

# Test FFmpeg installation
ffmpeg -version

# Test video generation
curl -X POST http://localhost:5001/generate-video \
  -H "Content-Type: application/json" \
  -d '{"trackId":"test123","audioUrl":"https://...","title":"Test"}'
```

## Deployment Checklist

- [ ] FFmpeg installed on Render
- [ ] Cloudinary account created
- [ ] Environment variables set
- [ ] API endpoint deployed
- [ ] Frontend integration tested
- [ ] Error handling implemented
- [ ] Storage cleanup scheduled
- [ ] Monitoring setup

## Performance Optimization

1. **Queue System**: Use Bull/Redis for background jobs
2. **Caching**: Store generated videos, don't regenerate
3. **Progressive Enhancement**: Show canvas first, upgrade to video
4. **CDN**: Cloudinary provides automatic CDN
5. **Batch Processing**: Generate videos for multiple tracks at once

## Estimated Resource Usage

- **CPU**: Medium (during generation)
- **Memory**: ~500MB per concurrent generation
- **Storage**: ~50MB per 3-minute video
- **Free Tier Capacity**: ~500 videos (25GB Cloudinary)

## Future Enhancements

- Multiple video styles (user choice)
- Animated backgrounds
- Lyrics synchronization
- Custom branding/watermarks
- Social media format variations (Instagram, TikTok, etc.)

---

**Ready to implement when needed!**
**Estimated full implementation: 1-1.5 days**
