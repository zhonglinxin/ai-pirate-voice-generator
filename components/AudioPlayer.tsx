'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, Download, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

interface AudioPlayerProps {
  audioUrl: string
  pirateText?: string
  onDownload?: () => void
}

export default function AudioPlayer({ audioUrl, pirateText, onDownload }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const resetAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
    audio.pause()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div 
      className="bg-gradient-to-r from-pirate-gold/20 to-pirate-gold/10 rounded-xl p-6 border border-pirate-gold/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {pirateText && (
        <div className="mb-4 p-3 bg-black/20 rounded-lg border border-pirate-gold/30">
          <h4 className="text-sm font-semibold text-pirate-gold mb-2">🏴‍☠️ Pirate Translation:</h4>
          <p className="text-gray-300 italic">"{pirateText}"</p>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-4">
        <motion.button
          onClick={togglePlay}
          className="w-12 h-12 bg-pirate-gold text-black rounded-full flex items-center justify-center hover:bg-pirate-gold/80 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </motion.button>

        <button
          onClick={resetAudio}
          className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Volume and Download Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-300" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {onDownload && (
          <motion.button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: 2px solid #000;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: 2px solid #000;
        }
      `}</style>
    </motion.div>
  )
} 