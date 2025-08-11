// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Your Google AdSense publisher ID
  PUBLISHER_ID: 'ca-pub-4519820641253525',
  
  // Ad slot IDs - replace with your actual ad slot IDs
  AD_SLOTS: {
    BANNER: '7848437873', // Homepage bottom banner
    SIDEBAR: 'YOUR_SIDEBAR_AD_SLOT',
    INCONTENT: 'YOUR_INCONTENT_AD_SLOT',
    FOOTER: 'YOUR_FOOTER_AD_SLOT',
    WORKOUT_TOP: 'YOUR_WORKOUT_TOP_AD_SLOT',
    WORKOUT_BOTTOM: 'YOUR_WORKOUT_BOTTOM_AD_SLOT',
    MEDITATION_TOP: 'YOUR_MEDITATION_TOP_AD_SLOT',
    MEDITATION_BOTTOM: 'YOUR_MEDITATION_BOTTOM_AD_SLOT',
  },
  
  // Ad formats
  AD_FORMATS: {
    BANNER: 'banner',
    RECTANGLE: 'rectangle',
    LEADERBOARD: 'leaderboard',
    SKYSCRAPER: 'skyscraper',
    AUTO: 'auto',
  },
  
  // Ad dimensions
  AD_DIMENSIONS: {
    BANNER: { width: 728, height: 90 },
    RECTANGLE: { width: 300, height: 250 },
    LEADERBOARD: { width: 728, height: 90 },
    SKYSCRAPER: { width: 160, height: 600 },
  },
  
  // Ad placement settings
  PLACEMENTS: {
    // Home page ads
    HOME_TOP: {
      enabled: true,
      slot: 'BANNER',
      className: 'mb-8',
    },
    HOME_BOTTOM: {
      enabled: true,
      slot: 'BANNER',
      className: 'mt-8',
    },
    
    // Workout timer ads
    WORKOUT_TOP: {
      enabled: true,
      slot: 'WORKOUT_TOP',
      className: 'mb-6',
    },
    WORKOUT_BOTTOM: {
      enabled: true,
      slot: 'WORKOUT_BOTTOM',
      className: 'mt-6',
    },
    
    // Meditation timer ads
    MEDITATION_TOP: {
      enabled: true,
      slot: 'MEDITATION_TOP',
      className: 'mb-6',
    },
    MEDITATION_BOTTOM: {
      enabled: true,
      slot: 'MEDITATION_BOTTOM',
      className: 'mt-6',
    },
    
    // Sidebar ads (for larger screens)
    SIDEBAR: {
      enabled: true,
      slot: 'SIDEBAR',
      className: 'hidden lg:block',
    },
  },
}

// Helper function to check if ads should be shown
export function shouldShowAds(): boolean {
  // You can add logic here to control when ads are shown
  // For example, hide ads for premium users, during development, etc.
  
  // Hide ads during development
  if (process.env.NODE_ENV === 'development') {
    return false
  }
  
  // Hide ads if user has ad blocker (you can detect this)
  if (typeof window !== 'undefined' && window.adsbygoogle === undefined) {
    return false
  }
  
  return true
}

// Helper function to get ad slot ID
export function getAdSlot(slotName: keyof typeof ADSENSE_CONFIG.AD_SLOTS): string {
  return ADSENSE_CONFIG.AD_SLOTS[slotName]
}

// Helper function to get ad format
export function getAdFormat(formatName: keyof typeof ADSENSE_CONFIG.AD_FORMATS): string {
  return ADSENSE_CONFIG.AD_FORMATS[formatName]
}
