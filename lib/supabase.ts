import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Storage bucket name for audio files
export const AUDIO_BUCKET = 'voxvoice'

// Function to upload audio file to Supabase Storage
export async function uploadAudioToSupabase(audioBuffer: Buffer, filename: string): Promise<string> {
  try {
    console.log(`Starting upload to Supabase: ${filename}, size: ${audioBuffer.length} bytes`)
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .upload(filename, audioBuffer, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading to Supabase:', error)
      throw new Error(`Failed to upload to Supabase: ${error.message}`)
    }

    console.log('File uploaded successfully to Supabase:', data.path)

    // Get public URL for the uploaded file
    console.log('Getting public URL for uploaded file...')
    const { data: urlData } = supabase.storage
      .from(AUDIO_BUCKET)
      .getPublicUrl(filename)

    console.log('Public URL generated successfully:', urlData.publicUrl)
    
    return urlData.publicUrl
  } catch (error) {
    console.error('Error in uploadAudioToSupabase:', error)
    throw error
  }
}

// Function to delete audio file from Supabase Storage
export async function deleteAudioFromSupabase(filename: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .remove([filename])

    if (error) {
      console.error('Error deleting from Supabase:', error)
      throw new Error(`Failed to delete from Supabase: ${error.message}`)
    }

    console.log('File deleted successfully from Supabase:', filename)
  } catch (error) {
    console.error('Error in deleteAudioFromSupabase:', error)
    throw error
  }
}

// Function to get signed URL for private access (if needed)
export async function getSignedUrlFromSupabase(filename: string, expiresIn: number = 3600): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .createSignedUrl(filename, expiresIn)

    if (error) {
      console.error('Error creating signed URL:', error)
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return data.signedUrl
  } catch (error) {
    console.error('Error in getSignedUrlFromSupabase:', error)
    throw error
  }
} 