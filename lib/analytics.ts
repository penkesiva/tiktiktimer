// Google Analytics utility for tracking user interactions

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-F2KBZ647DF'

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Timer-specific tracking functions
export const trackTimerStart = (timerType: 'workout' | 'meditation', duration: number) => {
  event({
    action: 'timer_start',
    category: 'Timer',
    label: `${timerType}_${duration}min`,
    value: duration,
  })
}

export const trackTimerComplete = (timerType: 'workout' | 'meditation', duration: number) => {
  event({
    action: 'timer_complete',
    category: 'Timer',
    label: `${timerType}_${duration}min`,
    value: duration,
  })
}

export const trackTimerPause = (timerType: 'workout' | 'meditation') => {
  event({
    action: 'timer_pause',
    category: 'Timer',
    label: timerType,
  })
}

export const trackPresetSelect = (presetName: string, timerType: 'workout' | 'meditation') => {
  event({
    action: 'preset_select',
    category: 'Preset',
    label: `${timerType}_${presetName}`,
  })
}

export const trackAudioToggle = (audioType: 'music' | 'voice', isMuted: boolean) => {
  event({
    action: 'audio_toggle',
    category: 'Audio',
    label: `${audioType}_${isMuted ? 'muted' : 'unmuted'}`,
  })
}

export const trackAdInteraction = (adType: 'banner' | 'mock', action: 'show' | 'hide') => {
  event({
    action: 'ad_interaction',
    category: 'AdSense',
    label: `${adType}_${action}`,
  })
}
