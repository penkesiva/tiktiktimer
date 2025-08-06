'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { Button } from '@/components/ui/Button'

interface MeditationSettings {
  duration: number
  mode: 'silent' | 'guided' | 'ambient'
  soundType?: 'rain' | 'ocean' | 'bells'
  volume: number
}

const DURATION_OPTIONS = [5, 10, 15, 20, 30]

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
    duration: 10,
    mode: 'silent',
    volume: 0.7
  })
  
  const [time, setTime] = useState(settings.duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused) {
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
  }, [isRunning, isPaused, playEndChime])

  // Guided meditation prompts
  useEffect(() => {
    if (isRunning && !isPaused && settings.mode === 'guided' && time > 0) {
      const totalTime = settings.duration * 60
      const timeElapsed = totalTime - time
      const promptInterval = Math.floor(totalTime / (GUIDED_PROMPTS.length + 1))
      
      if (timeElapsed > 0 && timeElapsed % promptInterval === 0) {
        const promptIndex = Math.floor(timeElapsed / promptInterval) - 1
        if (promptIndex >= 0 && promptIndex < GUIDED_PROMPTS.length) {
          setCurrentPrompt(GUIDED_PROMPTS[promptIndex])
          setTimeout(() => setCurrentPrompt(null), 5000) // Show prompt for 5 seconds
        }
      }
    }
  }, [isRunning, isPaused, settings.mode, time, settings.duration])

  // Audio functions (placeholder - will be implemented with actual audio files)
  const playStartChime = useCallback(() => {
    if (!isMuted) {
      // TODO: Play start chime sound
      // console.log('Playing start chime')
    }
  }, [isMuted])

  const playEndChime = useCallback(() => {
    if (!isMuted) {
      // TODO: Play end chime sound
      // console.log('Playing end chime')
    }
  }, [isMuted])

  const playMidwayChime = useCallback(() => {
    if (!isMuted && settings.mode === 'guided') {
      // TODO: Play midway chime sound
      // console.log('Playing midway chime')
    }
  }, [isMuted, settings.mode])

  const startTimer = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
    setTime(settings.duration * 60)
    playStartChime()
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
    setIsMuted(!isMuted)
  }, [isMuted])

  const selectDuration = (duration: number) => {
    setSettings(prev => ({ ...prev, duration }))
    resetTimer()
  }

  const selectMode = (mode: MeditationSettings['mode']) => {
    setSettings(prev => ({ ...prev, mode }))
    resetTimer()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Meditation Timer</h1>
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
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meditation Settings</h3>
            
            {/* Duration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duration
              </label>
              <div className="grid grid-cols-5 gap-3">
                {DURATION_OPTIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => selectDuration(duration)}
                    className={cn(
                      'p-3 rounded-lg border text-center transition-colors',
                      settings.duration === duration
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="font-medium">{duration}</div>
                    <div className="text-sm text-gray-600">min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => selectMode('silent')}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-colors',
                    settings.mode === 'silent'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium">Silent</div>
                  <div className="text-sm text-gray-600">Chime at start and end only</div>
                </button>
                <button
                  onClick={() => selectMode('guided')}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-colors',
                    settings.mode === 'guided'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium">Guided</div>
                  <div className="text-sm text-gray-600">Voice prompts every few minutes</div>
                </button>
                <button
                  onClick={() => selectMode('ambient')}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-colors',
                    settings.mode === 'ambient'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium">Ambient</div>
                  <div className="text-sm text-gray-600">Background sounds (rain, ocean, bells)</div>
                </button>
              </div>
            </div>

            {/* Ambient Sound Selection */}
            {settings.mode === 'ambient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ambient Sound
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['rain', 'ocean', 'bells'].map((sound) => (
                    <button
                      key={sound}
                      onClick={() => setSettings(prev => ({ ...prev, soundType: sound as any }))}
                      className={cn(
                        'p-3 rounded-lg border text-center transition-colors capitalize',
                        settings.soundType === sound
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
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
        <div className="card">
          <TimerDisplay
            time={time}
            isRunning={isRunning}
            isPaused={isPaused}
            className="mb-8"
          />

          {/* Guided Prompt Display */}
          {currentPrompt && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center text-lg italic">
                "{currentPrompt}"
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRunning ? (
              <Button size="lg" onClick={startTimer}>
                <Play className="w-5 h-5 mr-2" />
                Start Meditation
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button size="lg" onClick={resumeTimer}>
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