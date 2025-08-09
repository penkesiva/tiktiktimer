#!/bin/bash

# Image optimization script for TikTikTimer
echo "🖼️  Optimizing images for web..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it first:"
    echo "   brew install imagemagick (Mac)"
    echo "   sudo apt-get install imagemagick (Ubuntu)"
    exit 1
fi

# Create optimized directory
mkdir -p public/images/optimized

# Optimize each image
echo "📦 Optimizing logo.png..."
convert public/images/logo.png -resize 300x300 -quality 85 public/images/optimized/logo.png

echo "📦 Optimizing workout1.png..."
convert public/images/workout1.png -resize 400x400 -quality 85 public/images/optimized/workout1.png

echo "📦 Optimizing workout2.png..."
convert public/images/workout2.png -resize 400x400 -quality 85 public/images/optimized/workout2.png

echo "📦 Optimizing meditation.png..."
convert public/images/meditation.png -resize 400x400 -quality 85 public/images/optimized/meditation.png

# Show file sizes
echo ""
echo "📊 File size comparison:"
echo "Original files:"
ls -lh public/images/*.png | grep -v optimized
echo ""
echo "Optimized files:"
ls -lh public/images/optimized/*.png

echo ""
echo "✅ Optimization complete!"
echo "💡 You can now replace the original files with optimized ones:"
echo "   mv public/images/optimized/* public/images/"
echo "   rm -rf public/images/optimized"
