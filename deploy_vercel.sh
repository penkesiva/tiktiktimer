#!/bin/bash

echo "🚀 Preparing TikTok Timer for Vercel Deployment"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git remote add origin https://github.com/yourusername/tiktiktimer.git"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Running TypeScript type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before deploying."
    exit 1
fi

# Build the application
echo "🏗️  Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. You'll need to set environment variables in Vercel."
    echo "   Create .env.local with your Supabase credentials:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key"
fi

# Check git status
echo "📊 Checking git status..."
git status --porcelain

if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Consider committing them before deploying."
    echo "   Run: git add . && git commit -m 'Your changes'"
fi

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin set. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/tiktiktimer.git"
fi

echo ""
echo "🎯 Vercel Deployment Ready!"
echo "=========================="
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Vercel deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to vercel.com"
echo "   - Sign up/Login with GitHub"
echo "   - Import your tiktiktimer repository"
echo "   - Add environment variables for Supabase"
echo "   - Deploy!"
echo ""
echo "3. Add custom domain:"
echo "   - In Vercel dashboard, go to Settings → Domains"
echo "   - Add tiktiktimer.com"
echo "   - Update DNS records as instructed"
echo ""
echo "📚 See VERCEL_DEPLOYMENT.md for detailed instructions"
echo "🎉 Vercel will give you the best performance for your Next.js app!"
