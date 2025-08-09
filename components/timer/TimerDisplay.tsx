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
        <div className="flex items-center justify-center mt-4 relative">
          {/* Timer Status Dots - Always in center */}
          <div className="flex items-center space-x-1">
            {isRunning ? (
              <>
                <div className={cn(
                  'w-2 h-2 rounded-full animate-pulse',
                  {
                    'bg-sport-500': !isPaused,
                    'bg-yellow-500': isPaused
                  }
                )} />
                <div className={cn(
                  'w-2 h-2 rounded-full animate-pulse',
                  {
                    'bg-sport-500': !isPaused,
                    'bg-yellow-500': isPaused
                  }
                )} />
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              </>
            )}
          </div>
          
          {/* Audio Playing Indicator - Positioned to the right */}
          {isAudioPlaying && (
            <div className="absolute right-0 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-sport-500 animate-pulse" />
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