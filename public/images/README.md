# Images Directory

This directory contains the images used throughout the timer app.

## 📁 Required Images

Please place the following images in this directory:

### 🏋️ Workout Images
- `workout1.png` - First workout image (used in workout timer, meditation timer, and home page)
- `workout2.png` - Second workout image (used in workout timer, meditation timer, and home page)

### 🧘‍♀️ Meditation Images
- `meditation.png` - Meditation image (used in meditation timer and home page)

### 🎯 App Logo
- `logo.png` - TikTikTimer logo/brand image (used in home page)

## 🎨 Image Specifications

### Recommended Sizes
- **workout1.png**: 300x300px or larger (square format)
- **workout2.png**: 300x300px or larger (square format)
- **meditation.png**: 300x300px or larger (square format)
- **logo.png**: 200x200px or larger (square format, transparent background preferred)

### File Formats
- **PNG**: For all images (supports transparency and better quality)

### Quality Guidelines
- **Resolution**: At least 300x300px for good quality
- **File Size**: Keep under 500KB per image for fast loading
- **Aspect Ratio**: Square format works best for the circular display
- **Transparency**: PNG format supports transparency for better integration

## 🎯 Usage Locations

### Home Page (`app/page.tsx`)
- **logo.png**: Top-right decorative element
- **workout1.png**: Bottom-left decorative element
- **workout2.png**: Hero section decorative element
- **workout2.png**: Workout card background
- **meditation.png**: Meditation card background

### Workout Timer (`app/workout/page.tsx`)
- **workout1.png**: Background decorative elements and card backgrounds
- **workout2.png**: Background decorative elements and card backgrounds

### Meditation Timer (`app/meditation/page.tsx`)
- **meditation.png**: Background decorative elements and card backgrounds
- **workout1.png**: Background decorative elements

## 🔧 Implementation Details

### Image Components
The app uses optimized image components located in `components/ui/Image.tsx`:

- **OptimizedImage**: Main image component with hover effects
- **DecorativeImage**: For background/ambient images
- **HeroImage**: For larger, prominent images

### Styling Features
- **Rounded Corners**: All images are displayed with rounded corners
- **Shadow Effects**: Elegant shadow system for depth
- **Hover Effects**: Subtle scale animation on hover
- **Opacity Control**: Decorative images use low opacity (10-20%)
- **Responsive Design**: Images scale appropriately on different devices

### Performance Optimization
- **Next.js Image**: Uses Next.js optimized Image component
- **Lazy Loading**: Images load as needed
- **Quality Optimization**: Automatic quality optimization
- **Format Optimization**: Automatic format selection

## 🎨 Design Integration

### Color Themes
- **Workout Images**: Integrated with sport-themed color schemes
- **Meditation Images**: Integrated with calm-themed color schemes
- **Logo**: Integrated with gradient text effects

### Visual Hierarchy
- **Primary Images**: Larger, more prominent placement
- **Decorative Images**: Smaller, subtle placement with low opacity
- **Background Images**: Very subtle, ambient placement

### Integration Strategy
- **Non-Intrusive**: Images don't interfere with core functionality
- **Enhancement**: Images add visual appeal without overwhelming
- **Contextual**: Images match the theme of each section
- **Balanced**: Proper balance between content and decoration

## 🚀 Next Steps

1. **Add Images**: Place your images in this directory
2. **Test Display**: Check how images look on different pages
3. **Optimize**: Compress images if needed for faster loading
4. **Adjust**: Modify opacity or placement if desired

## 📝 Notes

- Images are displayed as circular elements for a modern look
- Opacity levels are set to be subtle and not interfere with content
- All images are responsive and work on mobile devices
- Images are optimized for performance and fast loading
- PNG format provides better quality and transparency support
