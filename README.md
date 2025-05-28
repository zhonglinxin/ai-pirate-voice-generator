# 🏴‍☠️ AI Pirate Voice Generator

Transform your ordinary text into authentic pirate speech with AI-powered voice synthesis! This modern web application uses cutting-edge AI technology to generate realistic pirate voices with customizable intensity levels.

## ✨ Features

- **AI-Powered Voice Generation**: Uses Replicate's minimax/speech-02-hd model for high-quality voice synthesis
- **Local Audio Storage**: Generated audio files are automatically downloaded and saved to local directory (`public/audios/`)
- **Persistent Audio Library**: All generated audios are stored in localStorage and remain available after page refresh
- **Audio Duration Display**: Play buttons show the duration of each audio file (e.g., "0:08", "1:23")
- **Sample Audio Playback**: Click duration buttons to instantly hear example pirate voices
- **Advanced Audio Player**: Custom audio player with play/pause, progress control, volume adjustment, and reset functionality
- **Generated Audios List**: Browse and replay previously generated audio files with timestamps and durations
- **Responsive Design**: Beautiful, modern UI that works perfectly on both mobile and desktop
- **Local File Management**: All audio playback uses local files for faster loading and offline access
- **Sample Phrases**: Quick-start with pre-written pirate phrases and instant audio preview
- **Download & Share**: Download generated MP3 audio or share your creations (downloads open in new window)

## 🔧 Technical Implementation

### Local Audio Storage System
The application implements a comprehensive local audio storage system:

1. **Automatic Download**: When audio generation completes, the MP3 file is automatically downloaded from Replicate's servers
2. **Local File Storage**: Audio files are saved to `public/audios/` directory with unique timestamps
3. **Dual URL Management**: Both remote URL (for backup) and local URL (for playback) are stored
4. **Duration Detection**: Audio duration is automatically detected and stored for each file
5. **localStorage Persistence**: All audio metadata is saved to localStorage for persistence across sessions

### API Architecture
The voice generation API (`/api/generate-voice`) implements the Replicate prediction lifecycle pattern:

1. **Prediction Creation**: Creates a prediction using `replicate.predictions.create()`
2. **Status Polling**: Polls the prediction status every 2 seconds until completion
3. **Audio Download**: Downloads the generated MP3 file and saves it locally
4. **Timeout Handling**: Maximum 60-second timeout to prevent hanging requests
5. **Error Management**: Comprehensive error handling for failed, canceled, or timed-out predictions

### Voice Parameters
The system uses optimized voice characteristics for authentic pirate speech:
- **Emotion**: Happy emotion for energetic pirate character
- **Pitch**: Standard pitch (0) for natural voice
- **Speed**: Normal speed (1.0) for clear pronunciation
- **Voice ID**: "R8_QBE6P33A" - optimized for pirate character voice

### API Parameters
The voice generation uses the following parameters according to Replicate's minimax/speech-02-hd schema:
- **text**: Input text (max 5000 characters, each character = 1 token)
- **voice_id**: "R8_QBE6P33A" (optimized for pirate voice character)
- **pitch**: Integer value 1 (standard pitch)
- **speed**: Float value 1.0 (normal speed)
- **emotion**: "happy" (energetic pirate character)
- **volume**: Fixed at 1.0
- **bitrate**: 128000 for good quality
- **sample_rate**: 32000 Hz
- **channel**: Mono audio
- **language_boost**: "English" for better recognition
- **english_normalization**: true for better number reading

### Prediction Lifecycle States
- `starting`: Prediction is being initialized
- `processing`: AI model is generating the audio
- `succeeded`: Audio generation completed successfully
- `failed`: Generation failed with error details
- `canceled`: Prediction was canceled

### Audio File Management
- **Unique Filenames**: Each generated audio gets a unique filename with timestamp
- **Local Playback**: All audio playback uses local files for faster loading
- **Duration Display**: Play buttons show formatted duration (MM:SS format)
- **Persistent Storage**: Audio files remain available even after server restart

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   REPLICATE_API_TOKEN=your_replicate_token_here
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Usage

1. **Listen to Examples**: Click the duration buttons next to sample phrases to hear pirate voice examples
2. Enter your text in the input field (max 500 characters)
3. Click "Generate Pirate Voice" 
4. Wait for the AI to process your request (may take 10-60 seconds)
5. **Automatic Local Storage**: The generated MP3 file is automatically downloaded and saved locally
6. Play, download, or share your generated pirate voice using local files
7. **Access Previous Generations**: Click on any item in the "Generated Audios" list to replay previous creations

### Local Audio Storage Features
- **Automatic Saving**: All generated audio files are automatically saved to `public/audios/` directory
- **Persistent Access**: Your generated audios remain available even after closing the browser or restarting the server
- **Duration Display**: Each audio shows its duration on the play button (e.g., "0:08", "1:23")
- **Fast Playback**: All audio playback uses local files for instant loading
- **Offline Access**: Once generated, audios can be played without internet connection

### Sample Phrases
The application includes 5 pre-written pirate phrases with duration display:
- Each phrase has a duration button showing the audio length
- Audio files are pre-generated for instant demonstration
- Perfect for understanding the voice quality before generating your own

### Generated Audios Management
- **Automatic Storage**: All generated audios are automatically saved to your browser's localStorage
- **Local File Playback**: All audio playback uses locally stored MP3 files
- **Duration Display**: Each audio item shows its duration on the play button
- **Quick Replay**: Click the duration button to instantly play the audio, or click the text area to load it into the main player
- **Individual Download**: Each audio item has its own download button for easy access
- **Timestamp Tracking**: Each generation includes a timestamp for easy identification
- **Storage Limit**: Keeps the last 20 generated audios to manage storage space

### Generated Audios List Controls
- **🕐 Duration Button**: Shows audio length and plays the audio when clicked
- **📝 Text Area**: Click to load the audio into the main player for full controls
- **⬇️ Download Button**: Download the specific local audio file with its original filename

## 🛠️ Project Structure

```
├── app/
│   ├── api/generate-voice/route.ts    # Voice generation API endpoint
│   ├── components/                    # React components
│   ├── page.tsx                      # Main application page
│   └── layout.tsx                    # App layout
├── public/                           # Static assets
└── README.md                        # Project documentation
```

## ⚠️ Important Notes

- Voice generation can take 10-60 seconds depending on text length
- The API implements a 60-second timeout to prevent hanging requests
- Each character in the input text represents 1 token for billing purposes
- Ensure your Replicate API token has sufficient credits for voice generation
