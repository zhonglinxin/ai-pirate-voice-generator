'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface IntensitySliderProps {
  value: number
  onChange: (value: number) => void
}

export default function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const getIntensityLabel = (intensity: number): string => {
    if (intensity <= 2) return "Gentle Sailor"
    if (intensity <= 4) return "Seasoned Crew"
    if (intensity <= 6) return "First Mate"
    if (intensity <= 8) return "Captain"
    return "Blackbeard!"
  }

  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 3) return "from-blue-400 to-blue-600"
    if (intensity <= 6) return "from-yellow-400 to-orange-500"
    return "from-red-500 to-red-700"
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Track */}
        <div className="h-3 bg-gray-700 rounded-full relative overflow-hidden">
          {/* Progress */}
          <motion.div
            className={`h-full bg-gradient-to-r ${getIntensityColor(value)} rounded-full`}
            style={{ width: `${(value / 10) * 100}%` }}
            initial={false}
            animate={{ width: `${(value / 10) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer border-2 border-pirate-gold"
          style={{ left: `${(value / 10) * 100}%` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          animate={{ 
            boxShadow: isDragging 
              ? "0 0 0 8px rgba(255, 215, 0, 0.2)" 
              : "0 0 0 0px rgba(255, 215, 0, 0.2)"
          }}
        />

        {/* Input range (invisible) */}
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
        />

        {/* Scale markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <span 
              key={num} 
              className={`w-1 text-center ${value === num ? 'text-pirate-gold font-bold' : ''}`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Intensity indicator */}
      <motion.div 
        className="text-center p-3 bg-black/20 rounded-lg border border-pirate-gold/30"
        initial={false}
        animate={{ 
          borderColor: isDragging ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 215, 0, 0.3)',
          backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <motion.span 
          className={`text-lg font-bold bg-gradient-to-r ${getIntensityColor(value)} bg-clip-text text-transparent`}
          key={value} // Force re-render for animation
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getIntensityLabel(value)}
        </motion.span>
        <p className="text-sm text-gray-400 mt-1">
          {value <= 3 && "A calm and gentle pirate voice"}
          {value > 3 && value <= 6 && "Moderate pirate intensity"}
          {value > 6 && value <= 8 && "Strong and commanding voice"}
          {value > 8 && "Maximum pirate aggression!"}
        </p>
      </motion.div>

      {/* Visual effects for high intensity */}
      {value >= 8 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            className="text-2xl"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            ⚡🏴‍☠️⚡
          </motion.span>
        </motion.div>
      )}
    </div>
  )
} 