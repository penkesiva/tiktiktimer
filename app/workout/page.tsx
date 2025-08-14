'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Music, Mic, MicOff, User, UserX } from 'lucide-react'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getAudioManager, playWorkoutCue, playChime, playMotivationalCue } from '@/lib/audio'

import { OptimizedImage } from '@/components/ui/Image'
import Head from 'next/head'

interface WorkoutSettings {
  workDuration: number
  restDuration: number
  rounds: number
  workoutType: string
  currentPreset?: string
}

const STATIC_PRESETS = [
  { name: 'Tabata', work: 20, rest: 10, rounds: 8 },
  { name: 'HIIT', work: 30, rest: 15, rounds: 6 },
  { name: 'Strength', work: 45, rest: 20, rounds: 5 },
  { name: 'Cardio', work: 60, rest: 30, rounds: 4 },
  { name: 'Quick Burn', work: 15, rest: 10, rounds: 10 },
  { name: 'Endurance', work: 90, rest: 30, rounds: 3 },
]

export default function WorkoutTimerPage() {
  const [settings, setSettings] = useState<WorkoutSettings>({
    workDuration: 20,
    restDuration: 10,
    rounds: 8,
    workoutType: 'preset',
    currentPreset: 'Tabata'
  })

  // Add refs to prevent rapid state changes
  const musicStateRef = useRef<{ isPlaying: boolean; lastChange: number }>({
    isPlaying: false,
    lastChange: 0
  })
  
  // Add flag to prevent music from starting during restart
  const isRestartingRef = useRef(false)

  // Get all presets including dynamic custom preset
  const getAllPresets = useCallback(() => {
    const customPreset = {
      name: 'Custom',
      work: settings.workDuration,
      rest: settings.restDuration,
      rounds: settings.rounds,
      isCustom: true
    }
    // Put Custom preset at the end with distinct styling
    return [...STATIC_PRESETS, customPreset]
  }, [settings.workDuration, settings.restDuration, settings.rounds])
  
  const [time, setTime] = useState(20)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [phase, setPhase] = useState<'work' | 'rest' | 'break'>('work')

  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [isAudioCuesMuted, setIsAudioCuesMuted] = useState(false)
  const [isWorkoutMusicMuted, setIsWorkoutMusicMuted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const [isEditingCustom, setIsEditingCustom] = useState(false)
  const [showSettingsChangeConfirm, setShowSettingsChangeConfirm] = useState(false)
  const [pendingPreset, setPendingPreset] = useState<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Audio functions
  const playStartCue = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    
    // Always play start chime (unmutable)
    await audioManager.playChimeAndWait('start-chime')
    
    // Play voice cue only if not muted
    if (!isAudioCuesMuted) {
      await audioManager.playWorkoutCueAndWait('start')
    }
    
    // Start music after chime/voice cue finishes
    if (!isWorkoutMusicMuted) {
      audioManager.playWorkoutMusic()
    }
    
    setIsAudioPlaying(false)
  }, [isAudioCuesMuted, isWorkoutMusicMuted])

  const playRestCue = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    
    // Stop any currently playing audio cues first
    audioManager.stopAll()
    
    // Pause music during voice cue
    if (!isWorkoutMusicMuted) {
      audioManager.pauseWorkoutMusic()
    }
    
    // Always play rest chime (unmutable)
    await audioManager.playChimeAndWait('rest-chime')
    
    // Play voice cue only if not muted
    if (!isAudioCuesMuted) {
      await audioManager.playWorkoutCueAndWait('rest')
    }
    
    // Music stays paused during rest period
    
    setIsAudioPlaying(false)
  }, [isAudioCuesMuted, isWorkoutMusicMuted])

  const playRoundCue = useCallback(async (round: number) => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    
    // Stop any currently playing audio cues first
    audioManager.stopAll()
    
    // Pause music during voice cue
    if (!isWorkoutMusicMuted) {
      audioManager.pauseWorkoutMusic()
    }
    
    // Always play round chime (unmutable)
    await audioManager.playChimeAndWait('round-chime')
    
    // Play voice cue only if not muted
    if (!isAudioCuesMuted) {
      if (round === settings.rounds) {
        await audioManager.playWorkoutCueAndWait('final-round')
      } else {
        await audioManager.playWorkoutCueAndWait(`round-${round}`)
      }
    }
    
    // Resume music after chime/voice cue
    if (!isWorkoutMusicMuted) {
      audioManager.resumeWorkoutMusic()
    }
    
    setIsAudioPlaying(false)
  }, [settings.rounds, isAudioCuesMuted, isWorkoutMusicMuted])

  const playWorkoutCue = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    
    // Stop any currently playing audio cues first
    audioManager.pauseWorkoutMusic()
    
    // Always play completion chime (unmutable)
    await audioManager.playChimeAndWait('completion-chime')
    
    // Play voice cue only if not muted
    if (!isAudioCuesMuted) {
      await audioManager.playWorkoutCueAndWait('workout-complete')
    }
    
    // No music resume - workout complete
    
    setIsAudioPlaying(false)
  }, [isAudioCuesMuted, isWorkoutMusicMuted])

  const playMotivationalCue = useCallback(async () => {
    // Only play motivational cues if voice cues are not muted
    if (isAudioCuesMuted) return
    
    const motivationalCues = ['youve-got-this', 'halfway-there', 'keep-going', 'almost-there', 'great-work', 'stay-strong']
    const randomCue = motivationalCues[Math.floor(Math.random() * motivationalCues.length)]
    const audioManager = getAudioManager()
    
    // Pause music during voice cue
    if (!isWorkoutMusicMuted) {
      audioManager.pauseWorkoutMusic()
    }
    
    await audioManager.playMotivationalCue(randomCue)
    
    // Resume music after voice cue
    if (!isWorkoutMusicMuted) {
      audioManager.resumeWorkoutMusic()
    }
  }, [isAudioCuesMuted, isWorkoutMusicMuted])

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && !isAudioPlaying) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished for current phase
            if (phase === 'work') {
              // Work phase finished
              if (currentRound < settings.rounds) {
                // More rounds to go - start rest period
                // Don't change state immediately - wait for audio to complete
                playRestCue().then(() => {
                  setPhase('rest')
                  setTime(settings.restDuration)
                })
                return prevTime // Keep current time until audio completes
              } else {
                // All rounds completed
                playWorkoutCue().then(() => {
                  setPhase('break')
                  setTime(0)
                  setIsRunning(false)
                  
                  // Stop workout music when workout completes
                  const audioManager = getAudioManager()
                  audioManager.stopWorkoutMusic()
                })
                return prevTime // Keep current time until audio completes
              }
            } else if (phase === 'rest') {
              // Rest phase finished - start next round
              const nextRound = currentRound + 1
              if (nextRound <= settings.rounds) {
                // Don't change state immediately - wait for audio to complete
                playRoundCue(nextRound).then(() => {
                  setCurrentRound(nextRound)
                  setPhase('work')
                  setTime(settings.workDuration)
                })
                return prevTime // Keep current time until audio completes
              }
            }
            return prevTime
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isPaused, phase, currentRound, settings, isAudioPlaying, playRestCue, playRoundCue, playWorkoutCue])

  // Motivational cues during workout
  useEffect(() => {
    if (isRunning && phase === 'work' && !isAudioPlaying && !isAudioCuesMuted) {
      const interval = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
          playMotivationalCue()
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [isRunning, phase, isAudioPlaying, playMotivationalCue, isAudioCuesMuted])



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

  // Monitor workout music mute state with debouncing
  useEffect(() => {
    // Don't start music if we're in the middle of restarting
    if (isRestartingRef.current) {
      return
    }
    
    // Additional safety: don't start music if session is not actively running
    if (!isRunning || isPaused) {
      return
    }
    
    const audioManager = getAudioManager()
    const now = Date.now()
    const minInterval = 500 // Minimum 500ms between music state changes
    
    if (isWorkoutMusicMuted) {
      if (!musicStateRef.current.isPlaying || (now - musicStateRef.current.lastChange) > minInterval) {
        audioManager.stopWorkoutMusic()
        musicStateRef.current.isPlaying = false
        musicStateRef.current.lastChange = now
      }
    } else if (phase === 'work' && !isAudioPlaying) {
      // Only start music if no audio cues are playing and enough time has passed
      if (!musicStateRef.current.isPlaying && (now - musicStateRef.current.lastChange) > minInterval) {
        audioManager.playWorkoutMusic()
        musicStateRef.current.isPlaying = true
        musicStateRef.current.lastChange = now
      }
    }
  }, [isWorkoutMusicMuted, isRunning, isPaused, phase, isAudioPlaying])

  const startTimer = useCallback(async () => {
    if (!isRunning && !countdown) {
      // Start countdown
      setCountdown(3)
      
      // Countdown sequence: 3, 2, 1, GO!
      const countdownInterval = setInterval(async () => {
        setCountdown((prev) => {
          if (prev === null) return null
          
          if (prev === 1) {
            // Show GO! for 1 second
            setTimeout(() => {
              setCountdown(null)
              
              // Start the actual workout
              setCurrentRound(1)
              setPhase('work')
              setTime(settings.workDuration)
              setIsRunning(true)
              setIsPaused(false)
              
              // Play start cue after countdown
              playStartCue()
            }, 1000) // 1 second delay to show GO! animation
            
            return 0 // Show GO! for 1 second
          }
          
          if (prev <= 0) {
            clearInterval(countdownInterval)
            return null
          }
          

          
          return prev - 1
        })
      }, 1000)
    }
  }, [isRunning, countdown, settings.workDuration, playStartCue])

  const pauseTimer = () => {
    setIsPaused(true)
    const audioManager = getAudioManager()
    audioManager.pauseWorkoutMusic()
  }

  const resumeTimer = () => {
    setIsPaused(false)
    if (!isWorkoutMusicMuted && phase === 'work') {
      const audioManager = getAudioManager()
      audioManager.resumeWorkoutMusic()
    }
  }

  const restartSession = () => {
    // Set restarting flag to prevent music from starting
    isRestartingRef.current = true
    
    // Stop all audio immediately
    const audioManager = getAudioManager()
    audioManager.stopAll()
    
    // Reset all timer states
    setIsRunning(false)
    setIsPaused(false)
    setCurrentRound(1)
    setPhase('work')
    setTime(settings.workDuration)
    setShowRestartConfirm(false)
    
    // Reset audio states
    setIsAudioPlaying(false)
    setCountdown(null)
    
    // Clear any pending intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Reset music state refs
    musicStateRef.current.isPlaying = false
    musicStateRef.current.lastChange = 0
    
    // Keep restarting flag active longer to prevent music from starting
    setTimeout(() => {
      isRestartingRef.current = false
    }, 500) // Increased delay to 500ms
  }

  const confirmRestart = () => {
    setShowRestartConfirm(true)
  }



  const toggleAudioCuesMute = () => {
    setIsAudioCuesMuted(!isAudioCuesMuted)
  }

  const toggleWorkoutMusicMute = () => {
    const newMutedState = !isWorkoutMusicMuted
    setIsWorkoutMusicMuted(newMutedState)
    
    const audioManager = getAudioManager()
    if (newMutedState) {
      // If muting, stop the workout music
      audioManager.stopWorkoutMusic()
    } else if (isRunning && !isPaused && phase === 'work') {
      // If unmuting and timer is running in work phase, start the workout music
      audioManager.playWorkoutMusic()
    }
  }

  const applyPreset = useCallback((preset: any) => {
    // If session is running, show confirmation first
    if (isRunning || isPaused) {
      setPendingPreset(preset)
      setShowSettingsChangeConfirm(true)
      return
    }

    // Otherwise apply immediately
    setSettings({
      workDuration: preset.work,
      restDuration: preset.rest,
      rounds: preset.rounds,
      workoutType: preset.isCustom ? 'custom' : 'preset',
      currentPreset: preset.name
    })
    setTime(preset.work)
    setCurrentRound(1)
    setPhase('work')
  }, [isRunning, isPaused])



  return (
    <>
      <Head>
        {/* Enhanced SEO Meta Tags */}
        <title>Workout Timer - Free Interval Training App | Tabata, HIIT, Strength | TikTikTimer</title>
        <meta name="description" content="Free workout timer app with interval training, Tabata, HIIT, strength training, and cardio workouts. Professional audio cues, motivational prompts, and customizable intervals." />
        <meta name="keywords" content="workout timer, interval training, Tabata timer, HIIT timer, strength training, cardio workout, fitness timer, exercise timer, workout app, interval app, Tabata app, HIIT app" />
        
        {/* Open Graph Enhanced */}
        <meta property="og:title" content="Free Workout Timer - Interval Training, Tabata, HIIT | TikTikTimer" />
        <meta property="og:description" content="Professional workout timer with interval training, Tabata, HIIT, strength, and cardio workouts. Free to use with audio cues and motivational prompts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tiktiktimer.com/workout" />
        <meta property="og:image" content="https://tiktiktimer.com/images/workout1.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        
        {/* Twitter Enhanced */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Workout Timer - Interval Training & Tabata" />
        <meta name="twitter:description" content="Professional interval training timer with Tabata, HIIT, strength, and cardio workouts. Free to use with audio guidance." />
        <meta name="twitter:image" content="https://tiktiktimer.com/images/workout1.png" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://tiktiktimer.com/workout" />
        
        {/* Structured Data for Workout Timer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TikTikTimer Workout Timer",
              "description": "Free interval training workout timer with Tabata, HIIT, strength, and cardio workouts",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Tabata Timer (20s work, 10s rest, 8 rounds)",
                "HIIT Timer (30s work, 15s rest, 6 rounds)",
                "Strength Timer (45s work, 20s rest, 5 rounds)",
                "Cardio Timer (60s work, 30s rest, 4 rounds)",
                "Quick Burn (15s work, 10s rest, 10 rounds)",
                "Endurance (90s work, 30s rest, 3 rounds)",
                "Custom Interval Settings",
                "Professional Audio Cues",
                "Motivational Prompts",
                "Background Workout Music"
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-sport-50 via-sport-100 to-sport-200 pb-8">
      {/* Strategic Background Images - Responsive and Mobile-Friendly */}
      <div className="absolute top-20 right-4 w-32 h-32 md:w-40 lg:w-56 md:h-40 lg:h-56 hidden sm:block">
        <OptimizedImage
          src="/images/workout3.png"
          alt="Workout Timer - Fitness Training Background"
          width={224}
          height={224}
          className="rounded-full opacity-80"
        />
      </div>
      
      <div className="absolute bottom-4 left-4 w-24 h-24 md:w-32 lg:w-48 md:h-32 lg:h-48 hidden sm:block">
        <OptimizedImage
          src="/images/workout4.png"
          alt="Workout Timer - Exercise Background"
          width={192}
          height={192}
          className="rounded-full opacity-80"
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-sport-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">Let's Do It</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-8 sm:pb-12 relative z-10">


        {/* Workout Presets */}
        <div className="card-sport mb-6 relative overflow-hidden">
          <h3 className="text-lg md:text-xl font-bold text-sport-800 mb-3 md:mb-4">Quick Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {/* Show first 4 presets (first row) */}
            {getAllPresets().slice(0, 4).map((preset: any) => (
              <button
                key={preset.name}
                onClick={() => {
                  if (preset.isCustom) {
                    setIsEditingCustom(true)
                  } else {
                    applyPreset(preset)
                  }
                }}
                className={cn(
                  "p-2 md:p-3 border rounded-xl hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-left relative min-h-[70px] md:min-h-[80px]",
                  preset.isCustom
                    ? "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 hover:border-purple-400"
                    : settings.currentPreset === preset.name
                    ? "bg-gradient-to-br from-sport-300 to-sport-400 border-sport-400 shadow-md"
                    : "bg-gradient-to-br from-sport-100 to-sport-200 border-sport-200 hover:border-sport-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 right-1 md:top-2 md:right-2 text-xs font-medium px-1.5 py-0.5 rounded-md",
                  preset.isCustom 
                    ? "text-purple-700 bg-purple-50/90" 
                    : "text-sport-600 bg-white/80"
                )}>
                  {preset.work}s/{preset.rest}s
                </div>
                <div className={cn(
                  "font-bold text-xs md:text-sm",
                  preset.isCustom 
                    ? "text-purple-800" 
                    : settings.currentPreset === preset.name 
                    ? "text-sport-900" 
                    : "text-sport-800"
                )}>
                  {preset.name}
                </div>
                <div className={cn(
                  "text-xs mt-0.5 font-medium",
                  preset.isCustom ? "text-purple-600" : "text-sport-500"
                )}>
                  {preset.rounds} rounds
                </div>
              </button>
            ))}
          </div>

          {/* Second row with remaining presets including Custom */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mt-3">
            {getAllPresets().slice(4).map((preset: any) => (
              <button
                key={preset.name}
                onClick={() => {
                  if (preset.isCustom) {
                    setIsEditingCustom(true)
                  } else {
                    applyPreset(preset)
                  }
                }}
                className={cn(
                  "p-2 md:p-3 border rounded-xl hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-left relative min-h-[70px] md:min-h-[80px]",
                  preset.isCustom
                    ? "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 hover:border-purple-400"
                    : settings.currentPreset === preset.name
                    ? "bg-gradient-to-br from-sport-300 to-sport-400 border-sport-400 shadow-md"
                    : "bg-gradient-to-br from-sport-100 to-sport-200 border-sport-200 hover:border-sport-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 right-1 md:top-2 md:right-2 text-xs font-medium px-1.5 py-0.5 rounded-md",
                  preset.isCustom 
                    ? "text-purple-700 bg-purple-50/90" 
                    : "text-sport-600 bg-white/80"
                )}>
                  {preset.work}s/{preset.rest}s
                </div>
                <div className={cn(
                  "font-bold text-xs md:text-sm",
                  preset.isCustom 
                    ? "text-purple-800" 
                    : settings.currentPreset === preset.name 
                    ? "text-sport-900" 
                    : "text-sport-800"
                )}>
                  {preset.name}
                </div>
                <div className={cn(
                  "text-xs mt-0.5 font-medium",
                  preset.isCustom ? "text-purple-600" : "text-sport-500"
                )}>
                  {preset.rounds} rounds
                </div>
              </button>
            ))}
          </div>


        </div>

        {/* Timer Display */}
        <div className="card-sport relative overflow-hidden">
          {/* Dual Mute Controls - Top Right */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            {/* Workout Music Mute */}
            <button
              onClick={toggleWorkoutMusicMute}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm",
                isWorkoutMusicMuted 
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50/80 bg-red-50/50" 
                  : "text-sport-600 hover:text-sport-700 hover:bg-sport-50/80 bg-sport-50/50"
              )}
              title={isWorkoutMusicMuted ? "Unmute Workout Music" : "Mute Workout Music"}
            >
                              {isWorkoutMusicMuted ? <Music className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            </button>

                               {/* Audio Cues Mute */}
                   <button
                     onClick={toggleAudioCuesMute}
                     className={cn(
                       "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm",
                       isAudioCuesMuted 
                         ? "text-red-500 hover:text-red-600 hover:bg-red-50/80 bg-red-50/50" 
                         : "text-sport-600 hover:text-sport-700 hover:bg-sport-50/80 bg-sport-50/50"
                     )}
                     title={isAudioCuesMuted ? "Unmute Voice Cues" : "Mute Voice Cues"}
                   >
                     {isAudioCuesMuted ? <UserX className="w-4 h-4" /> : <User className="w-4 h-4" />}
                   </button>
          </div>

          {/* Filling Animation Background */}
          {isRunning && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-sport-200/30 to-sport-300/30 transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, ((currentRound - 1) / settings.rounds) * 100 + (phase === 'work' ? ((settings.workDuration - time) / settings.workDuration) * (1 / settings.rounds) * 100 : (phase === 'rest' ? ((currentRound - 1) / settings.rounds) * 100 : 0)))}%`
              }}
            />
          )}



          {/* Current Timer Info */}
          <div className="text-center mb-4">
            <div className="text-xs md:text-sm font-medium text-sport-600 bg-sport-100 px-3 md:px-4 py-2 rounded-lg inline-block max-w-full">
              <div className="hidden sm:block">
                <span className="font-bold">{settings.currentPreset}</span> • {settings.workDuration}s work / {settings.restDuration}s rest • {settings.rounds} rounds
              </div>
              <div className="block sm:hidden">
                <span className="font-bold">{settings.currentPreset}</span> • {settings.workDuration}s/{settings.restDuration}s • {settings.rounds}r
              </div>
            </div>
          </div>
          
          <TimerDisplay
            time={time}
            isRunning={isRunning}
            isPaused={isPaused}
            currentRound={currentRound}
            totalRounds={settings.rounds}
            phase={phase}
            isAudioPlaying={isAudioPlaying}
            className="mb-8"
            showStatusDots={false}
            showAudioIndicator={false}
          />



          {/* Controls */}
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            {!isRunning ? (
              <Button 
                size="lg" 
                variant="sport"
                onClick={() => startTimer().catch((error) => {
                  // Silent error handling for production
                  console.error('Timer start error:', error)
                })}
                disabled={isAudioPlaying || countdown !== null}
                className="min-w-[140px] md:min-w-[160px]"
              >
                <Play className="w-5 h-5 mr-2" />
                {countdown ? `Starting in ${countdown}...` : (isAudioPlaying ? 'Starting...' : 'Start Workout')}
              </Button>
            ) : (
              <div className="flex items-center space-x-3 md:space-x-4">
                {isPaused ? (
                  <Button 
                    size="lg" 
                    variant="sport" 
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
                This will restart your workout session from the beginning. Are you sure you want to continue?
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

      {/* Custom Timer Editing Modal */}
      {isEditingCustom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-sport-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-sport-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Custom Workout</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex flex-col">
                  <label className="block text-xs font-medium text-sport-700 mb-1">
                    Work Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3600"
                    value={settings.workDuration}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        // Allow empty input temporarily
                        setSettings(prev => ({ ...prev, workDuration: 0 }))
                      } else {
                        const numValue = parseInt(value)
                        if (!isNaN(numValue) && numValue >= 1) {
                          setSettings(prev => ({ ...prev, workDuration: numValue }))
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // When input loses focus, ensure minimum value
                      if (settings.workDuration < 1) {
                        setSettings(prev => ({ ...prev, workDuration: 1 }))
                      }
                    }}
                    className="w-full p-2 border border-sport-200 rounded-lg bg-white focus:ring-2 focus:ring-sport-500 focus:border-transparent text-base font-medium text-center"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-xs font-medium text-sport-700 mb-1">
                    Rest Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3600"
                    value={settings.restDuration}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        // Allow empty input temporarily
                        setSettings(prev => ({ ...prev, restDuration: 0 }))
                      } else {
                        const numValue = parseInt(value)
                        if (!isNaN(numValue) && numValue >= 1) {
                          setSettings(prev => ({ ...prev, restDuration: numValue }))
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // When input loses focus, ensure minimum value
                      if (settings.restDuration < 1) {
                        setSettings(prev => ({ ...prev, restDuration: 1 }))
                      }
                    }}
                    className="w-full p-2 border border-sport-200 rounded-lg bg-white focus:ring-2 focus:ring-sport-500 focus:border-transparent text-base font-medium text-center"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-xs font-medium text-sport-700 mb-1">
                    Number of Rounds
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.rounds}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        // Allow empty input temporarily
                        setSettings(prev => ({ ...prev, rounds: 0 }))
                      } else {
                        const numValue = parseInt(value)
                        if (!isNaN(numValue) && numValue >= 1) {
                          setSettings(prev => ({ ...prev, rounds: numValue }))
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // When input loses focus, ensure minimum value
                      if (settings.rounds < 1) {
                        setSettings(prev => ({ ...prev, rounds: 1 }))
                      }
                    }}
                    className="w-full p-2 border border-sport-200 rounded-lg bg-white focus:ring-2 focus:ring-sport-500 focus:border-transparent text-base font-medium text-center"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditingCustom(false)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Ensure minimum values before applying
                    const workDuration = Math.max(1, settings.workDuration)
                    const restDuration = Math.max(1, settings.restDuration)
                    const rounds = Math.max(1, settings.rounds)
                    
                    applyPreset({
                      name: 'Custom',
                      work: workDuration,
                      rest: restDuration,
                      rounds: rounds,
                      isCustom: true
                    })
                    setIsEditingCustom(false)
                  }}
                  className="flex-1 px-3 py-2 bg-sport-600 text-white rounded-lg hover:bg-sport-700 transition-colors text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Change Confirmation Modal */}
      {showSettingsChangeConfirm && pendingPreset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-sport-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-sport-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Change Workout?</h3>
              <p className="text-gray-600 mb-4">
                You're currently in the middle of a workout. Changing to <span className="font-semibold text-sport-600">{pendingPreset.name}</span> will reset your progress.
              </p>
              <div className="bg-sport-50 rounded-lg p-3 mb-6">
                <div className="text-sm text-sport-700">
                  <div><span className="font-medium">New settings:</span></div>
                  <div>{pendingPreset.work}s work / {pendingPreset.rest}s rest • {pendingPreset.rounds} rounds</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSettingsChangeConfirm(false)
                    setPendingPreset(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Stop any playing audio first
                    const audioManager = getAudioManager()
                    audioManager.stopAll()
                    setIsAudioPlaying(false)
                    
                    // Apply the pending preset
                    setSettings({
                      workDuration: pendingPreset.work,
                      restDuration: pendingPreset.rest,
                      rounds: pendingPreset.rounds,
                      workoutType: pendingPreset.isCustom ? 'custom' : 'preset',
                      currentPreset: pendingPreset.name
                    })
                    setTime(pendingPreset.work)
                    setCurrentRound(1)
                    setPhase('work')
                    setIsRunning(false)
                    setIsPaused(false)
                    
                    // Clear the confirmation state
                    setShowSettingsChangeConfirm(false)
                    setPendingPreset(null)
                  }}
                  className="flex-1 px-4 py-2 bg-sport-600 text-white rounded-xl hover:bg-sport-700 transition-colors"
                >
                  Change
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
            <div className="text-center p-8 bg-gradient-to-r from-sport-100 to-sport-200 rounded-3xl border-4 border-sport-300 shadow-2xl backdrop-blur-sm">
              <div className={`text-7xl md:text-8xl font-bold text-sport-700 mb-4 transition-all duration-300 ${
                countdown === 0 ? 'animate-bounce scale-110' : 'animate-pulse'
              }`}>
                {countdown === 0 ? 'GO!' : countdown}
              </div>
              <div className="text-xl md:text-2xl font-medium text-sport-600">
                {countdown === 0 ? 'Let\'s get started!' : 'Get ready...'}
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  )
} 