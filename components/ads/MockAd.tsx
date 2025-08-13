'use client'

interface MockAdProps {
  className?: string
  variant?: 'banner' | 'rectangle' | 'sidebar'
  showLabel?: boolean
}

export function MockAd({ className = '', variant = 'banner', showLabel = true }: MockAdProps) {
  const getAdStyles = () => {
    switch (variant) {
      case 'banner':
        return 'w-full h-[90px] md:h-[120px] bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-dashed border-blue-300'
      case 'rectangle':
        return 'w-full h-[250px] bg-gradient-to-r from-green-100 to-green-200 border-2 border-dashed border-green-300'
      case 'sidebar':
        return 'w-full h-[600px] bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-dashed border-purple-300'
      default:
        return 'w-full h-[90px] md:h-[120px] bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-dashed border-blue-300'
    }
  }

  const getAdLabel = () => {
    switch (variant) {
      case 'banner':
        return 'Banner Ad (728x90)'
      case 'rectangle':
        return 'Rectangle Ad (300x250)'
      case 'sidebar':
        return 'Sidebar Ad (160x600)'
      default:
        return 'Banner Ad (728x90)'
    }
  }

  return (
    <div className={`${getAdStyles()} rounded-xl flex items-center justify-center shadow-lg ${className}`}>
      {showLabel && (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-1">
            {getAdLabel()}
          </div>
          <div className="text-xs text-gray-500">
            Mock Ad - Development Preview
          </div>
        </div>
      )}
    </div>
  )
}
