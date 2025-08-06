import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'

interface TimerDisplayProps {
  time: number
  isRunning: boolean
  isPaused: boolean
  currentRound?: number
  totalRounds?: number
  phase?: 'work' | 'rest' | 'break'
  className?: string
}

export function TimerDisplay({
  time,
  isRunning,
  isPaused,
  currentRound,
  totalRounds,
  phase,
  className
}: TimerDisplayProps) {
  return (
    <div className={cn('text-center', className)}>
      {/* Timer Display */}
      <div className="mb-8">
        <div className={cn(
          'timer-display transition-all duration-300',
          {
            'text-primary-600': isRunning && !isPaused,
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
                'bg-green-500': !isPaused,
                'bg-yellow-500': isPaused
              }
            )} />
          )}
          
          {phase && (
            <span className={cn(
              'text-sm font-medium px-3 py-1 rounded-full',
              {
                'bg-red-100 text-red-700': phase === 'work',
                'bg-blue-100 text-blue-700': phase === 'rest',
                'bg-green-100 text-green-700': phase === 'break'
              }
            )}>
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Round Counter */}
      {currentRound && totalRounds && (
        <div className="mb-6">
          <div className="text-lg font-medium text-gray-700">
            Round {currentRound} of {totalRounds}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentRound / totalRounds) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
} 