import Link from 'next/link'
import { Dumbbell, Heart, Play } from 'lucide-react'
import { BannerAd } from '@/components/ads/GoogleAdsense'
import { OptimizedImage } from '@/components/ui/Image'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative Background Images */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-20">
        <OptimizedImage
          src="/images/tiktiktimer.png"
          alt="TikTikTimer Logo"
          width={128}
          height={128}
          className="rounded-full"
        />
      </div>
      
      <div className="absolute bottom-20 left-10 w-24 h-24 opacity-15">
        <OptimizedImage
          src="/images/workout1.jpg"
          alt="Workout"
          width={96}
          height={96}
          className="rounded-full"
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sport-500 to-energy-500 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Timer</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/contact" className="text-gray-600 hover:text-sport-600 transition-colors font-medium">
                Contact
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
            {/* Decorative Image */}
            <div className="absolute -top-8 -left-8 w-16 h-16 opacity-20">
              <OptimizedImage
                src="/images/yoga.jpg"
                alt="Yoga"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-6 leading-tight">
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
                {/* Background Image */}
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                  <OptimizedImage
                    src="/images/workout2.jpg"
                    alt="Workout"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sport-400 to-sport-500 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl">
                  <Dumbbell className="w-10 h-10 text-white" />
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
                {/* Background Image */}
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                  <OptimizedImage
                    src="/images/yoga.jpg"
                    alt="Yoga"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-calm-400 to-calm-500 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl">
                  <Heart className="w-10 h-10 text-white" />
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

      {/* Bottom Banner Ad */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <BannerAd className="mt-4" />
      </div>
    </main>
  )
} 