# 🏴‍☠️ AI Pirate Voice Generator

Transform your ordinary text into authentic pirate speech with AI-powered voice synthesis! This modern web application uses cutting-edge AI technology to generate realistic pirate voices with customizable intensity levels.

## ✨ Features

- **AI-Powered Voice Generation**: Uses Replicate's minimax/speech-02-hd model for high-quality voice synthesis
- **Pirate Text Transformation**: Automatically converts regular text to authentic pirate speak
- **Intensity Control**: Adjustable slider (1-10) to control how aggressive and dramatic the pirate voice sounds
- **Advanced Audio Player**: Custom audio player with play/pause, progress control, volume adjustment, and reset functionality
- **Responsive Design**: Beautiful, modern UI that works perfectly on both mobile and desktop
- **Local Storage**: Automatically saves your generation history
- **Sample Phrases**: Quick-start with pre-written pirate phrases
- **Download & Share**: Download generated MP3 audio or share your creations

## 🔧 Technical Implementation

### API Architecture
The voice generation API (`/api/generate-voice`) implements the Replicate prediction lifecycle pattern:

1. **Prediction Creation**: Creates a prediction using `replicate.predictions.create()`
2. **Status Polling**: Polls the prediction status every 2 seconds until completion
3. **Timeout Handling**: Maximum 60-second timeout to prevent hanging requests
4. **Error Management**: Comprehensive error handling for failed, canceled, or timed-out predictions

### Voice Parameters
The system adjusts voice characteristics based on intensity level (1-10):
- **Low Intensity (1-3)**: Neutral emotion, normal pitch/speed
- **Medium Intensity (4-6)**: Happy emotion, standard parameters  
- **High Intensity (7-8)**: Angry emotion, increased pitch/speed
- **Maximum Intensity (9-10)**: Very angry emotion, maximum pitch/speed

### Prediction Lifecycle States
- `starting`: Prediction is being initialized
- `processing`: AI model is generating the audio
- `succeeded`: Audio generation completed successfully
- `failed`: Generation failed with error details
- `canceled`: Prediction was canceled

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

1. Enter your text in the input field
2. Adjust the pirate intensity slider (1-10)
3. Click "Generate Pirate Voice" 
4. Wait for the AI to process your request (may take 10-60 seconds)
5. Play, download, or share your generated pirate voice

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
