import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (we'll define these later)
export interface TimerSession {
  id: string
  user_id?: string
  type: 'workout' | 'meditation'
  duration: number
  settings: any
  created_at: string
}

export interface UserFeedback {
  id: string
  name?: string
  email?: string
  feedback: string
  created_at: string
} 