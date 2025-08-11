'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { BannerAd } from '@/components/ads/GoogleAdsense'
import { OptimizedImage } from '@/components/ui/Image'
import Head from 'next/head'

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)

  // Set client flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <Head>
        {/* Enhanced SEO Meta Tags */}
        <title>TikTikTimer - Free Workout & Meditation Timer App | Interval Training & Guided Sessions</title>
        <meta name="description" content="Free professional timer app for workouts and meditation. Features interval training, HIIT, Tabata, guided meditation, ambient sounds, and audio cues. Perfect for fitness and mindfulness." />
        <meta name="keywords" content="free timer app, workout timer, meditation timer, interval training, HIIT timer, Tabata timer, fitness app, meditation app, guided meditation, ambient sounds, audio cues, exercise timer, mindfulness app" />
        
        {/* Open Graph Enhanced */}
        <meta property="og:title" content="TikTikTimer - Free Professional Timer App for Workouts & Meditation" />
        <meta property="og:description" content="Free interval training timer with guided meditation. Features Tabata, HIIT, strength training, and mindfulness sessions with professional audio guidance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tiktiktimer.com" />
        <meta property="og:image" content="https://tiktiktimer.com/images/tiktiktimer.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:site_name" content="TikTikTimer" />
        
        {/* Twitter Enhanced */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TikTikTimer - Free Workout & Meditation Timer" />
        <meta name="twitter:description" content="Professional interval training and guided meditation timer app. Free to use with Tabata, HIIT, and mindfulness features." />
        <meta name="twitter:image" content="https://tiktiktimer.com/images/tiktiktimer.png" />
        
        {/* Additional SEO */}
        <meta name="author" content="TikTikTimer" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TikTikTimer",
              "description": "Free professional timer app for workouts and meditation with interval training and guided sessions",
              "url": "https://tiktiktimer.com",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Interval Training Timer",
                "Workout Presets (Tabata, HIIT, Strength, Cardio)",
                "Guided Meditation Timer",
                "Ambient Sounds & Music",
                "Audio Cues & Chimes",
                "Mobile Responsive Design",
                "PWA Installation"
              ],
              "screenshot": "https://tiktiktimer.com/images/workout1.png",
              "softwareVersion": "1.0.0"
            })
          }}
        />
      </Head>
      
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Falling Animation Background */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Falling particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="falling-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
          
          {/* Falling snowflakes */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`snowflake-${i}`}
              className="falling-snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Strategic Background Images - Responsive and Mobile-Friendly */}
      <div className="absolute top-20 right-4 w-32 h-32 md:w-48 lg:w-64 md:h-48 lg:h-64 hidden sm:block">
        <OptimizedImage
          src="/images/tiktiktimer.png"
          alt="TikTikTimer - Professional Timer App Logo"
          width={256}
          height={256}
          className="rounded-full opacity-80"
        />
      </div>
      
      <div className="absolute bottom-4 left-4 w-28 h-28 md:w-40 lg:w-56 md:h-40 lg:h-56 hidden sm:block">
        <OptimizedImage
          src="/images/workout3.png"
          alt="Workout Timer - Fitness Training"
          width={224}
          height={224}
          className="rounded-full opacity-80"
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <OptimizedImage
                src="/images/logo.png"
                alt="TikTikTimer Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">TikTikTimer</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/feedback" className="text-gray-600 hover:text-sport-600 transition-colors font-medium">
                Feedback
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <BannerAd className="mb-4" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in relative">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              Focus on Your Practice
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              Clean, distraction-free timers for workouts and meditation with professional audio guidance.
            </p>
          </div>

          {/* Timer Options */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto animate-slide-up">
            {/* Workout Timer */}
            <Link href="/workout" className="group">
              <div className="card-sport hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 relative overflow-hidden">
                <div className="flex items-center justify-center w-24 h-24 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl overflow-hidden">
                  <OptimizedImage
                    src="/images/workout5.png"
                    alt="Workout Timer - Interval Training"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-3xl font-bold text-sport-800 mb-3">
                  Workout Timer
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Interval training with customizable work/rest periods and motivational audio cues.
                </p>
                <div className="flex items-center text-sport-600 font-semibold text-lg">
                  Start Workout
                  <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Meditation Timer */}
            <Link href="/meditation" className="group">
              <div className="card-calm hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 relative overflow-hidden">
                <div className="flex items-center justify-center w-24 h-24 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl overflow-hidden">
                  <OptimizedImage
                    src="/images/meditation4.png"
                    alt="Meditation Timer - Mindfulness Practice"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-3xl font-bold text-calm-800 mb-3">
                  Meditation Timer
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Guided and silent meditation sessions with ambient sounds and gentle prompts.
                </p>
                <div className="flex items-center text-calm-600 font-semibold text-lg">
                  Start Meditation
                  <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/20">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            © 2025 TikTikTimer. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Professional workout and meditation timer for everyone.
          </p>
        </div>
      </footer>
    </main>
    </>
  )
} 