'use client'

import { useEffect, useState } from 'react'
import { ADSENSE_CONFIG, shouldShowAds } from '@/lib/adsense'

interface GoogleAdsenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'banner' | 'leaderboard' | 'skyscraper'
  className?: string
  style?: React.CSSProperties
}

export function GoogleAdsense({ adSlot, adFormat = 'auto', className = '', style = {} }: GoogleAdsenseProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!shouldShowAds()) {
      return
    }

    // Load Google AdSense script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.PUBLISHER_ID}`
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onload = () => setIsLoaded(true)
      script.onerror = () => setHasError(true)
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && !hasError && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('Error loading Google AdSense:', error)
        setHasError(true)
      }
    }
  }, [isLoaded, hasError, adSlot])

  if (!shouldShowAds() || hasError) {
    return null
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Banner Ad Component
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] md:h-[120px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Sidebar Ad Component
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.SIDEBAR}
        adFormat="rectangle"
        className="w-full h-[600px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// In-Content Ad Component
export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.INCONTENT}
        adFormat="rectangle"
        className="w-full h-[250px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Footer Ad Component
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.FOOTER}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Workout Timer Top Ad
export function WorkoutTopAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.WORKOUT_TOP}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-sport-100 to-sport-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Workout Timer Bottom Ad
export function WorkoutBottomAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.WORKOUT_BOTTOM}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-sport-100 to-sport-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Meditation Timer Top Ad
export function MeditationTopAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.MEDITATION_TOP}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-calm-100 to-calm-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Meditation Timer Bottom Ad
export function MeditationBottomAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.MEDITATION_BOTTOM}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-calm-100 to-calm-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}
