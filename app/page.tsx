'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Download, Share2, Loader2, Anchor, Skull, Play, Clock } from 'lucide-react'
import StarField from '@/components/StarField'
import AudioPlayer from '@/components/AudioPlayer'

interface GeneratedAudio {
  id: string
  text: string
  audioUrl: string
  supabaseUrl: string
  filename: string
  pirateText: string
  timestamp: number
  duration?: number
}

export default function Home() {
  const [text, setText] = useState("Shiver me timbers! That be the finest treasure I ever did see, ye scurvy dog!")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [pirateText, setPirateText] = useState<string>('')
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([])
  const [enablePirateTranslation, setEnablePirateTranslation] = useState(false)
  const [sampleDurations, setSampleDurations] = useState<{ [key: number]: number }>({})
  const [expandedAudios, setExpandedAudios] = useState<{ [key: string]: boolean }>({})
  const [isTextModified, setIsTextModified] = useState(false)

  const samplePhrases = [
    {
      text: "Shiver me timbers! That be the finest treasure I ever did see, ye scurvy dog!",
      audioUrl: "/audios/pirate-voice-1748438912306.mp3"
    },
    {
      text: "Avast ye landlubbers! Drop anchor and prepare to be boarded, ye scallywags!",
      audioUrl: "/audios/pirate-voice-1748438076756.mp3"
    },
    {
      text: "Yo ho ho and a bottle of rum! Raise the Jolly Roger and let's plunder some gold!",
      audioUrl: "/audios/pirate-voice-1748438467152.mp3"
    },
    {
      text: "哈！瞧瞧是谁闯进了'黑鳍鲨号'的地盘？是迷路的羔羊，还是送上门的肥羊？ 这片海是老子的地盘，浪花里都漂着老子的威名！想要活命？乖乖交出你的金币、美酒，还有……那枚镶宝石的戒指！",
      audioUrl: "/audios/pirate-voice-1748743380488.mp3"
    },
    {
      text: "Arrr! Walk the plank, ye yellow-bellied sea dog, or face the wrath of Davy Jones!",
      audioUrl: "/audios/pirate-voice-1748438410710.mp3"
    },
  ]

  // Load generated audios from localStorage on component mount
  useEffect(() => {
    const savedAudios = localStorage.getItem('pirate-voice-generated-audios')
    console.log('Loading from localStorage:', savedAudios)
    if (savedAudios) {
      try {
        const audios = JSON.parse(savedAudios)
        console.log('Parsed audios:', audios)
        setGeneratedAudios(audios)
        
        // Auto-load the latest generated audio to the main player
        if (audios.length > 0) {
          const latestAudio = audios[0] // First item is the latest
          console.log('Loading latest audio:', latestAudio)
          setAudioUrl(latestAudio.supabaseUrl)
          setPirateText(latestAudio.pirateText || '')
          setText(latestAudio.text)
        }
      } catch (error) {
        console.error('Error parsing saved audios:', error)
        localStorage.removeItem('pirate-voice-generated-audios')
      }
    } else {
      console.log('No saved audios found in localStorage')
    }
  }, [])

  // Load sample durations on component mount
  useEffect(() => {
    const loadSampleDurations = async () => {
      const durations: { [key: number]: number } = {}
      for (let i = 0; i < samplePhrases.length; i++) {
        try {
          const duration = await getAudioDuration(samplePhrases[i].audioUrl)
          durations[i] = duration
        } catch (error) {
          durations[i] = 0
        }
      }
      setSampleDurations(durations)
    }
    loadSampleDurations()
  }, [])

  // Save to localStorage when generatedAudios changes
  useEffect(() => {
    if (generatedAudios.length > 0) {
      console.log('Saving to localStorage:', generatedAudios)
      localStorage.setItem('pirate-voice-generated-audios', JSON.stringify(generatedAudios))
    }
  }, [generatedAudios])

  const handleGenerate = async () => {
    if (!text.trim()) return

    // Check if text matches any sample phrase
    const matchedSample = samplePhrases.find(phrase => phrase.text === text.trim())
    if (matchedSample) {
      // Play the sample audio directly without generation
      playPresetAudio(matchedSample.audioUrl)
      return
    }

    // Check if text matches any previously generated audio
    const matchedGenerated = generatedAudios.find(audio => audio.text === text.trim())
    if (matchedGenerated) {
      // Play the existing generated audio directly without regeneration
      playPresetAudio(matchedGenerated.supabaseUrl)
      setAudioUrl(matchedGenerated.supabaseUrl)
      setPirateText(matchedGenerated.pirateText)
      return
    }

    setIsGenerating(true)
    try {
      console.log('Starting voice generation request...')
      
      // Add timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minutes timeout

      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, intensity: 5 }), // Fixed intensity value
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate voice')
      }

      console.log('Received response from API, parsing...')
      const result = await response.json()
      console.log('API response:', result)
      
      setAudioUrl(result.supabaseUrl) // Changed from localUrl to supabaseUrl
      setPirateText(result.pirateText)
      
      // Get audio duration from Supabase file
      const duration = await getAudioDuration(result.supabaseUrl)
      console.log('Audio duration detected:', duration)
      
      // Create new audio entry
      const newAudio: GeneratedAudio = {
        id: Date.now().toString(),
        text,
        audioUrl: result.url,
        supabaseUrl: result.supabaseUrl, // Changed from localUrl to supabaseUrl
        filename: result.filename,
        pirateText: result.pirateText,
        timestamp: Date.now(),
        duration: duration
      }
      
      console.log('Adding new audio to list:', newAudio)
      
      // Add to generated audios list (keep last 20)
      setGeneratedAudios(prev => [newAudio, ...prev.slice(0, 19)])
      
      console.log('Voice generation completed successfully!')
      
    } catch (error) {
      console.error('Failed to generate voice:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Arrr! The voice generation took too long and was cancelled. Please try again with shorter text, matey!')
      } else {
        alert(`Arrr! Something went wrong with the voice generation, matey! ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const playPresetAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play().catch(error => {
      console.error('Failed to play audio:', error)
      alert('Failed to play audio. Please try again.')
    })
  }

  const playGeneratedAudio = (audio: GeneratedAudio) => {
    setAudioUrl(audio.supabaseUrl)
    setPirateText(audio.pirateText)
    setText(audio.text)
    
    // Check if the loaded text is different from default to update isTextModified
    const defaultText = "Shiver me timbers! That be the finest treasure I ever did see, ye scurvy dog!"
    setIsTextModified(audio.text !== defaultText)
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = 'pirate-voice.mp3'
      link.target = '_blank'
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

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getAudioDuration = (audioUrl: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl)
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration)
      })
      audio.addEventListener('error', () => {
        resolve(0) // Return 0 if error loading audio
      })
    })
  }

  const formatDuration = (duration: number) => {
    if (!duration || duration === 0) return '0:00'
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleTextExpansion = (audioId: string) => {
    setExpandedAudios(prev => ({
      ...prev,
      [audioId]: !prev[audioId]
    }))
  }

  const handleTextChange = (value: string) => {
    setText(value)
    // Check if text is different from default
    const defaultText = "Shiver me timbers! That be the finest treasure I ever did see, ye scurvy dog!"
    setIsTextModified(value !== defaultText)
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
          {/* About Section */}
            
            <div className="p-6 bg-black/30 rounded-xl">
              <div className="flex items-start gap-4">
                {/* Pirate Avatar */}
                <div className="flex-shrink-0">
                  <img src="/pirate.jpg" alt="Pirate Avatar" className="w-32 h-32 lg:w-48 lg:h-48 xl:w-full xl:h-auto object-cover rounded-lg" />
                </div>
                
                {/* Introduction Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-3 text-pirate-gold flex items-center gap-2">
                    <span>Ahoy, Matey!</span>
                    <span className="text-sm">⚓</span>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Welcome aboard the most advanced AI pirate voice generator on the seven seas! Our cutting-edge technology transforms your ordinary landlubber text into authentic pirate speech with the proper accent, intonation, and maritime vocabulary.
                  </p>
                  
                </div>
              </div>
            </div>


            {/* Sample Phrases with Play Buttons */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-pirate-gold">Sample Pirate Phrases:</h3>
              <div className="space-y-2">
                {samplePhrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-pirate-gold/10 border border-pirate-gold/30 rounded-lg hover:bg-pirate-gold/20 transition-all"
                  >
                    <button
                      onClick={() => playPresetAudio(phrase.audioUrl)}
                      className="flex-shrink-0 w-16 h-8 bg-pirate-gold hover:bg-pirate-gold/80 rounded-lg flex items-center justify-center text-black transition-all text-xs font-medium"
                      title="Play sample audio"
                    >
                      <span className="flex items-center gap-1">
                        <span>▶</span>
                        <span>{formatDuration(sampleDurations[index] || 0)}</span>
                      </span>
                    </button>
                    <span className="text-sm text-gray-300 flex-1">
                      {phrase.text}
                    </span>
                  </div>
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
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-pirate-gold ">
              <Anchor className="w-6 h-6" />
              Enter Your Text
            </h2>
            
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your text here to convert it into a pirate's voice..."
              className="w-full h-48 bg-black/30 border-2 border-pirate-gold/30 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-pirate-gold focus:ring-2 focus:ring-pirate-gold/20 transition-all"
              maxLength={500}
            />
            
            <div className="text-sm text-gray-400 mt-2">
              {text.length}/500 characters
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-6">
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
                    {isTextModified ? (
                      <>
                        <Volume2 className="w-5 h-5" />
                        Generate Pirate Voice
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </>
                )}
              </motion.button>
              
              <button
                onClick={() => {
                  setText('')
                  setIsTextModified(true) // Empty text is considered modified from default
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
              >
                Clear Text
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-pirate-gold">
              <Volume2 className="w-6 h-6" />
              Generated Audios
            </h2>

            

            {/* Generated Audios History */}
            <div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generatedAudios.length > 0 ? (
                  generatedAudios.slice(0, 10).map((audio, index) => (
                    <div 
                      key={audio.id} 
                      className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-all"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playPresetAudio(audio.supabaseUrl)
                        }}
                        className="flex-shrink-0 w-16 h-8 bg-pirate-gold hover:bg-pirate-gold/80 rounded-lg flex items-center justify-center text-black transition-all text-xs font-medium"
                        title="Play generated audio"
                      >
                        <span className="flex items-center gap-1">
                          <span>▶</span>
                          <span>{formatDuration(audio.duration || 0)}</span>
                        </span>
                      </button>
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => playGeneratedAudio(audio)}
                      >
                        <div 
                          className="text-gray-300 text-sm cursor-pointer hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTextExpansion(audio.id)
                          }}
                        >
                          <p className={expandedAudios[audio.id] ? '' : 'truncate'}>
                            {audio.text}
                          </p>
                          {audio.text.length > 50 && (
                            <span className="text-pirate-gold text-xs mt-1 block">
                              {expandedAudios[audio.id] ? '▲ Click to collapse' : '▼ Click to expand'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{formatTimestamp(audio.timestamp)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const link = document.createElement('a')
                          link.href = audio.supabaseUrl
                          link.download = audio.filename
                          link.target = '_blank'
                          link.click()
                        }}
                        className="flex-shrink-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-all"
                        title="Download audio"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Skull className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No audio generated yet, matey!</p>
                    <p className="text-sm mt-2">Enter some text and hit "Generate" to create your pirate voice</p>
                  </div>
                )}
              </div>
            </div>
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