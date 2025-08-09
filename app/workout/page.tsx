'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
    workDuration: 60,
    restDuration: 20,
    rounds: 4,
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
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
    if (isRunning && !isPaused && !isAudioPlaying) {
      intervalRef.current = setInterval(() => {
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
      if (intervalRef.current) clearInterval(intervalRef.current)
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
    setShowResetConfirm(false)
  }

  const confirmReset = () => {
    setShowResetConfirm(true)
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
          <h3 className="text-lg md:text-xl font-bold text-sport-800 mb-4 md:mb-6">Quick Presets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {PRESET_WORKOUTS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={cn(
                  "p-3 md:p-4 border rounded-2xl hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 text-left relative min-h-[80px] md:min-h-[100px]",
                  settings.currentPreset === preset.name
                    ? "bg-gradient-to-br from-sport-300 to-sport-400 border-sport-400 shadow-lg"
                    : "bg-gradient-to-br from-sport-100 to-sport-200 border-sport-200"
                )}
              >
                <div className="absolute top-2 right-2 md:top-3 md:right-3 text-sm md:text-base font-semibold text-sport-600 bg-white/90 px-3 py-2 rounded-lg shadow-sm">
                  {preset.work}s / {preset.rest}s
                </div>
                <div className="font-bold text-sport-800 text-sm md:text-base">{preset.name}</div>
                <div className={cn(
                  "text-sm md:text-base mt-1 font-medium",
                  settings.currentPreset === preset.name ? "text-sport-100" : "text-sport-500"
                )}>
                  {preset.rounds} rounds
                </div>
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
            <h3 className="text-lg md:text-xl font-bold text-sport-800">Custom Timer</h3>
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
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 justify-center">
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
                    className="w-20 md:w-24 p-2 border border-sport-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sport-500 focus:border-transparent text-base md:text-lg font-medium text-center"
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
                    className="w-20 md:w-24 p-2 border border-sport-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sport-500 focus:border-transparent text-base md:text-lg font-medium text-center"
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
                    className="w-20 md:w-24 p-2 border border-sport-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-sport-500 focus:border-transparent text-base md:text-lg font-medium text-center"
                  />
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-4 md:mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    applyCustomTimer()
                  }}
                  className="bg-gradient-to-r from-sport-500 to-sport-600 hover:from-sport-600 hover:to-sport-700 text-white p-3 md:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sport-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                  title="Apply Custom Timer"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="card-sport relative overflow-hidden">
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
          />

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            {!isRunning ? (
              <Button 
                size="lg" 
                variant="sport"
                onClick={() => startTimer().catch(console.error)}
                disabled={isAudioPlaying}
                className="min-w-[140px] md:min-w-[160px]"
              >
                <Play className="w-5 h-5 mr-2" />
                {isAudioPlaying ? 'Starting...' : 'Start Workout'}
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
                  onClick={confirmReset}
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="mt-8">
          <WorkoutBottomAd />
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Timer?</h3>
              <p className="text-gray-600 mb-6">
                This will reset your current workout progress. Are you sure you want to continue?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={resetTimer}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 