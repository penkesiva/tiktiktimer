#!/bin/bash

# Convert images to WebP format for better web performance
echo "🖼️  Converting images to WebP format..."

# Check if cwebp is installed (part of WebP tools)
if ! command -v cwebp &> /dev/null; then
    echo "❌ WebP tools not found. Please install them first:"
    echo "   brew install webp (Mac)"
    echo "   sudo apt-get install webp (Ubuntu)"
    exit 1
fi

# Convert each image to WebP
echo "📦 Converting logo.png to WebP..."
cwebp -q 85 -resize 300 300 public/images/logo.png -o public/images/logo.webp

echo "📦 Converting workout1.png to WebP..."
cwebp -q 85 -resize 400 400 public/images/workout1.png -o public/images/workout1.webp

echo "📦 Converting workout2.png to WebP..."
cwebp -q 85 -resize 400 400 public/images/workout2.png -o public/images/workout2.webp

echo "📦 Converting meditation.png to WebP..."
cwebp -q 85 -resize 400 400 public/images/meditation.png -o public/images/meditation.webp

# Show file sizes
echo ""
echo "📊 File size comparison:"
echo "Original PNG files:"
ls -lh public/images/*.png
echo ""
echo "WebP files:"
ls -lh public/images/*.webp

echo ""
echo "✅ WebP conversion complete!"
echo "💡 You can now update the image references in your code to use .webp files"
