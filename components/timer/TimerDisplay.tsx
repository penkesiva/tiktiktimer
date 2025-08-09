import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'

interface TimerDisplayProps {
  time: number
  isRunning: boolean
  isPaused: boolean
  currentRound?: number
  totalRounds?: number
  phase?: 'work' | 'rest' | 'break'
  isAudioPlaying?: boolean
  className?: string
}

export function TimerDisplay({
  time,
  isRunning,
  isPaused,
  currentRound,
  totalRounds,
  phase,
  isAudioPlaying,
  className
}: TimerDisplayProps) {
  return (
    <div className={cn('text-center relative', className)}>
      {/* Phase Label - Top Right */}
      {phase && isRunning && (
        <div className="absolute top-4 right-4">
          <span className={cn(
            'text-base font-semibold px-5 py-3 rounded-lg shadow-lg',
            {
              'bg-gradient-to-r from-sport-100 to-sport-200 text-sport-700 border border-sport-300': phase === 'work',
              'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-300': phase === 'rest',
              'bg-gradient-to-r from-energy-100 to-energy-200 text-energy-700 border border-energy-300': phase === 'break'
            }
          )}>
            {phase === 'work' ? 'GO!' : phase.charAt(0).toUpperCase() + phase.slice(1)}
          </span>
        </div>
      )}

      {/* Timer Display */}
      <div className="mb-8">
        <div className={cn(
          'timer-display transition-all duration-300',
          {
            'text-sport-600': isRunning && !isPaused && phase === 'work',
            'text-orange-600': isRunning && !isPaused && phase === 'rest',
            'text-gray-400': isPaused,
            'text-gray-900': !isRunning && !isPaused
          }
        )}>
          {formatTime(time)}
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          {isRunning && (
            <div className={cn(
              'w-3 h-3 rounded-full animate-pulse',
              {
                'bg-sport-500': !isPaused,
                'bg-yellow-500': isPaused
              }
            )} />
          )}
          
          {isAudioPlaying && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-sport-500 animate-pulse" />
              <span className="text-sm font-medium text-sport-700">
                Audio playing...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Round Counter */}
      {currentRound && totalRounds && (
        <div className="mb-6">
          <div className="text-lg font-medium text-gray-700">
            Round {currentRound}/{totalRounds}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2 shadow-inner">
            <div 
              className="bg-gradient-to-r from-sport-500 to-sport-600 h-3 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${Math.min(100, (currentRound / totalRounds) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
} 