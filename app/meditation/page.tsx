'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { Button } from '@/components/ui/Button'
import { getAudioManager, playMeditationPrompt, playMeditationCue } from '@/lib/audio'

interface MeditationSettings {
  duration: number
  mode: 'silent' | 'guided' | 'ambient'
  soundType?: 'rain' | 'ocean' | 'bells'
  volume: number
}

const DURATION_OPTIONS = [1, 2, 5, 10, 15, 20, 30]

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
    mode: 'silent',
    volume: 0.7
  })
  
  const [time, setTime] = useState(settings.duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  // Audio functions using actual audio files
  const playStartChime = useCallback(async () => {
    if (!isMuted) {
      setIsAudioPlaying(true)
      const audioManager = getAudioManager()
      await audioManager.playChimeAndWait('meditation-start-chime')
      await audioManager.playMeditationCueAndWait('meditation-beginning')
      setIsAudioPlaying(false)
    } else {
      setIsAudioPlaying(false)
    }
  }, [isMuted])

  const playEndChime = useCallback(async () => {
    if (!isMuted) {
      setIsAudioPlaying(true)
      const audioManager = getAudioManager()
      await audioManager.playChimeAndWait('meditation-end-chime')
      await audioManager.playMeditationCueAndWait('meditation-complete')
      setIsAudioPlaying(false)
    } else {
      setIsAudioPlaying(false)
    }
  }, [isMuted])

  const playMidwayChime = useCallback(async () => {
    if (!isMuted && settings.mode === 'guided') {
      const audioManager = getAudioManager()
      await audioManager.playChime('midway-chime')
    }
  }, [isMuted, settings.mode])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused && !isAudioPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Meditation complete
            setIsRunning(false)
            playEndChime()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, isAudioPlaying, playEndChime])

  // Update timer when duration changes (only when not running)
  useEffect(() => {
    if (!isRunning) {
      setTime(settings.duration * 60)
    }
  }, [settings.duration, isRunning])

  // Guided meditation prompts
  useEffect(() => {
    if (isRunning && !isPaused && !isAudioPlaying && settings.mode === 'guided' && time > 0) {
      const totalTime = settings.duration * 60
      const timeElapsed = totalTime - time
      const promptInterval = Math.floor(totalTime / (GUIDED_PROMPTS.length + 1))
      
      if (timeElapsed > 0 && timeElapsed % promptInterval === 0) {
        const promptIndex = Math.floor(timeElapsed / promptInterval) - 1
        if (promptIndex >= 0 && promptIndex < GUIDED_PROMPTS.length) {
          setCurrentPrompt(GUIDED_PROMPTS[promptIndex])
          // Play the actual audio prompt
          playMeditationPrompt(promptIndex).catch(() => {
            // Silent error handling for audio playback
          })
          setTimeout(() => setCurrentPrompt(null), 5000) // Show prompt for 5 seconds
        }
      }
    }
  }, [isRunning, isPaused, isAudioPlaying, settings.mode, time, settings.duration])

  const startTimer = useCallback(async () => {
    setIsRunning(true)
    setIsPaused(false)
    setTime(settings.duration * 60)
    await playStartChime()
  }, [settings.duration, playStartChime])

  const pauseTimer = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeTimer = useCallback(() => {
    setIsPaused(false)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setTime(settings.duration * 60)
    setCurrentPrompt(null)
  }, [settings.duration])

  const toggleMute = useCallback(() => {
    const audioManager = getAudioManager()
    if (isMuted) {
      audioManager.unmute()
      setIsMuted(false)
    } else {
      audioManager.mute()
      setIsMuted(true)
    }
  }, [isMuted])

  const selectDuration = (duration: number) => {
    setSettings(prev => ({ ...prev, duration }))
    resetTimer()
  }

  const selectMode = (mode: MeditationSettings['mode']) => {
    setSettings(prev => ({ ...prev, mode }))
    // Clear any current prompt when mode changes
    setCurrentPrompt(null)
    resetTimer()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 via-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-calm-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold gradient-text-calm">Meditation Timer</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="card-calm mb-8">
            <h3 className="text-2xl font-bold text-calm-800 mb-6">Meditation Settings</h3>
            
            {/* Duration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-calm-700 mb-3">
                Duration
              </label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                {DURATION_OPTIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => selectDuration(duration)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                      settings.duration === duration
                        ? 'border-calm-500 bg-gradient-to-br from-calm-100 to-calm-200 text-calm-700 shadow-lg'
                        : 'border-calm-200 hover:border-calm-300 bg-white/80 backdrop-blur-sm hover:bg-white'
                    )}
                  >
                    <div className="font-bold text-lg">{duration}</div>
                    <div className="text-sm text-gray-600">min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-calm-700 mb-3">
                Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => selectMode('silent')}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                    settings.mode === 'silent'
                      ? 'border-calm-500 bg-gradient-to-br from-calm-100 to-calm-200 text-calm-700 shadow-lg'
                      : 'border-calm-200 hover:border-calm-300 bg-white/80 backdrop-blur-sm hover:bg-white'
                  )}
                >
                  <div className="font-bold text-lg">Silent</div>
                  <div className="text-sm text-gray-600">Chime at start and end only</div>
                </button>
                <button
                  onClick={() => selectMode('guided')}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                    settings.mode === 'guided'
                      ? 'border-calm-500 bg-gradient-to-br from-calm-100 to-calm-200 text-calm-700 shadow-lg'
                      : 'border-calm-200 hover:border-calm-300 bg-white/80 backdrop-blur-sm hover:bg-white'
                  )}
                >
                  <div className="font-bold text-lg">Guided</div>
                  <div className="text-sm text-gray-600">Voice prompts every few minutes</div>
                </button>
                <button
                  onClick={() => selectMode('ambient')}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                    settings.mode === 'ambient'
                      ? 'border-calm-500 bg-gradient-to-br from-calm-100 to-calm-200 text-calm-700 shadow-lg'
                      : 'border-calm-200 hover:border-calm-300 bg-white/80 backdrop-blur-sm hover:bg-white'
                  )}
                >
                  <div className="font-bold text-lg">Ambient</div>
                  <div className="text-sm text-gray-600">Background sounds (rain, ocean, bells)</div>
                </button>
              </div>
            </div>

            {/* Ambient Sound Selection */}
            {settings.mode === 'ambient' && (
              <div>
                <label className="block text-sm font-medium text-calm-700 mb-3">
                  Ambient Sound
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['rain', 'ocean', 'bells'].map((sound) => (
                    <button
                      key={sound}
                      onClick={() => setSettings(prev => ({ ...prev, soundType: sound as any }))}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 capitalize',
                        settings.soundType === sound
                          ? 'border-calm-500 bg-gradient-to-br from-calm-100 to-calm-200 text-calm-700 shadow-lg'
                          : 'border-calm-200 hover:border-calm-300 bg-white/80 backdrop-blur-sm hover:bg-white'
                      )}
                    >
                      {sound}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer Display */}
        <div className="card-calm">
          <TimerDisplay
            time={time}
            isRunning={isRunning}
            isPaused={isPaused}
            isAudioPlaying={isAudioPlaying}
            className="mb-8"
          />

          {/* Guided Prompt Display */}
          {currentPrompt && (
            <div className="mb-6 p-6 bg-gradient-to-br from-calm-100 to-calm-200 border border-calm-200 rounded-2xl shadow-lg">
              <p className="text-calm-800 text-center text-xl italic font-medium">
                "{currentPrompt}"
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRunning ? (
              <Button 
                size="lg" 
                variant="calm"
                onClick={() => startTimer().catch(console.error)}
                disabled={isAudioPlaying}
              >
                <Play className="w-5 h-5 mr-2" />
                {isAudioPlaying ? 'Starting...' : 'Start Meditation'}
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button size="lg" variant="calm" onClick={resumeTimer}>
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button size="lg" variant="secondary" onClick={pauseTimer}>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={resetTimer}>
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
} 