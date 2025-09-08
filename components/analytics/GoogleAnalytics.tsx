'use client'

import { useEffect } from 'react'
import { GA_TRACKING_ID } from '@/lib/analytics'

export function GoogleAnalytics() {
  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    document.head.appendChild(script1)

    // Initialize gtag
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
    `
    document.head.appendChild(script2)

    // Make gtag available globally
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments)
    }

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  return null
}
