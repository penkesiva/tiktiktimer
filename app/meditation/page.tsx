'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Music, Mic, MicOff, User, UserX, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { getAudioManager, playMeditationCue } from '@/lib/audio'
import { trackTimerStart, trackTimerComplete, trackTimerPause, trackPresetSelect, trackAudioToggle } from '@/lib/analytics'

import { OptimizedImage } from '@/components/ui/Image'
import Head from 'next/head'

interface MeditationSettings {
  duration: number
  mode: 'silent' | 'guided' | 'ambient'
  soundType?: 'rain' | 'ocean' | 'spa' | 'nature' | 'zen' | 'calm'
  musicType?: 'rain' | 'ocean' | 'spa' | 'nature' | 'zen' | 'calm'
  volume: number
  currentPreset?: string
}

const DURATION_OPTIONS = [1, 2, 5, 10, 15, 20, 30]

const MEDITATION_PRESETS = [
  { name: 'Quick Calm', duration: 5, mode: 'guided' as const, musicType: 'calm' as const },
  { name: 'Mindful Break', duration: 10, mode: 'guided' as const, musicType: 'rain' as const },
  { name: 'Nature Connection', duration: 10, mode: 'guided' as const, musicType: 'nature' as const },
  { name: 'Zen Moment', duration: 10, mode: 'guided' as const, musicType: 'zen' as const },
  { name: 'Deep Relaxation', duration: 15, mode: 'guided' as const, musicType: 'spa' as const },
  { name: 'Ocean Peace', duration: 15, mode: 'guided' as const, musicType: 'ocean' as const },
  { name: 'Forest Serenity', duration: 15, mode: 'guided' as const, musicType: 'nature' as const },
  { name: 'Inner Calm', duration: 15, mode: 'guided' as const, musicType: 'calm' as const },
  { name: 'Nature Escape', duration: 20, mode: 'guided' as const, musicType: 'rain' as const },
  { name: 'Zen Mastery', duration: 20, mode: 'guided' as const, musicType: 'zen' as const },
  { name: 'Zen Session', duration: 30, mode: 'guided' as const, musicType: 'ocean' as const },
  { name: 'Wilderness Journey', duration: 30, mode: 'guided' as const, musicType: 'nature' as const },
  { name: 'Ultimate Zen', duration: 30, mode: 'guided' as const, musicType: 'zen' as const },
  { name: 'Deep Calm', duration: 30, mode: 'guided' as const, musicType: 'calm' as const }
].sort((a, b) => a.duration - b.duration)

const GUIDED_PROMPTS = [
  "Take a deep breath in... and out.",
  "Return your focus to your breath.",
  "Relax your jaw and shoulders.",
  "You're doing well. Stay present.",
  "Let go of any tension in your body.",
  "Focus on the rhythm of your breathing.",
  "Allow thoughts to pass like clouds.",
  "Feel the peace within you.",
]

