'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  animationDelay: number
  duration: number
}

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    // Generate stars only once
    if (starsRef.current.length === 0) {
      const stars: Star[] = []
      for (let i = 0; i < 150; i++) {
        stars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          animationDelay: Math.random() * 3,
          duration: Math.random() * 2 + 2
        })
      }
      starsRef.current = stars
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(ellipse at center, rgba(15, 52, 96, 0.3) 0%, rgba(26, 26, 46, 0.8) 100%)' }}
    >
      {starsRef.current.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.animationDelay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Shooting stars */}
      <motion.div
        className="absolute w-1 h-1 bg-pirate-gold rounded-full"
        style={{
          left: '10%',
          top: '20%',
        }}
        animate={{
          x: [0, 200],
          y: [0, 100],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          delay: 2,
          repeat: Infinity,
          repeatDelay: 8,
        }}
      />
      
      <motion.div
        className="absolute w-1 h-1 bg-pirate-gold rounded-full"
        style={{
          left: '80%',
          top: '30%',
        }}
        animate={{
          x: [0, -150],
          y: [0, 80],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 6,
          repeat: Infinity,
          repeatDelay: 12,
        }}
      />

      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            left: '70%',
            top: '10%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            left: '10%',
            top: '60%',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>
    </div>
  )
} 