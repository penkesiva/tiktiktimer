// Audio utility for playing meditation prompts and timer cues

interface AudioManager {
  playPrompt: (promptName: string) => Promise<void>
  playChime: (chimeName: string) => Promise<void>
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  isMuted: () => boolean
}

class AudioManagerImpl implements AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map()
  private volume: number = 0.7
  private muted: boolean = false

  constructor() {
    this.preloadAudio()
  }

  private preloadAudio() {
    // Preload meditation prompts
    const prompts = [
      'take-deep-breath',
      'return-focus-breath', 
      'relax-jaw-shoulders',
      'doing-well-stay-present',
      'let-go-tension',
      'focus-breathing-rhythm',
      'thoughts-pass-clouds',
      'feel-peace-within'
    ]

    prompts.forEach(prompt => {
      const audio = new Audio(`/audio/meditation/prompts/${prompt}.mp3`)
      audio.preload = 'auto'
      this.audioElements.set(prompt, audio)
    })
  }

  async playPrompt(promptName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(promptName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  async playChime(chimeName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(chimeName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    // Update volume for all loaded audio elements
    this.audioElements.forEach(audio => {
      audio.volume = this.volume
    })
  }

  mute() {
    this.muted = true
  }

  unmute() {
    this.muted = false
  }

  isMuted(): boolean {
    return this.muted
  }
}

// Create a singleton instance
let audioManager: AudioManager | null = null

export function getAudioManager(): AudioManager {
  if (!audioManager) {
    audioManager = new AudioManagerImpl()
  }
  return audioManager
}

// Helper function to play meditation prompts
export async function playMeditationPrompt(promptIndex: number): Promise<void> {
  const prompts = [
    'take-deep-breath',
    'return-focus-breath',
    'relax-jaw-shoulders', 
    'doing-well-stay-present',
    'let-go-tension',
    'focus-breathing-rhythm',
    'thoughts-pass-clouds',
    'feel-peace-within'
  ]

  if (promptIndex >= 0 && promptIndex < prompts.length) {
    const audioManager = getAudioManager()
    await audioManager.playPrompt(prompts[promptIndex])
  }
} 