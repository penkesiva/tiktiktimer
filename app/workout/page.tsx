'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, RotateCcw, Settings } from 'lucide-react'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getAudioManager, playWorkoutCue, playChime, playMotivationalCue } from '@/lib/audio'
import { WorkoutTopAd, WorkoutBottomAd } from '@/components/ads/GoogleAdsense'
import { OptimizedImage } from '@/components/ui/Image'

interface WorkoutSettings {
  workDuration: number
  restDuration: number
  rounds: number
  workoutType: string
  currentPreset?: string
}

const PRESET_WORKOUTS = [
  { name: 'Tabata', work: 20, rest: 10, rounds: 8 },
  { name: 'Yoga', work: 45, rest: 15, rounds: 6 },
  { name: 'Stretch', work: 30, rest: 10, rounds: 8 },
]

export default function WorkoutTimerPage() {
  const [settings, setSettings] = useState<WorkoutSettings>({
    workDuration: 30,
    restDuration: 10,
    rounds: 5,
    workoutType: 'custom',
    currentPreset: 'Custom'
  })
  
  const [time, setTime] = useState(settings.workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [phase, setPhase] = useState<'work' | 'rest' | 'break'>('work')

  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [showCustomTimer, setShowCustomTimer] = useState(false)

  // Audio functions
  const playStartCue = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    await audioManager.playChimeAndWait('start-chime')
    await audioManager.playWorkoutCueAndWait('start')
    setIsAudioPlaying(false)
  }, [])

  const playRestCue = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    await audioManager.playChimeAndWait('rest-chime')
    await audioManager.playWorkoutCueAndWait('rest')
    setIsAudioPlaying(false)
  }, [])

  const playRoundCue = useCallback(async (round: number) => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    await audioManager.playChimeAndWait('round-chime')
    if (round === settings.rounds) {
      await audioManager.playWorkoutCueAndWait('final-round')
    } else {
      await audioManager.playWorkoutCueAndWait(`round-${round}`)
    }
    setIsAudioPlaying(false)
  }, [settings.rounds])

  const playWorkoutCompleteCue = useCallback(async () => {
    setIsAudioPlaying(true)
    const audioManager = getAudioManager()
    await audioManager.playChimeAndWait('completion-chime')
    await audioManager.playWorkoutCueAndWait('workout-complete')
    setIsAudioPlaying(false)
  }, [])

  const playMotivationalCue = useCallback(async () => {
    const motivationalCues = ['youve-got-this', 'halfway-there', 'keep-going', 'almost-there', 'great-work', 'stay-strong']
    const randomCue = motivationalCues[Math.floor(Math.random() * motivationalCues.length)]
    const audioManager = getAudioManager()
    await audioManager.playMotivationalCue(randomCue)
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused && !isAudioPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished for current phase
            if (phase === 'work') {
              // Work phase finished
              if (currentRound < settings.rounds) {
                // More rounds to go - start rest period
                setPhase('rest')
                setTime(settings.restDuration)
                playRestCue()
              } else {
                // All rounds completed
                setPhase('break')
                setTime(0)
                playWorkoutCompleteCue()
                setIsRunning(false)
              }
            } else if (phase === 'rest') {
              // Rest phase finished - start next round
              const nextRound = currentRound + 1
              if (nextRound <= settings.rounds) {
                setCurrentRound(nextRound)
                setPhase('work')
                setTime(settings.workDuration)
                playRoundCue(nextRound)
              }
            }
            return prevTime
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, phase, currentRound, settings, isAudioPlaying, playRestCue, playRoundCue, playWorkoutCompleteCue])

  // Motivational cues during workout
  useEffect(() => {
    if (isRunning && phase === 'work' && !isAudioPlaying) {
      const interval = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
          playMotivationalCue()
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [isRunning, phase, isAudioPlaying, playMotivationalCue])

  const startTimer = useCallback(async () => {
    if (!isRunning) {
      setCurrentRound(1)
      setPhase('work')
      setTime(settings.workDuration)
      setIsRunning(true)
      setIsPaused(false)
      await playStartCue()
    }
  }, [isRunning, settings.workDuration, playStartCue])

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentRound(1)
    setPhase('work')
    setTime(settings.workDuration)
  }

  const applyPreset = useCallback((preset: typeof PRESET_WORKOUTS[0]) => {
    setSettings({
      workDuration: preset.work,
      restDuration: preset.rest,
      rounds: preset.rounds,
      workoutType: 'preset',
      currentPreset: preset.name
    })
    setTime(preset.work)
    setCurrentRound(1)
    setPhase('work')
  }, [])

  const applyCustomTimer = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      workoutType: 'custom',
      currentPreset: 'Custom'
    }))
    setTime(settings.workDuration)
    setCurrentRound(1)
    setPhase('work')
  }, [settings.workDuration])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sport-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Strategic Background Images - Fewer, Bigger, Better Positioned */}
      <div className="absolute top-20 right-4 w-56 h-56">
        <OptimizedImage
          src="/images/workout3.png"
          alt="Workout Timer - Fitness Training Background"
          width={224}
          height={224}
          className="rounded-full"
        />
      </div>
      
      <div className="absolute bottom-4 left-4 w-48 h-48">
        <OptimizedImage
          src="/images/workout4.png"
          alt="Workout Timer - Exercise Background"
          width={192}
          height={192}
          className="rounded-full"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Ad */}
        <div className="mb-6">
          <WorkoutTopAd />
        </div>

        {/* Always Visible Workout Presets */}
        <div className="card-sport mb-8 relative overflow-hidden">
          <h3 className="text-2xl font-bold text-sport-800 mb-6">Quick Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRESET_WORKOUTS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-4 bg-gradient-to-br from-sport-100 to-sport-200 border border-sport-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left relative"
              >
                <div className="absolute top-3 right-3 text-xs font-medium text-sport-600 bg-white/80 px-2 py-1 rounded-lg">
                  {preset.work}s / {preset.rest}s
                </div>
                <div className="font-bold text-sport-800">{preset.name}</div>
                <div className="text-xs text-sport-500 mt-1">{preset.rounds} rounds</div>
              </button>
            ))}
          </div>
        </div>

                {/* Custom Timer Panel */}
        <div 
          className={cn(
            "card-sport mb-8 relative overflow-hidden transition-all duration-300",
            {
              "cursor-pointer hover:shadow-lg": !showCustomTimer
            }
          )}
          onClick={() => !showCustomTimer && setShowCustomTimer(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-sport-800">Custom Timer</h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCustomTimer(!showCustomTimer)
              }}
              className="text-sport-600 hover:text-sport-700 transition-colors"
            >
              {showCustomTimer ? 'Hide' : 'Show'}
            </button>
          </div>
          
                    {showCustomTimer && (
            <div>
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex flex-col items-center">
                                  <label className="block text-sm font-medium text-sport-700 mb-2">
                  Work (secs)
                </label>
                  <input
                    type="number"
                    min="1"
                    max="3600"
                    value={settings.workDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 1 }))}
                    className="w-24 p-2 border border-sport-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sport-500 focus:border-transparent text-lg font-medium text-center"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                                  <label className="block text-sm font-medium text-sport-700 mb-2">
                  Rest (secs)
                </label>
                  <input
                    type="number"
                    min="1"
                    max="3600"
                    value={settings.restDuration}
                    onChange={(e) => setSettings(prev => ({ ...prev, restDuration: parseInt(e.target.value) || 1 }))}
                    className="w-24 p-2 border border-sport-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sport-500 focus:border-transparent text-lg font-medium text-center"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-sport-700 mb-2">
                    Rounds
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.rounds}
                    onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) || 1 }))}
                    className="w-24 p-2 border border-sport-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sport-500 focus:border-transparent text-lg font-medium text-center"
                  />
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    applyCustomTimer()
                  }}
                  className="bg-gradient-to-r from-sport-500 to-sport-600 hover:from-sport-600 hover:to-sport-700 text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sport-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  title="Apply Custom Timer"
                >
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="card-sport relative overflow-hidden">
          {/* Current Timer Info */}
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-sport-600 bg-sport-100 px-4 py-2 rounded-lg inline-block">
              {settings.currentPreset} • {settings.workDuration}s work / {settings.restDuration}s rest • {settings.rounds} rounds
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
          />

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRunning ? (
              <Button 
                size="lg" 
                variant="sport"
                onClick={() => startTimer().catch(console.error)}
                disabled={isAudioPlaying}
              >
                <Play className="w-5 h-5 mr-2" />
                {isAudioPlaying ? 'Starting...' : 'Start Workout'}
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button size="lg" variant="sport" onClick={resumeTimer}>
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

        {/* Bottom Ad */}
        <div className="mt-8">
          <WorkoutBottomAd />
        </div>
      </div>
    </div>
  )
} 