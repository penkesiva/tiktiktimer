// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Your Google AdSense publisher ID - use environment variable with fallback
  PUBLISHER_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'ca-pub-4519820641253525',
  
  // Ad slot IDs - only homepage banner for policy compliance
  AD_SLOTS: {
    BANNER: '1197852705', // TikTikTimer Homepage Banner - Real Ad Unit ID
    // Timer page ads removed - functional tools shouldn't have ads per Google policy
  },
  
  // Ad placement strategy - policy compliant
  PLACEMENT: {
    HOMEPAGE: {
      BANNER: 'bottom', // Single banner above footer
    },
    // No ads on timer pages - they are functional tools
  },
  
  // Ad loading conditions
  LOAD_CONDITIONS: {
    // Only show ads on content-rich pages
    MIN_CONTENT_LENGTH: 500, // Minimum content before showing ads
    MAX_ADS_PER_PAGE: 1, // Maximum 1 ad per page for policy compliance
  },
  
  // AdSense program policies compliance
  POLICY_COMPLIANCE: {
    NO_ADS_ON_FUNCTIONAL_PAGES: true, // Timer pages are functional tools
    RESPECT_AD_TO_CONTENT_RATIO: true, // Maintain proper content-to-ad ratio
    NO_NAVIGATION_INTERFERENCE: true, // Ads don't block essential functionality
  }
}

// Debug function to check environment variables
export function debugAdSenseConfig() {
  console.log('AdSense Debug Info:', {
    envVar: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
    publisherId: ADSENSE_CONFIG.PUBLISHER_ID,
    nodeEnv: process.env.NODE_ENV
  })
}

// Helper function to check if ads should be shown
export function shouldShowAds(): boolean {
  // You can add logic here to control when ads are shown
  // For example, hide ads for premium users, during development, etc.
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false
  }
  
  // In development, allow ads for testing (but show mock ads by default)
  if (process.env.NODE_ENV === 'development') {
    // You can force real ads in development by setting this to true
    return false // Set to true if you want to test real ads in development
  }
  
  // More sophisticated ad blocker detection for production
  const isAdBlocked = () => {
    // Check if adsbygoogle is undefined (common ad blocker behavior)
    if (window.adsbygoogle === undefined) {
      return true
    }
    
    // Check if the AdSense script failed to load
    const adsenseScript = document.querySelector('script[src*="adsbygoogle.js"]')
    if (!adsenseScript) {
      return true
    }
    
    return false
  }
  
  // Hide ads if ad blocker is detected
  if (isAdBlocked()) {
    console.log('AdSense: Ad blocker detected, hiding ads')
    return false
  }
  
  return true
}

// Helper function to get ad slot ID
export function getAdSlot(slotName: keyof typeof ADSENSE_CONFIG.AD_SLOTS): string {
  return ADSENSE_CONFIG.AD_SLOTS[slotName]
}

// Helper function to check if AdSense is properly loaded
export function isAdSenseLoaded(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  return !!(window.adsbygoogle && Array.isArray(window.adsbygoogle))
}

// Helper function to get AdSense loading status
export function getAdSenseStatus(): {
  isLoaded: boolean
  hasError: boolean
  publisherId: string
} {
  return {
    isLoaded: isAdSenseLoaded(),
    hasError: !isAdSenseLoaded() && typeof window !== 'undefined',
    publisherId: ADSENSE_CONFIG.PUBLISHER_ID
  }
}

// Development helper to force real ads
export function forceRealAdsInDevelopment(): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  return shouldShowAds()
}


