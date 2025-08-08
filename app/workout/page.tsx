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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

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
                playRestCue()
                return settings.restDuration
              } else {
                // All rounds completed - workout complete
                setIsRunning(false)
                setPhase('break')
                playWorkoutCompleteCue()
                return 0
              }
            } else if (phase === 'rest') {
              // Rest phase finished - start next work period
              const nextRound = currentRound + 1
              if (nextRound <= settings.rounds) {
                // Start next round
                setCurrentRound(nextRound)
                setPhase('work')
                playRoundCue(nextRound)
                return settings.workDuration
              } else {
                // This shouldn't happen, but just in case
                setIsRunning(false)
                setPhase('break')
                return 0
              }
            }
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, isAudioPlaying, time, phase, currentRound, settings, playRestCue, playRoundCue, playWorkoutCompleteCue])

  // Play motivational cues at random intervals
  useEffect(() => {
    if (isRunning && !isPaused && !isAudioPlaying && phase === 'work' && time > 0) {
      // Play motivational cue every 30-60 seconds randomly
      const shouldPlayMotivational = Math.random() < 0.02 // 2% chance per second
      if (shouldPlayMotivational) {
        playMotivationalCue()
      }
    }
  }, [isRunning, isPaused, isAudioPlaying, phase, time, playMotivationalCue])

  const startTimer = useCallback(async () => {
    setIsRunning(true)
    setIsPaused(false)
    setTime(settings.workDuration)
    setCurrentRound(1)
    setPhase('work')
    await playStartCue()
  }, [settings.workDuration, playStartCue])

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
    <div className="min-h-screen bg-gradient-to-br from-sport-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative Background Images */}
      <div className="absolute top-32 right-8 w-20 h-20 opacity-15">
        <OptimizedImage
          src="/images/workout1.jpg"
          alt="Workout"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      
      <div className="absolute bottom-32 left-8 w-16 h-16 opacity-10">
        <OptimizedImage
          src="/images/workout2.jpg"
          alt="Workout"
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-sport-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold gradient-text">Workout Timer</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <Settings className="w-5 h-5" />
            </Button>
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
          {/* Decorative Image */}
          <div className="absolute top-4 right-4 w-12 h-12 opacity-15">
            <OptimizedImage
              src="/images/workout1.jpg"
              alt="Workout"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          
          <h3 className="text-2xl font-bold text-sport-800 mb-6">Choose Your Workout</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORKOUT_TYPES.map((workout) => (
              <button
                key={workout.id}
                onClick={() => selectWorkoutType(workout)}
                className={cn(
                  'p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden',
                  settings.workoutType === workout.id
                    ? 'border-sport-500 bg-gradient-to-br from-sport-100 to-sport-200 text-sport-800 shadow-lg'
                    : 'border-sport-200 hover:border-sport-300 bg-white/80 backdrop-blur-sm hover:bg-white'
                )}
              >
                {/* Small decorative image */}
                <div className="absolute top-2 right-2 w-8 h-8 opacity-20">
                  <OptimizedImage
                    src="/images/workout2.jpg"
                    alt="Workout"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                
                <div className="font-bold text-xl mb-2">{workout.name}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Work: {workout.work}s</div>
                  <div>Rest: {workout.rest}s</div>
                  <div>Rounds: {workout.rounds}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {showAdvancedSettings && (
          <div className="card-sport mb-8">
            <h3 className="text-2xl font-bold text-sport-800 mb-6">Custom Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sport-700 mb-2">
                  Work Duration (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={settings.workDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-sport-200 rounded-xl focus:ring-2 focus:ring-sport-500 focus:border-sport-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sport-700 mb-2">
                  Rest Duration (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.restDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, restDuration: parseInt(e.target.value) || 10 }))}
                  className="w-full px-3 py-2 border border-sport-200 rounded-xl focus:ring-2 focus:ring-sport-500 focus:border-sport-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sport-700 mb-2">
                  Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.rounds}
                  onChange={(e) => setSettings(prev => ({ ...prev, rounds: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-sport-200 rounded-xl focus:ring-2 focus:ring-sport-500 focus:border-sport-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="card-sport relative overflow-hidden">
          {/* Decorative Image */}
          <div className="absolute top-4 right-4 w-12 h-12 opacity-15">
            <OptimizedImage
              src="/images/workout1.jpg"
              alt="Workout"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          
          <TimerDisplay
            time={time}
            isRunning={isRunning}
            isPaused={isPaused}
            currentRound={currentRound}
            totalRounds={settings.rounds}
            phase={phase}
            isAudioPlaying={isAudioPlaying}
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