#!/usr/bin/env python3
"""
MIDI Generation Service using Basic Pitch
Designed for Render.com deployment
"""

import os
import sys
import tempfile
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from basic_pitch.inference import predict_and_save
from basic_pitch import ICASSP_2022_MODEL_PATH

app = Flask(__name__)
CORS(app)

# Configuration
TEMP_DIR = os.environ.get('TEMP_DIR', tempfile.gettempdir())
PORT = int(os.environ.get('PORT', 5000))

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Render"""
    return jsonify({
        'status': 'healthy',
        'service': 'midi-generation',
        'version': '1.0.0'
    }), 200

@app.route('/generate-midi', methods=['POST'])
def generate_midi():
    """
    Generate MIDI from audio URL
    Expected JSON: { "audioUrl": "https://...", "trackId": "..." }
    """
    try:
        data = request.get_json()
        audio_url = data.get('audioUrl')
        track_id = data.get('trackId')
        
        if not audio_url or not track_id:
            return jsonify({'error': 'Missing audioUrl or trackId'}), 400
        
        print(f'[MIDI Service] Processing track: {track_id}')
        
        # Download audio file
        audio_path = os.path.join(TEMP_DIR, f'{track_id}.mp3')
        print(f'[MIDI Service] Downloading audio from: {audio_url}')
        
        response = requests.get(audio_url, timeout=60)
        response.raise_for_status()
        
        with open(audio_path, 'wb') as f:
            f.write(response.content)
        
        print(f'[MIDI Service] Audio downloaded: {os.path.getsize(audio_path)} bytes')
        
        # Generate MIDI using Basic Pitch
        output_dir = os.path.join(TEMP_DIR, 'midi_output')
        os.makedirs(output_dir, exist_ok=True)
        
        print('[MIDI Service] Running Basic Pitch...')
        
        predict_and_save(
            audio_path_list=[audio_path],
            output_directory=output_dir,
            save_midi=True,
            sonify_midi=False,
            save_model_outputs=False,
            save_notes=False,
            model_or_model_path=ICASSP_2022_MODEL_PATH
        )
        
        # Find generated MIDI file
        midi_filename = f'{track_id}_basic_pitch.mid'
        midi_path = os.path.join(output_dir, midi_filename)
        
        if not os.path.exists(midi_path):
            # Try alternative naming
            for file in os.listdir(output_dir):
                if file.endswith('.mid'):
                    midi_path = os.path.join(output_dir, file)
                    break
        
        if not os.path.exists(midi_path):
            return jsonify({'error': 'MIDI generation failed'}), 500
        
        # Get MIDI file stats
        midi_size = os.path.getsize(midi_path)
        
        print(f'[MIDI Service] MIDI generated: {midi_size} bytes')
        
        # Read MIDI content
        with open(midi_path, 'rb') as f:
            midi_content = f.read()
        
        # Cleanup temp files
        try:
            os.remove(audio_path)
            os.remove(midi_path)
        except:
            pass
        
        # Return MIDI file
        return midi_content, 200, {
            'Content-Type': 'audio/midi',
            'Content-Disposition': f'attachment; filename="{track_id}.mid"',
            'X-MIDI-Size': str(midi_size)
        }
        
    except Exception as e:
        print(f'[MIDI Service] Error: {str(e)}', file=sys.stderr)
        return jsonify({
            'error': 'MIDI generation failed',
            'message': str(e)
        }), 500

@app.route('/generate-midi-async', methods=['POST'])
def generate_midi_async():
    """
    Generate MIDI and return URL (for future job queue implementation)
    """
    try:
        data = request.get_json()
        audio_url = data.get('audioUrl')
        track_id = data.get('trackId')
        
        if not audio_url or not track_id:
            return jsonify({'error': 'Missing audioUrl or trackId'}), 400
        
        # For now, process synchronously
        # In production, add to job queue (Bull/Redis)
        
        return jsonify({
            'status': 'queued',
            'trackId': track_id,
            'message': 'MIDI generation started'
        }), 202
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to queue MIDI generation',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print(f'[MIDI Service] Starting on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=False)
