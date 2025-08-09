// Audio utility for playing meditation prompts and timer cues

interface AudioManager {
  playPrompt: (promptName: string) => Promise<void>
  playChime: (chimeName: string) => Promise<void>
  playWorkoutCue: (cueName: string) => Promise<void>
  playMotivationalCue: (cueName: string) => Promise<void>
  playMeditationCue: (cueName: string) => Promise<void>
  playChimeAndWait: (chimeName: string) => Promise<void>
  playWorkoutCueAndWait: (cueName: string) => Promise<void>
  playMeditationCueAndWait: (cueName: string) => Promise<void>
  playAmbientSound: (soundType: string) => Promise<void>
  pauseAmbientSound: () => void
  resumeAmbientSound: () => void
  stopAmbientSound: () => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  isMuted: () => boolean
  stopAll: () => void
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

    // Preload workout core cues
    const workoutCues = [
      'start', 'rest', 'round-1', 'round-2', 'round-3', 'round-4',
      'round-5', 'round-6', 'round-7', 'round-8', 'final-round', 'workout-complete'
    ]

    workoutCues.forEach(cue => {
      const audio = new Audio(`/audio/workout/core/${cue}.mp3`)
      audio.preload = 'auto'
      this.audioElements.set(cue, audio)
    })

    // Preload motivational cues
    const motivationalCues = [
      'youve-got-this', 'halfway-there', 'keep-going', 
      'almost-there', 'great-work', 'stay-strong'
    ]

    motivationalCues.forEach(cue => {
      const audio = new Audio(`/audio/workout/motivational/${cue}.mp3`)
      audio.preload = 'auto'
      this.audioElements.set(cue, audio)
    })

    // Preload chimes
    const chimes = [
      'start-chime', 'rest-chime', 'round-chime', 'completion-chime',
      'meditation-start-chime', 'meditation-end-chime', 'midway-chime'
    ]

    chimes.forEach(chime => {
      const audio = new Audio(`/audio/chimes/${chime}.mp3`)
      audio.preload = 'auto'
      this.audioElements.set(chime, audio)
    })

    // Preload meditation cues
    const meditationCues = [
      'meditation-beginning', 'meditation-complete', 'return-surroundings'
    ]

    meditationCues.forEach(cue => {
      const audio = new Audio(`/audio/meditation/cues/${cue}.mp3`)
      audio.preload = 'auto'
      this.audioElements.set(cue, audio)
    })

    // Preload ambient sounds
    const ambientSounds = ['rain', 'ocean', 'spa', 'nature', 'zen', 'calm']
    
    ambientSounds.forEach(sound => {
      const audio = new Audio(`/audio/meditation/ambient/${sound}.mp3`)
      audio.preload = 'auto'
      audio.loop = true // Ambient sounds should loop
      this.audioElements.set(`ambient-${sound}`, audio)
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

  async playWorkoutCue(cueName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(cueName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  async playMotivationalCue(cueName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(cueName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  async playMeditationCue(cueName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(cueName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  async playChimeAndWait(chimeName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(chimeName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
        // Wait for the audio to finish
        return new Promise((resolve) => {
          const onEnded = () => {
            audio.removeEventListener('ended', onEnded)
            resolve()
          }
          audio.addEventListener('ended', onEnded)
          // Fallback timeout in case the ended event doesn't fire
          setTimeout(resolve, 2000)
        })
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  async playWorkoutCueAndWait(cueName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(cueName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
        // Wait for the audio to finish
        return new Promise((resolve) => {
          const onEnded = () => {
            audio.removeEventListener('ended', onEnded)
            resolve()
          }
          audio.addEventListener('ended', onEnded)
          // Fallback timeout in case the ended event doesn't fire
          setTimeout(resolve, 3000)
        })
      } catch (error) {
        // Silent error handling for audio playback
      }
    }
  }

  async playMeditationCueAndWait(cueName: string): Promise<void> {
    if (this.muted) return

    const audio = this.audioElements.get(cueName)
    if (audio) {
      audio.volume = this.volume
      try {
        await audio.play()
        // Wait for the audio to finish
        return new Promise((resolve) => {
          const onEnded = () => {
            audio.removeEventListener('ended', onEnded)
            resolve()
          }
          audio.addEventListener('ended', onEnded)
          // Fallback timeout in case the ended event doesn't fire
          setTimeout(resolve, 4000)
        })
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

  stopAll(): void {
    this.audioElements.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  async playAmbientSound(soundType: string): Promise<void> {
    if (this.muted) return

    // Stop any currently playing ambient sounds first
    this.stopAmbientSound()

    const audio = this.audioElements.get(`ambient-${soundType}`)
    if (audio) {
      audio.volume = this.volume * 0.5 // Ambient sounds at half volume
      try {
        await audio.play()
      } catch (error) {
        console.error(`Error playing ambient sound ${soundType}:`, error)
        console.warn(`Make sure the file /audio/meditation/ambient/${soundType}.mp3 exists`)
      }
    } else {
      console.warn(`Ambient sound file for ${soundType} not found. Please add /audio/meditation/ambient/${soundType}.mp3`)
    }
  }

  pauseAmbientSound(): void {
    const ambientSounds = ['rain', 'ocean', 'spa', 'nature', 'zen', 'calm']
    ambientSounds.forEach(sound => {
      const audio = this.audioElements.get(`ambient-${sound}`)
      if (audio && !audio.paused) {
        audio.pause()
      }
    })
  }

  resumeAmbientSound(): void {
    const ambientSounds = ['rain', 'ocean', 'spa', 'nature', 'zen', 'calm']
    ambientSounds.forEach(sound => {
      const audio = this.audioElements.get(`ambient-${sound}`)
      if (audio && audio.paused) {
        audio.play().catch(error => {
          console.error(`Error resuming ambient sound ${sound}:`, error)
        })
      }
    })
  }

  stopAmbientSound(): void {
    const ambientSounds = ['rain', 'ocean', 'spa', 'nature', 'zen', 'calm']
    ambientSounds.forEach(sound => {
      const audio = this.audioElements.get(`ambient-${sound}`)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })
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

// Helper function to play workout cues
export async function playWorkoutCue(cueName: string): Promise<void> {
  const audioManager = getAudioManager()
  await audioManager.playWorkoutCue(cueName)
}

// Helper function to play motivational cues
export async function playMotivationalCue(cueName: string): Promise<void> {
  const audioManager = getAudioManager()
  await audioManager.playMotivationalCue(cueName)
}

// Helper function to play chimes
export async function playChime(chimeName: string): Promise<void> {
  const audioManager = getAudioManager()
  await audioManager.playChime(chimeName)
}

// Helper function to play meditation cues
export async function playMeditationCue(cueName: string): Promise<void> {
  const audioManager = getAudioManager()
  await audioManager.playMeditationCue(cueName)
} 