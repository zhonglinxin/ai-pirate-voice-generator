import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || 'r8_99hwxvLU7MF6UtIIvehcjZ7M9Lvne8K2Mpno0',
})

export async function POST(request: NextRequest) {
  try {
    const { text, intensity } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (!intensity || typeof intensity !== 'number' || intensity < 1 || intensity > 10) {
      return NextResponse.json(
        { error: 'Intensity must be a number between 1 and 10' },
        { status: 400 }
      )
    }

    // Transform text to pirate speak
    const pirateText = transformToPirateSpeak(text, intensity)
    
    // Get voice parameters based on intensity
    const { emotion, pitch, speed } = getVoiceParameters(intensity)

    const input = {
      text: pirateText,
      pitch: pitch,
      speed: speed,
      volume: 1,
      bitrate: 128000,
      channel: "mono" as const,
      emotion: emotion,
      voice_id: "R8_QBE6P33A",
      sample_rate: 32000,
      language_boost: "English",
      english_normalization: true
    }

    console.log('Generating voice with input:', input)

    const output = await replicate.run("minimax/speech-02-hd", { input })
    
    // Handle different output formats
    let audioUrl: string
    if (typeof output === 'string') {
      audioUrl = output
    } else if (output && typeof output === 'object' && 'url' in output) {
      audioUrl = (output as any).url
    } else {
      audioUrl = String(output)
    }

    if (!audioUrl) {
      throw new Error('No audio URL returned from the API')
    }

    return NextResponse.json({
      url: audioUrl,
      pirateText: pirateText,
      originalText: text,
      intensity: intensity
    })

  } catch (error) {
    console.error('Voice generation failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate pirate voice', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

function transformToPirateSpeak(text: string, intensity: number): string {
  let pirateText = text

  // Basic pirate transformations
  pirateText = pirateText.replace(/\byou\b/gi, 'ye')
  pirateText = pirateText.replace(/\byour\b/gi, 'yer')
  pirateText = pirateText.replace(/\bmy\b/gi, 'me')
  pirateText = pirateText.replace(/\bis\b/gi, 'be')
  pirateText = pirateText.replace(/\bare\b/gi, 'be')
  pirateText = pirateText.replace(/\bover\b/gi, 'o\'er')
  pirateText = pirateText.replace(/\bto\b/gi, 'ter')
  pirateText = pirateText.replace(/\band\b/gi, 'an\'')
  pirateText = pirateText.replace(/\bfor\b/gi, 'fer')
  pirateText = pirateText.replace(/\bthe\b/gi, 'th\'')

  // Add pirate expressions based on intensity
  const expressions = getPirateExpressions(intensity)
  const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]
  
  // Add expression at the beginning or end
  if (Math.random() > 0.5) {
    pirateText = `${randomExpression} ${pirateText}`
  } else {
    pirateText = `${pirateText}, ${randomExpression.toLowerCase()}`
  }

  return pirateText
}

function getVoiceParameters(intensity: number): { emotion: string, pitch: number, speed: number } {
  if (intensity <= 3) {
    return {
      emotion: "neutral",
      pitch: 0.9,
      speed: 0.9
    }
  } else if (intensity <= 6) {
    return {
      emotion: "happy",
      pitch: 1.0,
      speed: 1.0
    }
  } else if (intensity <= 8) {
    return {
      emotion: "angry",
      pitch: 1.1,
      speed: 1.1
    }
  } else {
    return {
      emotion: "angry",
      pitch: 1.2,
      speed: 1.2
    }
  }
}

function getPirateExpressions(intensity: number): string[] {
  if (intensity <= 3) {
    return [
      "Ahoy there",
      "Well met, matey",
      "Greetings, sailor"
    ]
  } else if (intensity <= 6) {
    return [
      "Arrr, matey",
      "Avast ye",
      "Shiver me timbers",
      "Yo ho ho"
    ]
  } else if (intensity <= 8) {
    return [
      "Batten down the hatches",
      "Blast ye, scurvy dog",
      "By Blackbeard's beard",
      "Scallywag"
    ]
  } else {
    return [
      "Blast yer black heart",
      "Ye scurvy bilge rat",
      "By Davy Jones' locker",
      "Curse ye to the depths",
      "Arrr, ye mangy sea dog"
    ]
  }
} 