export default function MeditationTimerPage() {
  const [settings, setSettings] = useState<MeditationSettings>({
    duration: 5,
    mode: 'guided',
    musicType: 'spa',
    volume: 0.7,
    currentPreset: 'Quick Calm'
  })
  
  const [time, setTime] = useState(settings.duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isGuidedMuted, setIsGuidedMuted] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [showSettingsChangeConfirm, setShowSettingsChangeConfirm] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [pendingSettingsChange, setPendingSettingsChange] = useState<{ type: 'duration' | 'mode' | 'soundType' | 'musicType' | 'preset', value: any } | null>(null)
  const [wasMusicPlaying, setWasMusicPlaying] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showAllPresets, setShowAllPresets] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Audio functions using actual audio files
  const playStartChime = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    
    // Always play start chime (unmutable)
    await audioManager.playChimeAndWait('meditation-start-chime')
    
    // Play voice cue only if not muted
    if (!isGuidedMuted) {
      await audioManager.playMeditationCueAndWait('meditation-beginning')
    }
    
    setIsAudioPlaying(false)
  }, [isGuidedMuted])

  const playEndChime = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    
    // Always play end chime (unmutable)
    await audioManager.playChimeAndWait('meditation-end-chime')
    
    // Play voice cue only if not muted
    if (!isGuidedMuted) {
      await audioManager.playMeditationCueAndWait('meditation-complete')
    }
    
    setIsAudioPlaying(false)
    
    // Stop background music after the chime/voice cue completes
    if (settings.musicType) {
      audioManager.stopAmbientSound()
    }
  }, [isGuidedMuted, settings.musicType])

  const playMidwayChime = useCallback(async () => {
    // Only play midway chime if guided mode is enabled
    if (settings.mode === 'guided') {
      const audioManager = getAudioManager()
      
      // Always play midway chime (unmutable)
      await audioManager.playChime('midway-chime')
    }
  }, [settings.mode])

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && !isAudioPlaying) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Meditation complete
            trackTimerComplete('meditation', settings.duration)
            setIsRunning(false)
            playEndChime()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isPaused, isAudioPlaying, playEndChime])

  // Initialize mute states (both start as unmuted)
  // Note: We don't sync with audio manager's global mute state to avoid conflicts

  // Set client flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check screen size for responsive preset display
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1280) // xl breakpoint
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // Stop any playing audio
      const audioManager = getAudioManager()
      audioManager.stopAll()
    }
  }, [])

  // Update timer when duration changes (only when not running)
  useEffect(() => {
    if (!isRunning) {
      setTime(settings.duration * 60)
    }
  }, [settings.duration, isRunning])

  // Guided meditation prompts
  useEffect(() => {
    if (isRunning && !isPaused && !isAudioPlaying && settings.mode === 'guided' && time > 0 && !isGuidedMuted) {
      const totalTime = settings.duration * 60
      const timeElapsed = totalTime - time
      
      // Determine number of prompts based on duration (4-8 prompts)
      let numPrompts = 4 // minimum
      if (settings.duration >= 10) numPrompts = 5
      if (settings.duration >= 15) numPrompts = 6
      if (settings.duration >= 20) numPrompts = 7
      if (settings.duration >= 25) numPrompts = 8 // maximum
      
      const promptInterval = Math.floor(totalTime / (numPrompts + 1))
      
      if (timeElapsed > 0 && timeElapsed % promptInterval === 0) {
        const promptIndex = Math.floor(timeElapsed / promptInterval) - 1
        if (promptIndex >= 0 && promptIndex < numPrompts) {
          setCurrentPrompt(GUIDED_PROMPTS[promptIndex])
          // Play the actual audio prompt only if guided audio is not muted
          if (!isGuidedMuted) {
            const audioManager = getAudioManager()
            const promptNames = [
              'take-deep-breath',
              'return-focus-breath',
              'relax-jaw-shoulders',
              'doing-well-stay-present',
              'let-go-tension',
              'focus-breathing-rhythm',
              'thoughts-pass-clouds',
              'feel-peace-within'
            ]
            if (promptIndex >= 0 && promptIndex < promptNames.length) {
              // Temporarily unmute audio manager for this prompt
              const wasMuted = audioManager.isMuted()
              if (wasMuted) audioManager.unmute()
              
              audioManager.playPrompt(promptNames[promptIndex]).catch(() => {
                // Silent error handling for audio playback
              })
              
              // Restore mute state
              if (wasMuted) audioManager.mute()
            }
          }
          setTimeout(() => setCurrentPrompt(null), 5000) // Show prompt for 5 seconds
        }
      }
    }
  }, [isRunning, isPaused, isAudioPlaying, settings.mode, time, settings.duration, isGuidedMuted])

  // Background music playback for all presets
  useEffect(() => {
    // Debug logging to understand state
    console.log('Meditation Background Music Debug:', {
      isRunning,
      isPaused,
      musicType: settings.musicType,
      isMuted,
      time,
      duration: settings.duration,
      currentPreset: settings.currentPreset
    })
    
    if (isRunning && !isPaused && settings.musicType && !isMuted) {
      // Play background music when meditation starts
      const playBackgroundMusic = async () => {
        try {
          console.log('Starting meditation background music:', settings.musicType)
          const audioManager = getAudioManager()
          await audioManager.playAmbientSound(settings.musicType!)
          console.log('Meditation background music started successfully')
        } catch (error) {
          console.error('Error playing meditation background music:', error)
        }
      }
      
      // Start background music immediately when meditation is running
      playBackgroundMusic()
    } else if (isPaused && settings.musicType) {
      // Pause background music when meditation is paused
      console.log('Pausing meditation background music')
      const audioManager = getAudioManager()
      audioManager.pauseAmbientSound()
    } else if (isMuted && settings.musicType) {
      // Stop background music when muted
      console.log('Stopping meditation background music (muted)')
      const audioManager = getAudioManager()
      audioManager.stopAmbientSound()
    }
  }, [isRunning, isPaused, settings.musicType, isMuted])

  // Stop background music when timer is reset or meditation is completely stopped
  useEffect(() => {
    if (!isRunning && time === settings.duration * 60 && settings.musicType) {
      // Timer has been reset - stop background music
      const audioManager = getAudioManager()
      audioManager.stopAmbientSound()
    }
  }, [isRunning, time, settings.duration, settings.musicType])

  const startTimer = useCallback(async () => {
    if (!isRunning && !countdown) {
      // Track meditation start
      trackTimerStart('meditation', settings.duration)
      
      // Start countdown
      setCountdown(3)
      
      // Countdown sequence: 3, 2, 1, Begin
      const countdownInterval = setInterval(async () => {
        setCountdown((prev) => {
          if (prev === null) return null
          
          if (prev === 1) {
            // Show Begin for 1 second
            setTimeout(() => {
              setCountdown(null)
              
              // Start the actual meditation
              setIsRunning(true)
              setIsPaused(false)
              setTime(settings.duration * 60)
              setWasMusicPlaying(settings.musicType ? true : false)
              
              // Play start chime after countdown
              playStartChime()
            }, 1000) // 1 second delay to show Begin animation
            
            return 0 // Show Begin for 1 second
          }
          
          if (prev <= 0) {
            clearInterval(countdownInterval)
            return null
          }
          

          
          return prev - 1
        })
      }, 1000)
    }
  }, [isRunning, countdown, settings.duration, playStartChime, settings.musicType])

  const pauseTimer = useCallback(() => {
    setIsPaused(true)
    trackTimerPause('meditation')
    // Pause background music if playing (don't stop it completely)
    if (settings.musicType && !isMuted) {
      setWasMusicPlaying(true)
      const audioManager = getAudioManager()
      audioManager.pauseAmbientSound()
    } else {
      setWasMusicPlaying(false)
    }
  }, [settings.musicType, isMuted])

  const resumeTimer = useCallback(() => {
    setIsPaused(false)
    // Resume background music if it was playing before pause and not muted
    if (settings.musicType && !isMuted && wasMusicPlaying) {
      const audioManager = getAudioManager()
      audioManager.resumeAmbientSound()
    }
  }, [settings.musicType, isMuted, wasMusicPlaying])

  const restartSession = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setTime(settings.duration * 60)
    setCurrentPrompt(null)
    setShowRestartConfirm(false)
    setWasMusicPlaying(false)
    setCountdown(null)
    
    // Reinitialize audio system after restart
    const audioManager = getAudioManager()
    audioManager.reinitializeAudio()
  }, [settings.duration])

  const confirmRestart = useCallback(() => {
    setShowRestartConfirm(true)
  }, [])

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    
    // Stop or resume background music
    const audioManager = getAudioManager()
    if (newMutedState) {
      audioManager.stopAmbientSound()
    } else if (isRunning && settings.musicType) {
      audioManager.playAmbientSound(settings.musicType)
    }
  }, [isMuted, isRunning, settings.musicType])

  const toggleGuidedMute = useCallback(() => {
    const newGuidedMutedState = !isGuidedMuted
    setIsGuidedMuted(newGuidedMutedState)
    
    // If muting guided audio, clear current prompt
    if (newGuidedMutedState) {
      setCurrentPrompt(null)
    }
  }, [isGuidedMuted])

  const selectDuration = (duration: number) => {
    if (isRunning) {
      setPendingSettingsChange({ type: 'duration', value: duration })
      setShowSettingsChangeConfirm(true)
    } else {
      setSettings(prev => ({ ...prev, duration }))
      restartSession()
    }
  }

  const selectMode = (mode: MeditationSettings['mode']) => {
    if (isRunning) {
      setPendingSettingsChange({ type: 'mode', value: mode })
      setShowSettingsChangeConfirm(true)
    } else {
      setSettings(prev => ({ ...prev, mode }))
      setCurrentPrompt(null)
      restartSession()
    }
  }

  const selectSoundType = (soundType: MeditationSettings['soundType']) => {
    if (isRunning) {
      setPendingSettingsChange({ type: 'soundType', value: soundType })
      setShowSettingsChangeConfirm(true)
    } else {
      setSettings(prev => ({ ...prev, soundType }))
      // Stop any current ambient sound and reset
      const audioManager = getAudioManager()
      audioManager.stopAmbientSound()
      // Reinitialize audio system when changing sound type
      audioManager.reinitializeAudio()
      restartSession()
    }
  }

  const selectMusicType = (musicType: MeditationSettings['musicType']) => {
    if (isRunning) {
      setPendingSettingsChange({ type: 'musicType', value: musicType })
      setShowSettingsChangeConfirm(true)
    } else {
      setSettings(prev => ({ ...prev, musicType }))
      // Stop any current ambient sound and reset
      const audioManager = getAudioManager()
      audioManager.stopAmbientSound()
      // Reinitialize audio system when changing music type
      audioManager.reinitializeAudio()
      restartSession()
    }
  }

  const confirmSettingsChange = () => {
    if (pendingSettingsChange) {
      const { type, value } = pendingSettingsChange
      
      // Stop current session
      setIsRunning(false)
      setIsPaused(false)
      setCurrentPrompt(null)
      
      // Stop ambient sounds
      const audioManager = getAudioManager()
      audioManager.stopAmbientSound()
      
      // Apply the new setting
      if (type === 'duration') {
        setSettings(prev => ({ ...prev, duration: value }))
        setTime(value * 60)
      } else if (type === 'mode') {
        setSettings(prev => ({ ...prev, mode: value }))
        setCurrentPrompt(null)
      } else if (type === 'soundType') {
        setSettings(prev => ({ ...prev, soundType: value }))
        
        // Reinitialize audio system when changing sound type
        audioManager.reinitializeAudio()
      } else if (type === 'musicType') {
        setSettings(prev => ({ ...prev, musicType: value }))
        
        // Reinitialize audio system when changing music type
        audioManager.reinitializeAudio()
      } else if (type === 'preset') {
        setSettings({
          duration: value.duration,
          mode: value.mode,
          soundType: value.soundType,
          volume: 0.7,
          currentPreset: value.name
        })
        setTime(value.duration * 60)
        setCurrentPrompt(null)
        
        // Reinitialize audio system for new preset
        audioManager.reinitializeAudio()
      }
      
      setPendingSettingsChange(null)
      setShowSettingsChangeConfirm(false)
    }
  }

  const cancelSettingsChange = () => {
    setPendingSettingsChange(null)
    setShowSettingsChangeConfirm(false)
  }

  const applyPreset = useCallback((preset: typeof MEDITATION_PRESETS[0]) => {
    if (isRunning) {
      setPendingSettingsChange({ type: 'preset', value: preset })
      setShowSettingsChangeConfirm(true)
    } else {
      // Stop any current ambient sound first
      const audioManager = getAudioManager()
      audioManager.stopAmbientSound()
      
      setSettings({
        duration: preset.duration,
        mode: preset.mode,
        musicType: preset.musicType,
        volume: 0.7,
        currentPreset: preset.name
      })
      setTime(preset.duration * 60)
      setCurrentPrompt(null)
      
      // Reinitialize audio system for new preset
      audioManager.reinitializeAudio()
    }
  }, [isRunning])

  return (
    <>
      <Head>
        {/* Enhanced SEO Meta Tags */}
        <title>Meditation Timer - Free Guided & Silent Sessions | Mindfulness App | TikTikTimer</title>
        <meta name="description" content="Free meditation timer app with guided sessions, silent meditation, ambient sounds, and professional voice prompts. Perfect for mindfulness, stress relief, and mental wellness." />
        <meta name="keywords" content="meditation timer, guided meditation, silent meditation, mindfulness app, meditation app, ambient sounds, guided sessions, stress relief, mental wellness, zen meditation, breathing exercises" />
        
        {/* Open Graph Enhanced */}
        <meta property="og:title" content="Free Meditation Timer - Guided & Silent Sessions | TikTikTimer" />
        <meta property="og:description" content="Professional meditation timer with guided sessions, ambient sounds, and voice prompts. Free mindfulness app for stress relief and mental wellness." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tiktiktimer.com/meditation" />
        <meta property="og:image" content="https://tiktiktimer.com/images/meditation.png" />
        <meta property="og:image:width" content="750" />
        <meta property="og:image:height" content="1334" />
        
        {/* Twitter Enhanced */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Meditation Timer - Guided & Silent Sessions" />
        <meta name="twitter:description" content="Professional meditation timer with guided sessions and ambient sounds. Free mindfulness app for stress relief." />
        <meta name="twitter:image" content="https://tiktiktimer.com/images/meditation.png" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://tiktiktimer.com/meditation" />
        
        {/* Structured Data for Meditation Timer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TikTikTimer Meditation Timer",
              "description": "Free meditation timer app with guided sessions, silent meditation, and ambient sounds",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Guided Meditation Sessions",
                "Silent Meditation Timer",
                "Ambient Sound Modes (Rain, Ocean, Spa, Nature, Zen, Calm)",
                "Professional Voice Prompts",
                "Customizable Duration (1-30 minutes)",
                "Quick Calm (5 min), Mindful Break (10 min)",
                "Nature Connection, Zen Moment, Deep Relaxation",
                "Ocean Peace, Forest Serenity, Inner Calm",
                "Nature Escape, Zen Mastery, Zen Session",
                "Wilderness Journey, Ultimate Zen, Deep Calm"
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-calm-50 via-green-50 to-emerald-100 relative overflow-hidden pb-8">
      {/* Falling Animation Background */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Falling particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="falling-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
          
          {/* Falling snowflakes */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`snowflake-${i}`}
              className="falling-snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Strategic Background Images - Responsive and Mobile-Friendly */}
      <div className="absolute top-20 right-4 w-32 h-32 md:w-40 lg:w-56 md:h-40 lg:h-56 hidden sm:block">
        <OptimizedImage
          src="/images/meditation2.png"
          alt="Meditation Timer - Mindfulness Background"
          width={224}
          height={224}
          className="rounded-full opacity-80"
        />
      </div>
      
      <div className="absolute bottom-4 left-4 w-24 h-24 md:w-32 lg:w-48 md:h-32 lg:h-48 hidden sm:block">
        <OptimizedImage
          src="/images/meditation3.png"
          alt="Meditation Timer - Zen Practice Background"
          width={192}
          height={192}
          className="rounded-full opacity-80"
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-calm-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Find Your Peace</h1>

            <div className="flex items-center space-x-2">
              {/* Volume controls moved to timer card */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-8 sm:pb-12 relative z-10">


        {/* Meditation Presets */}
        <div className="card-calm mb-6 relative overflow-hidden">
          <h3 className="text-lg md:text-xl font-bold text-calm-800 mb-3 md:mb-4">Quick Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
            {/* Show first 6 presets on small screens, first 8 on large screens (4x2 grid) */}
            {MEDITATION_PRESETS.slice(0, isLargeScreen ? 8 : 6).map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={cn(
                  'p-2 md:p-3 border rounded-xl hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-left relative min-h-[70px] md:min-h-[80px]',
                  settings.currentPreset === preset.name
                    ? 'bg-gradient-to-br from-calm-200 to-calm-300 border-calm-400 shadow-md'
                    : 'bg-gradient-to-br from-calm-100 to-calm-200 border-calm-200 hover:border-calm-300'
                )}
              >
                <div className="absolute top-1 right-1 md:top-2 md:right-2 text-xs font-medium text-calm-600 bg-white/80 px-1.5 py-0.5 rounded-md">
                  {preset.duration}min
                </div>
                <div className={cn(
                  'font-bold text-xs md:text-sm',
                  settings.currentPreset === preset.name ? 'text-calm-900' : 'text-calm-800'
                )}>
                  {preset.name}
                </div>
                <div className="text-xs text-calm-500 mt-0.5 capitalize">
                  {preset.musicType && `${preset.musicType} • `}{preset.mode}
                </div>
              </button>
            ))}
          </div>

          {/* Collapsible section for additional presets */}
          {MEDITATION_PRESETS.length > (isLargeScreen ? 8 : 6) && (
            <div className="mt-3">
              <button
                onClick={() => setShowAllPresets(!showAllPresets)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-calm-50 hover:bg-calm-100 border border-calm-200 rounded-lg transition-all duration-200 text-calm-700 hover:text-calm-800 text-sm"
              >
                <span className="font-medium">
                  {showAllPresets ? 'Show Less' : `+${MEDITATION_PRESETS.length - (isLargeScreen ? 8 : 6)} More`}
                </span>
                {showAllPresets ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {/* Additional presets */}
              {showAllPresets && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 mt-3 animate-fade-in">
                  {MEDITATION_PRESETS.slice(isLargeScreen ? 8 : 6).map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={cn(
                        'p-2 md:p-3 border rounded-xl hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-left relative min-h-[70px] md:min-h-[80px]',
                        settings.currentPreset === preset.name
                          ? 'bg-gradient-to-br from-calm-200 to-calm-300 border-calm-400 shadow-md'
                          : 'bg-gradient-to-br from-calm-100 to-calm-200 border-calm-200 hover:border-calm-300'
                      )}
                    >
                      <div className="absolute top-1 right-1 md:top-2 md:right-2 text-xs font-medium text-calm-600 bg-white/80 px-1.5 py-0.5 rounded-md">
                        {preset.duration}min
                      </div>
                      <div className={cn(
                        'font-bold text-xs md:text-sm',
                        settings.currentPreset === preset.name ? 'text-calm-900' : 'text-calm-800'
                      )}>
                        {preset.name}
                      </div>
                      <div className="text-xs text-calm-500 mt-0.5 capitalize">
                        {preset.musicType && `${preset.musicType} • `}{preset.mode}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="card-calm relative overflow-hidden">
          {/* Dual Mute Controls - Top Right */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            {/* Background Music Mute */}
            <button
              onClick={toggleMute}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm",
                isMuted 
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50/80 bg-red-50/50" 
                  : "text-calm-600 hover:text-calm-700 hover:bg-calm-50/80 bg-calm-50/50"
              )}
              title={isMuted ? "Unmute Music" : "Mute Music"}
            >
                              {isMuted ? <Music className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            </button>

            {/* Guided Audio Mute */}
            {settings.mode === 'guided' && (
              <button
                onClick={toggleGuidedMute}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm",
                  isGuidedMuted 
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50/80 bg-red-50/50" 
                    : "text-calm-600 hover:text-calm-700 hover:bg-calm-50/80 bg-calm-50/50"
                )}
                title={isGuidedMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
              >
                {isGuidedMuted ? <UserX className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Filling Animation Background */}
          {isRunning && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-calm-200/30 to-calm-300/30 transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, ((settings.duration * 60 - time) / (settings.duration * 60)) * 100)}%`
              }}
            />
          )}





          {/* Current Timer Info */}
          <div className="text-center mb-4">
            <div className="text-xs md:text-sm font-medium text-calm-600 bg-calm-100 px-3 md:px-4 py-2 rounded-lg inline-block max-w-full">
              <div className="hidden sm:block">
                <span className="font-bold">{settings.currentPreset}</span> • {settings.duration}min • {settings.mode} {settings.musicType && `• ${settings.musicType}`}
              </div>
              <div className="block sm:hidden">
                <span className="font-bold">{settings.currentPreset}</span> • {settings.duration}m • {settings.mode}
              </div>
            </div>
          </div>

          <div className="mb-1">
            <TimerDisplay
              time={time}
              isRunning={isRunning}
              isPaused={isPaused}
              isAudioPlaying={isAudioPlaying}
              className="!mb-0"
              showStatusDots={false}
              showAudioIndicator={false}
            />
          </div>



          {/* Guided prompts are now handled by audio only */}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            {!isRunning ? (
              <Button 
                size="lg" 
                variant="calm"
                onClick={() => startTimer().catch((error) => {
                  // Silent error handling for production
                  console.error('Timer start error:', error)
                })}
                disabled={isAudioPlaying || countdown !== null}
                className="min-w-[140px] md:min-w-[160px]"
              >
                <Play className="w-5 h-5 mr-2" />
                {countdown ? `Starting in ${countdown}...` : (isAudioPlaying ? 'Starting...' : 'Start Meditation')}
              </Button>
            ) : (
              <div className="flex items-center space-x-3 md:space-x-4">
                {isPaused ? (
                  <Button 
                    size="lg" 
                    variant="calm" 
                    onClick={resumeTimer}
                    className="min-w-[120px] md:min-w-[140px]"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    onClick={pauseTimer}
                    className="min-w-[120px] md:min-w-[140px]"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                <button
                  onClick={confirmRestart}
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                  title="Restart Session"
                >
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            )}
          </div>
        </div>


      </div>



      {/* Restart Session Confirmation Modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Restart Session?</h3>
              <p className="text-gray-600 mb-6">
                This will restart your current meditation session. Are you sure you want to continue?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={restartSession}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Change Confirmation Modal */}
      {showSettingsChangeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Change Settings?</h3>
              <p className="text-gray-600 mb-6">
                You have an active meditation session. Changing settings will stop your current session. Do you want to continue?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelSettingsChange}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSettingsChange}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                >
                  Change Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* Floating Countdown Overlay */}
      {countdown !== null && (
        <>
          {/* Subtle backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" />
          {/* Countdown card */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="text-center p-8 bg-gradient-to-r from-calm-100 to-calm-200 rounded-3xl border-4 border-calm-300 shadow-2xl backdrop-blur-sm">
              <div className={`text-7xl md:text-8xl font-bold text-calm-700 mb-4 transition-all duration-300 ${
                countdown === 0 ? 'animate-bounce scale-110' : 'animate-pulse'
              }`}>
                {countdown === 0 ? 'Begin' : countdown}
              </div>
              <div className="text-xl md:text-2xl font-medium text-calm-600">
                {countdown === 0 ? 'Find your peace...' : 'Prepare yourself...'}
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
} 