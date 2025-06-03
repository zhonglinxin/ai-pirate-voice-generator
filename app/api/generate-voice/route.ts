import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { uploadAudioToSupabase } from '../../../lib/supabase'

// Define the type for Replicate response
interface ReplicateResponse {
  output?: string;
  [key: string]: any;
}

// Define the type for Replicate prediction
interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string;
  error?: string;
  [key: string]: any;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Function to directly upload audio from URL to Supabase Storage
async function uploadAudioDirectlyToSupabase(audioUrl: string, filename: string): Promise<string> {
  try {
    console.log('Downloading audio from Replicate...')
    
    // Download the audio file from Replicate
    const response = await fetch(audioUrl)
    if (!response.ok) {
      throw new Error(`Failed to download audio from Replicate: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`Audio downloaded (${buffer.length} bytes), uploading to Supabase...`)

    // Upload directly to Supabase Storage
    const supabaseUrl = await uploadAudioToSupabase(buffer, filename)
    
    console.log('Audio uploaded to Supabase successfully:', supabaseUrl)
    return supabaseUrl
  } catch (error) {
    console.error('Error uploading audio to Supabase:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get text and intensity from request body
    const { text, intensity } = await request.json()
    
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Transform text to pirate speak
    const pirateText = text.trim()
    // const pirateText = transformToPirateSpeak(text.trim(), intensity || 5)
    
    // Get voice parameters based on intensity
    const voiceParams = getVoiceParameters(intensity || 5)

    const input = {
      text: pirateText,
      pitch: 1,
      speed: 1,
      volume: 1,
      bitrate: 128000,
      channel: "mono" as const,
      emotion: voiceParams.emotion,
      voice_id: "R8_QBE6P33A",
      sample_rate: 32000,
      language_boost: "English",
      english_normalization: true
    };
    console.log('Voice generation input:', input)
    
    // Create prediction instead of running directly
    const prediction = await replicate.predictions.create({
      model: "minimax/speech-02-hd",
      input
    });
    
    console.log('Prediction created:', prediction.id, 'Status:', prediction.status);

    // Poll for completion with timeout
    let completed: ReplicatePrediction | null = null;
    const maxAttempts = 30; // Maximum 60 seconds (30 * 2 seconds)
    
    for (let i = 0; i < maxAttempts; i++) {
      const latest = await replicate.predictions.get(prediction.id) as ReplicatePrediction;
      console.log(`Attempt ${i + 1}: Status = ${latest.status}`);
      
      if (latest.status !== "starting" && latest.status !== "processing") {
        completed = latest;
        break;
      }
      
      // Wait for 2 seconds before next check
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!completed) {
      return NextResponse.json(
        { error: 'Voice generation timed out. Please try again.' },
        { status: 408 }
      )
    }

    if (completed.status === 'failed') {
      console.error('Prediction failed:', completed.error);
      return NextResponse.json(
        { error: 'Voice generation failed', details: completed.error },
        { status: 500 }
      )
    }

    if (completed.status === 'canceled') {
      return NextResponse.json(
        { error: 'Voice generation was canceled' },
        { status: 500 }
      )
    }

    if (completed.status !== 'succeeded' || !completed.output) {
      return NextResponse.json(
        { error: 'Voice generation did not complete successfully' },
        { status: 500 }
      )
    }

    console.log('Voice generation completed successfully:', completed.output);

    // Generate unique filename for Supabase storage
    const timestamp = Date.now()
    const filename = `pirate-voice-${timestamp}.mp3`
    
    // Upload audio directly to Supabase Storage (no local saving)
    const supabaseAudioUrl = await uploadAudioDirectlyToSupabase(completed.output, filename)

    console.log('Preparing API response...')
    const responseData = {
      url: completed.output, // Original Replicate URL (backup)
      supabaseUrl: supabaseAudioUrl, // Supabase storage URL (primary)
      filename: filename,
      pirateText: pirateText,
      originalText: text,
      intensity: intensity
    }
    console.log('Response data prepared:', responseData)

    return NextResponse.json(responseData)

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
      pitch: -2,  // Integer value between -12 and 12
      speed: 0.9
    }
  } else if (intensity <= 6) {
    return {
      emotion: "happy",
      pitch: 0,   // Integer value between -12 and 12
      speed: 1.0
    }
  } else if (intensity <= 8) {
    return {
      emotion: "angry",
      pitch: 3,   // Integer value between -12 and 12
      speed: 1.1
    }
  } else {
    return {
      emotion: "angry",
      pitch: 6,   // Integer value between -12 and 12
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