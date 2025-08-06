'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, RotateCcw, Settings } from 'lucide-react'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { Button } from '@/components/ui/Button'

interface WorkoutSettings {
  workDuration: number
  restDuration: number
  rounds: number
  workoutType: string
}

const WORKOUT_TYPES = [
  { id: 'hiit', name: 'HIIT', work: 30, rest: 10, rounds: 8 },
  { id: 'yoga', name: 'Yoga', work: 60, rest: 15, rounds: 5 },
  { id: 'stretching', name: 'Stretching', work: 45, rest: 20, rounds: 6 },
]

export default function WorkoutTimerPage() {
  const [settings, setSettings] = useState<WorkoutSettings>({
    workDuration: 30,
    restDuration: 10,
    rounds: 5,
    workoutType: 'custom'
  })
  
  const [time, setTime] = useState(settings.workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [phase, setPhase] = useState<'work' | 'rest' | 'break'>('work')
  const [showSettings, setShowSettings] = useState(false)

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished for current phase
            if (phase === 'work') {
              if (currentRound < settings.rounds) {
                // Start rest period
                setPhase('rest')
                return settings.restDuration
              } else {
                // Workout complete
                setIsRunning(false)
                setPhase('break')
                return 0
              }
            } else if (phase === 'rest') {
              // Start next work period
              setCurrentRound(prev => prev + 1)
              setPhase('work')
              return settings.workDuration
            }
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, time, phase, currentRound, settings])

  const startTimer = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
    setTime(settings.workDuration)
    setCurrentRound(1)
    setPhase('work')
  }, [settings.workDuration])

  const pauseTimer = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeTimer = useCallback(() => {
    setIsPaused(false)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setTime(settings.workDuration)
    setCurrentRound(1)
    setPhase('work')
  }, [settings.workDuration])

  const selectWorkoutType = (workoutType: typeof WORKOUT_TYPES[0]) => {
    setSettings({
      workDuration: workoutType.work,
      restDuration: workoutType.rest,
      rounds: workoutType.rounds,
      workoutType: workoutType.id
    })
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
            <h1 className="text-xl font-semibold text-gray-900">Workout Timer</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Settings</h3>
            
            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Presets
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {WORKOUT_TYPES.map((workout) => (
                  <button
                    key={workout.id}
                    onClick={() => selectWorkoutType(workout)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-colors',
                      settings.workoutType === workout.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="font-medium">{workout.name}</div>
                    <div className="text-sm text-gray-600">
                      {workout.work}s work, {workout.rest}s rest, {workout.rounds} rounds
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Duration (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={settings.workDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rest Duration (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.restDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, restDuration: parseInt(e.target.value) || 10 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.rounds}
                  onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="card">
          <TimerDisplay
            time={time}
            isRunning={isRunning}
            isPaused={isPaused}
            currentRound={currentRound}
            totalRounds={settings.rounds}
            phase={phase}
          />

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRunning ? (
              <Button size="lg" onClick={startTimer}>
                <Play className="w-5 h-5 mr-2" />
                Start Workout
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