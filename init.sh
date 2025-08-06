#!/bin/bash

# Workout & Meditation Timer - Development Server Launcher
# This script initializes the project and launches the development server

echo "🚀 Starting Workout & Meditation Timer Development Server"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check your internet connection and try again."
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
else
    echo "✅ Dependencies already installed."
fi

# Check if .env.local exists, if not create from example
if [ ! -f ".env.local" ]; then
    if [ -f "env.example" ]; then
        echo "📝 Creating .env.local from env.example..."
        cp env.example .env.local
        echo "✅ .env.local created. Please update it with your Supabase credentials."
        echo "   Edit .env.local and add your Supabase URL and key."
    else
        echo "⚠️  No env.example found. You may need to create .env.local manually."
    fi
else
    echo "✅ Environment variables already configured."
fi

# Check if the port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Attempting to kill existing process..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

echo ""
echo "🌐 Starting development server on http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo "=================================================="
echo ""

# Start the development server
npm run dev 