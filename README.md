# 🏴‍☠️ AI Pirate Voice Generator

Transform your ordinary text into authentic pirate speech with AI-powered voice synthesis! This modern web application uses cutting-edge AI technology to generate realistic pirate voices with customizable intensity levels.

## ✨ Features

- **AI-Powered Voice Generation**: Uses Replicate's minimax/speech-02-hd model for high-quality voice synthesis
- **Pirate Text Transformation**: Automatically converts regular text to authentic pirate speak
- **Intensity Control**: Adjustable slider (1-10) to control how aggressive and dramatic the pirate voice sounds
- **Responsive Design**: Beautiful, modern UI that works perfectly on both mobile and desktop
- **Local Storage**: Automatically saves your generation history
- **Sample Phrases**: Quick-start with pre-written pirate phrases
- **Download & Share**: Download generated audio or share your creations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Replicate API account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-pirate-voice-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Get your API key from https://replicate.com/account/api-tokens
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   NEXT_PUBLIC_REPLICATE_API_TOKEN=your_replicate_api_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Service**: Replicate (minimax/speech-02-hd model)
- **Storage**: Browser localStorage

## 🎨 UI Features

- **Modern Glass-morphism Design**: Beautiful frosted glass effects
- **Animated Star Field**: Dynamic twinkling stars background
- **Responsive Layout**: Optimized for mobile and desktop
- **Interactive Elements**: Smooth animations and hover effects
- **Pirate Theme**: Authentic maritime color scheme and typography

## 🎯 How It Works

1. **Text Input**: Enter any text you want to convert to pirate speech
2. **Intensity Selection**: Choose how aggressive the pirate voice should sound (1-10)
3. **AI Processing**: The app transforms your text to pirate speak and generates audio using Replicate's AI
4. **Audio Playback**: Listen to your generated pirate voice
5. **Download/Share**: Save the audio file or share your creation

## 🏴‍☠️ Pirate Transformations

The app automatically transforms regular text using:

- **Word Replacements**: "you" → "ye", "your" → "yer", "my" → "me"
- **Pirate Expressions**: Adds appropriate pirate phrases based on intensity
- **Voice Parameters**: Adjusts pitch, speed, and emotion based on intensity level

### Intensity Levels

- **1-3 (Gentle Sailor)**: Calm, neutral voice with basic pirate vocabulary
- **4-6 (First Mate)**: Moderate intensity with classic pirate expressions
- **7-8 (Captain)**: Strong, commanding voice with dramatic flair
- **9-10 (Blackbeard!)**: Maximum aggression with fierce pirate personality

## 📱 Mobile Optimization

- Touch-friendly interface
- Responsive grid layout
- Optimized animations for mobile devices
- Easy-to-use slider controls

## 🔧 API Reference

### POST /api/generate-voice

Generate pirate voice from text.

**Request Body:**
```json
{
  "text": "Your text here",
  "intensity": 5
}
```

**Response:**
```json
{
  "url": "https://...",
  "pirateText": "Arrr! Yer text here, matey!",
  "originalText": "Your text here",
  "intensity": 5
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Replicate](https://replicate.com/) for the amazing AI voice synthesis API
- [Minimax](https://www.minimaxi.com/) for the speech-02-hd model
- The open-source community for the incredible tools and libraries

## 🔗 Links

- [Live Demo](https://your-deployment-url.vercel.app)
- [Replicate Model](https://replicate.com/minimax/speech-02-hd)
- [API Documentation](https://replicate.com/docs)

---

**Arrr! Ready to set sail on the digital seas? ⚓** # ai-pirate-voice-generator
