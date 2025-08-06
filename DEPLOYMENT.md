# Deployment Guide

This guide will walk you through deploying your Workout & Meditation Timer to Vercel and setting up Supabase.

## 🚀 Quick Start

### 1. GitHub Repository Setup

1. **Create a new repository on GitHub**
   ```bash
   # If you haven't already, create a repo on GitHub and push your code
   git remote add origin https://github.com/yourusername/workout-meditation-timer.git
   git branch -M main
   git push -u origin main
   ```

### 2. Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/Login and create a new project
   - Choose a name (e.g., "workout-meditation-timer")
   - Set a database password
   - Choose a region close to your users

2. **Get your Supabase credentials**
   - Go to Settings → API
   - Copy your Project URL and anon/public key

3. **Set up database tables** (optional for now)
   ```sql
   -- Create feedback table
   CREATE TABLE feedback (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT,
     email TEXT,
     feedback TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create timer_sessions table (for future analytics)
   CREATE TABLE timer_sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID,
     type TEXT NOT NULL CHECK (type IN ('workout', 'meditation')),
     duration INTEGER NOT NULL,
     settings JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### 3. Vercel Deployment

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables**
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Deploy**
   - Vercel will automatically deploy your project
   - Your app will be available at `https://your-project-name.vercel.app`

## 🔧 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/workout-meditation-timer.git
   cd workout-meditation-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 PWA Setup (Optional)

To enable PWA features:

1. **Create a manifest file**
   ```bash
   # Create public/manifest.json
   ```

2. **Add service worker**
   ```bash
   # Create public/sw.js
   ```

3. **Update next.config.js**
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
   })
   ```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use Vercel's environment variable system for production
   - Keep your Supabase service role key secret

2. **CORS Configuration**
   - Configure CORS in Supabase if needed
   - Set up proper domain restrictions

3. **Rate Limiting**
   - Consider implementing rate limiting for the contact form
   - Use Supabase's built-in rate limiting features

## 📊 Analytics Setup (Future)

1. **Google Analytics**
   - Add your GA tracking ID to environment variables
   - Implement tracking in your app

2. **Google Ads**
   - Set up Google Ads for monetization
   - Add ad placement components

## 🚀 Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize audio files for web

2. **Caching**
   - Implement proper caching strategies
   - Use Vercel's edge caching

3. **Bundle Optimization**
   - Monitor bundle size with `npm run build`
   - Use dynamic imports for large components

## 🔄 Continuous Deployment

Your app will automatically deploy when you push to the main branch:

1. **Make changes locally**
2. **Commit and push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. **Vercel automatically deploys**

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies are installed

2. **Environment variables not working**
   - Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new environment variables

3. **Supabase connection issues**
   - Verify your Supabase URL and key
   - Check if your Supabase project is active

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit [Vercel's help center](https://vercel.com/help)
- Review [Supabase documentation](https://supabase.com/docs)

## 📈 Next Steps

1. **Add audio functionality**
   - Implement audio cues and chimes
   - Add voice prompts

2. **Enhance meditation timer**
   - Add guided meditation features
   - Implement ambient sounds

3. **Add analytics**
   - Track user sessions
   - Monitor feature usage

4. **Monetization**
   - Integrate Google Ads
   - Consider premium features 