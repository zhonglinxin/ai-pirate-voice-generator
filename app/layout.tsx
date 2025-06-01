import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Pirate Voice Generator - Transform Text to Pirate Speech',
  description: 'Transform your ordinary text into authentic pirate speech with AI-powered voice synthesis. Perfect for games, stories, and swashbuckling fun!',
  keywords: 'pirate voice, AI voice generator, text to speech, pirate talk, voice synthesis',
  authors: [{ name: 'AI Pirate Voice Generator' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'AI Pirate Voice Generator',
    description: 'Transform your text into authentic pirate speech with AI',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 