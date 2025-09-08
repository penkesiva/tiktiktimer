'use client'

import { useEffect, useState, useRef } from 'react'
import { ADSENSE_CONFIG, shouldShowAds, forceRealAdsInDevelopment } from '@/lib/adsense'

interface GoogleAdsenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'banner' | 'leaderboard' | 'skyscraper'
  className?: string
  style?: React.CSSProperties
  forceInDevelopment?: boolean
}

export function GoogleAdsense({ adSlot, adFormat = 'auto', className = '', style = {}, forceInDevelopment = false }: GoogleAdsenseProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isScriptLoading, setIsScriptLoading] = useState(false)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Use development override if requested
    const shouldShow = forceInDevelopment ? forceRealAdsInDevelopment() : shouldShowAds()
    
    if (!shouldShow) {
      return
    }

    // Check if script is already loaded
    if (typeof window !== 'undefined' && window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      setIsLoaded(true)
      return
    }

    // Prevent multiple script loads
    if (isScriptLoading || scriptLoadedRef.current) {
      return
    }

    // Load Google AdSense script
    const loadAdSenseScript = () => {
      setIsScriptLoading(true)
      scriptLoadedRef.current = true

      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.PUBLISHER_ID}`
      script.async = true
      script.crossOrigin = 'anonymous'
      
      script.onload = () => {
        console.log('AdSense script loaded successfully')
        setIsLoaded(true)
        setIsScriptLoading(false)
      }
      
      script.onerror = (error) => {
        console.error('AdSense script failed to load:', error)
        setHasError(true)
        setIsScriptLoading(false)
        scriptLoadedRef.current = false
      }
      
      document.head.appendChild(script)
    }

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(loadAdSenseScript, 100)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [forceInDevelopment])

  useEffect(() => {
    if (isLoaded && !hasError && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        // Push the ad configuration to AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        console.log('AdSense ad pushed successfully')
      } catch (error) {
        console.error('Error loading Google AdSense ad:', error)
        setHasError(true)
      }
    }
  }, [isLoaded, hasError, adSlot])

  const shouldShow = forceInDevelopment ? forceRealAdsInDevelopment() : shouldShowAds()
  
  if (!shouldShow || hasError) {
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
export function BannerAd({ className = '', forceInDevelopment = false }: { className?: string; forceInDevelopment?: boolean }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] md:h-[120px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
        forceInDevelopment={forceInDevelopment}
      />
    </div>
  )
}

// Sidebar Ad Component - Updated to use BANNER slot
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="rectangle"
        className="w-full h-[600px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// In-Content Ad Component - Updated to use BANNER slot
export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="rectangle"
        className="w-full h-[250px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Footer Ad Component - Updated to use BANNER slot
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Workout Timer Top Ad - Updated to use BANNER slot
export function WorkoutTopAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-sport-100 to-sport-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Workout Timer Bottom Ad - Updated to use BANNER slot
export function WorkoutBottomAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-sport-100 to-sport-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Meditation Timer Top Ad - Updated to use BANNER slot
export function MeditationTopAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-calm-100 to-calm-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}

// Meditation Timer Bottom Ad - Updated to use BANNER slot
export function MeditationBottomAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <GoogleAdsense
        adSlot={ADSENSE_CONFIG.AD_SLOTS.BANNER}
        adFormat="banner"
        className="w-full h-[90px] bg-gradient-to-r from-calm-100 to-calm-200 rounded-xl flex items-center justify-center shadow-lg"
      />
    </div>
  )
}
