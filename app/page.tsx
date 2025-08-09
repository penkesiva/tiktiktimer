import Link from 'next/link'
import { Play } from 'lucide-react'
import { BannerAd } from '@/components/ads/GoogleAdsense'
import { OptimizedImage } from '@/components/ui/Image'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Falling Animation Background */}
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

      {/* Strategic Background Images - Fewer, Bigger, Better Positioned */}
      <div className="absolute top-20 right-4 w-64 h-64">
        <OptimizedImage
          src="/images/tiktiktimer.png"
          alt="TikTikTimer - Professional Timer App Logo"
          width={256}
          height={256}
          className="rounded-full"
        />
      </div>
      
      <div className="absolute bottom-4 left-4 w-56 h-56">
        <OptimizedImage
          src="/images/workout3.png"
          alt="Workout Timer - Fitness Training"
          width={224}
          height={224}
          className="rounded-full"
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in relative">
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
              Focus on Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Clean, distraction-free timers for workouts and meditation with professional audio guidance.
            </p>
          </div>

          {/* Timer Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-slide-up">
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
  )
} 