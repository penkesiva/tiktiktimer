'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OptimizedImage } from '@/components/ui/Image'

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', feedback: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-sport-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">TikTik</span><span className="text-green-600">Timer</span> - Feedback
            </h1>
            <OptimizedImage
              src="/images/logo.png"
              alt="TikTikTimer Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-sport">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-sport-800 mb-4">Share Your Feedback</h2>
            <div className="bg-gradient-to-r from-sport-100 to-energy-100 rounded-2xl p-6 mb-6 border border-sport-200">
              <p className="text-lg font-semibold text-sport-800 mb-2">
                🏆 We're Building the Best Workout Timer in the World!
              </p>
              <p className="text-sport-700">
                Your feedback is highly appreciated and helps us create an amazing experience for everyone.
              </p>
            </div>

          </div>

          {isSubmitted ? (
            <div className="card-sport text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sport-400 to-sport-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-sport-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-6">
                Your feedback has been submitted. We&apos;ll review it and get back to you if needed.
              </p>
              <Button variant="sport" onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <div className="card-sport">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-sport-700 mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-sport-200 rounded-xl focus:ring-2 focus:ring-sport-500 focus:border-sport-500 bg-white/80 backdrop-blur-sm"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-sport-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-sport-200 rounded-xl focus:ring-2 focus:ring-sport-500 focus:border-sport-500 bg-white/80 backdrop-blur-sm"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-sport-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full px-3 py-2 border border-sport-200 rounded-xl focus:ring-2 focus:ring-sport-500 focus:border-sport-500 bg-white/80 backdrop-blur-sm"
                    placeholder="Tell us what you think, report a bug, or suggest a feature..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="sport"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 