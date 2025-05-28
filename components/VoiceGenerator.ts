import Replicate from "replicate"

export interface VoiceGenerationResult {
  url: string
  duration?: number
}

class VoiceGeneratorService {
  private replicate: Replicate
  
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })
  }

  /**
   * Transform text to pirate speech and generate audio
   */
  async generate(text: string, intensity: number): Promise<VoiceGenerationResult> {
    try {
      // Transform the text to make it more pirate-like based on intensity
      const pirateText = this.transformToPirateSpeak(text, intensity)
      
      // Map intensity to emotion and voice parameters
      const { emotion, pitch, speed } = this.getVoiceParameters(intensity)

      const input = {
        text: pirateText,
        pitch: pitch,
        speed: speed,
        volume: 1,
        bitrate: 128000,
        channel: "mono" as const,
        emotion: emotion,
        voice_id: "R8_QBE6P33A", // This voice ID works well for pirate voices
        sample_rate: 32000,
        language_boost: "English",
        english_normalization: true
      }

      console.log('Generating voice with input:', input)

      const output = await this.replicate.run("minimax/speech-02-hd:latest", { input })
      
      // The output should have a url method or be a URL directly
      const audioUrl = typeof output === 'string' ? output : (output as any)?.url || (output as any)

      if (!audioUrl) {
        throw new Error('No audio URL returned from the API')
      }

      return {
        url: audioUrl,
        duration: undefined // Duration not provided by this API
      }
    } catch (error) {
      console.error('Voice generation failed:', error)
      throw new Error(`Failed to generate pirate voice: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Transform regular text into pirate speak based on intensity
   */
  private transformToPirateSpeak(text: string, intensity: number): string {
    let pirateText = text

    // Basic pirate transformations
    pirateText = pirateText.replace(/\byou\b/gi, 'ye')
    pirateText = pirateText.replace(/\byour\b/gi, 'yer')
    pirateText = pirateText.replace(/\bmy\b/gi, 'me')
    pirateText = pirateText.replace(/\bis\b/gi, 'be')
    pirateText = pirateText.replace(/\bare\b/gi, 'be')
    pirateText = pirateText.replace(/\bover\b/gi, 'o\'er')
    pirateText = pirateText.replace(/\bto\b/gi, 'ter')

    // Add pirate expressions based on intensity
    const expressions = this.getPirateExpressions(intensity)
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]
    
    // Add expression at the beginning or end
    if (Math.random() > 0.5) {
      pirateText = `${randomExpression} ${pirateText}`
    } else {
      pirateText = `${pirateText}, ${randomExpression.toLowerCase()}`
    }

    return pirateText
  }

  /**
   * Get voice parameters based on intensity level
   */
  private getVoiceParameters(intensity: number): { emotion: string, pitch: number, speed: number } {
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

  /**
   * Get pirate expressions based on intensity
   */
  private getPirateExpressions(intensity: number): string[] {
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
}

// Export a singleton instance
const VoiceGenerator = new VoiceGeneratorService()
export default VoiceGenerator 