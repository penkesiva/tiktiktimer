import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'TikTikTimer - Professional Timer App for Workouts & Meditation',
    template: '%s | TikTikTimer'
  },
  description: 'Clean, distraction-free timers for workouts and meditation with professional audio guidance. Interval training, guided meditation, and ambient sounds.',
  keywords: ['timer app', 'workout timer', 'meditation timer', 'interval training', 'fitness timer', 'mindfulness app', 'exercise timer', 'HIIT timer', 'meditation app'],
  authors: [{ name: 'TikTikTimer Team' }],
  creator: 'TikTikTimer',
  publisher: 'TikTikTimer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tiktiktimer.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TikTikTimer - Professional Timer App for Workouts & Meditation',
    description: 'Clean, distraction-free timers for workouts and meditation with professional audio guidance.',
    url: 'https://tiktiktimer.com',
    siteName: 'TikTikTimer',
    images: [
      {
        url: '/images/logo.png',
        width: 256,
        height: 256,
        alt: 'TikTikTimer Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TikTikTimer - Professional Timer App for Workouts & Meditation',
    description: 'Clean, distraction-free timers for workouts and meditation with professional audio guidance.',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="TikTikTimer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TikTikTimer" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 