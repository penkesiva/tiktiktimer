#!/bin/bash

# Quick start script for Workout & Meditation Timer
# This script just starts the development server

echo "🚀 Starting Workout & Meditation Timer..."
echo "🌐 Server will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Check if port 3000 is in use and kill if necessary
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Killing existing process..."
    lsof -ti:3000 | xargs kill -9
    sleep 1
fi

# Start the development server
npm run dev 