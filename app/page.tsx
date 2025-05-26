'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Download, Share2, Loader2, Anchor, Skull } from 'lucide-react'
import IntensitySlider from '@/components/IntensitySlider'
import StarField from '@/components/StarField'

export default function Home() {
  const [text, setText] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [pirateText, setPirateText] = useState<string>('')
  const [history, setHistory] = useState<Array<{text: string, audioUrl: string, intensity: number, pirateText: string}>>([])

  const samplePhrases = [
    "Shiver me timbers! That be the finest treasure I ever did see, ye scurvy dog!",
    "Avast ye landlubbers! Drop anchor and prepare to be boarded, ye scallywags!",
    "Yo ho ho and a bottle of rum! Raise the Jolly Roger and let's plunder some gold!",
    "Batten down the hatches, me hearties! A mighty storm be brewin' on the horizon!",
    "Arrr! Walk the plank, ye yellow-bellied sea dog, or face the wrath of Davy Jones!",
  ]

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('pirate-voice-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save to localStorage when history changes
  useEffect(() => {
    localStorage.setItem('pirate-voice-history', JSON.stringify(history))
  }, [history])

  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, intensity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate voice')
      }

      const result = await response.json()
      setAudioUrl(result.url)
      setPirateText(result.pirateText)
      
      // Add to history
      const newEntry = { 
        text, 
        audioUrl: result.url, 
        intensity, 
        pirateText: result.pirateText 
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]) // Keep only last 10
    } catch (error) {
      console.error('Failed to generate voice:', error)
      alert(`Arrr! Something went wrong with the voice generation, matey! ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const setSampleText = (phrase: string) => {
    setText(phrase)
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = 'pirate-voice.wav'
      link.click()
    }
  }

  const handleShare = async () => {
    if (navigator.share && audioUrl) {
      try {
        await navigator.share({
          title: 'My Pirate Voice',
          text: `Check out this pirate voice I generated: "${pirateText || text}"`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard, ye can share it now!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pirate-navy via-pirate-slate to-pirate-deep text-white overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 text-gradient"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏴‍☠️ AI Pirate Voice Generator
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your ordinary text into authentic pirate speech with AI-powered voice synthesis
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <motion.div 
            className="glass rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-pirate-gold">
              <Anchor className="w-6 h-6" />
              Enter Your Text
            </h2>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ahoy matey! Enter yer text here and let the AI transform it into a proper pirate's voice, savvy?"
              className="w-full h-48 bg-black/30 border-2 border-pirate-gold/30 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-pirate-gold focus:ring-2 focus:ring-pirate-gold/20 transition-all"
              maxLength={500}
            />
            
            <div className="text-sm text-gray-400 mt-2">
              {text.length}/500 characters
            </div>
            
            <div className="mt-6">
              <label className="block text-pirate-gold font-semibold mb-3">
                Intensity Level (1-10): {intensity}
              </label>
              <IntensitySlider value={intensity} onChange={setIntensity} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <motion.button
                onClick={handleGenerate}
                disabled={!text.trim() || isGenerating}
                className="btn-pirate px-6 py-3 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generatin' Voice...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    Generate Pirate Voice
                  </>
                )}
              </motion.button>
              
              <button
                onClick={() => setText('')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
              >
                Clear Text
              </button>
            </div>

            {/* Sample Phrases */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-pirate-gold">Sample Pirate Phrases:</h3>
              <div className="space-y-2">
                {samplePhrases.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => setSampleText(phrase)}
                    className="block w-full text-left p-3 bg-pirate-gold/10 border border-pirate-gold/30 rounded-lg hover:bg-pirate-gold/20 transition-all text-sm"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div 
            className="glass rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-pirate-gold">
              <Volume2 className="w-6 h-6" />
              Generated Voice
            </h2>

            {audioUrl ? (
              <div className="space-y-4">
                {pirateText && (
                  <div className="p-4 bg-black/20 rounded-lg border border-pirate-gold/30">
                    <h4 className="text-sm font-semibold text-pirate-gold mb-2">Pirate Translation:</h4>
                    <p className="text-gray-300 italic">"{pirateText}"</p>
                  </div>
                )}
                
                <audio 
                  controls 
                  src={audioUrl} 
                  className="w-full rounded-lg"
                  style={{ filter: 'sepia(1) saturate(2) hue-rotate(320deg)' }}
                />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Audio
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Skull className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No audio generated yet, matey!</p>
                <p className="text-sm mt-2">Enter some text and hit "Generate" to create your pirate voice</p>
              </div>
            )}

            {/* About Section */}
            <div className="mt-8 p-6 bg-black/30 rounded-xl">
              <h3 className="text-lg font-semibold mb-3 text-pirate-gold">🏴‍☠️ About This Generator</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our advanced AI technology transforms your ordinary text into authentic pirate speech patterns, 
                complete with the proper accent, intonation, and maritime vocabulary that would make even 
                Blackbeard himself proud. The intensity slider controls how aggressive and dramatic the pirate voice sounds!
              </p>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 text-pirate-gold">Recent Generations:</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.slice(0, 5).map((item, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-black/20 rounded-lg text-sm cursor-pointer hover:bg-black/30 transition-all"
                      onClick={() => {
                        setText(item.text)
                        setIntensity(item.intensity)
                      }}
                    >
                      <p className="text-gray-300 truncate">"{item.text}"</p>
                      {item.pirateText && (
                        <p className="text-pirate-gold text-xs mt-1 truncate">Pirate: "{item.pirateText}"</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">Intensity: {item.intensity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 mt-16 border-t border-white/10">
        <p className="text-gray-400">
          &copy; 2024 AI Pirate Voice Generator. All rights reserved. Made with ⚓ for landlubbers and seafarers alike.
        </p>
      </footer>
    </div>
  )
}