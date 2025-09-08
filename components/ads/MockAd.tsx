'use client'

import { useEffect, useState } from 'react'
import { getAdSenseStatus, debugAdSenseConfig } from '@/lib/adsense'

interface MockAdProps {
  className?: string
  variant?: 'banner' | 'rectangle' | 'sidebar'
  showLabel?: boolean
  showDebugInfo?: boolean
}

export function MockAd({ className = '', variant = 'banner', showLabel = true, showDebugInfo = false }: MockAdProps) {
  const [adSenseStatus, setAdSenseStatus] = useState<{ isLoaded: boolean; hasError: boolean; publisherId: string } | null>(null)

  useEffect(() => {
    if (showDebugInfo) {
      // Call debug function to log environment info
      debugAdSenseConfig()
      setAdSenseStatus(getAdSenseStatus())
    }
  }, [showDebugInfo])

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
          {showDebugInfo && adSenseStatus && (
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <div>Publisher: {adSenseStatus.publisherId}</div>
              <div>AdSense Loaded: {adSenseStatus.isLoaded ? '✅' : '❌'}</div>
              <div>Has Error: {adSenseStatus.hasError ? '❌' : '✅'}</div>
              <div className="text-xs text-gray-300 mt-1">
                Check console for debug info
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
