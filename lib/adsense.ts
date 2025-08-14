// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Your Google AdSense publisher ID
  PUBLISHER_ID: 'ca-pub-4519820641253525',
  
  // Ad slot IDs - only homepage banner for policy compliance
  AD_SLOTS: {
    BANNER: '7848437873', // Homepage bottom banner only
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


