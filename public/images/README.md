# Images Directory

This directory contains the images used throughout the timer app.

## 📁 Required Images

Please place the following images in this directory:

### 🏋️ Workout Images
- `workout1.jpg` - First workout image (used in workout timer and home page)
- `workout2.jpg` - Second workout image (used in workout timer and home page)

### 🧘‍♀️ Yoga/Meditation Images
- `yoga.jpg` - Yoga/meditation image (used in meditation timer and home page)

### 🎯 App Logo
- `tiktiktimer.png` - TikTikTimer logo/brand image (used in home page)

## 🎨 Image Specifications

### Recommended Sizes
- **workout1.jpg**: 300x300px or larger (square format)
- **workout2.jpg**: 300x300px or larger (square format)
- **yoga.jpg**: 300x300px or larger (square format)
- **tiktiktimer.png**: 200x200px or larger (square format, transparent background preferred)

### File Formats
- **JPEG**: For workout and yoga images (good for photos)
- **PNG**: For logo (supports transparency)

### Quality Guidelines
- **Resolution**: At least 300x300px for good quality
- **File Size**: Keep under 500KB per image for fast loading
- **Aspect Ratio**: Square format works best for the circular display

## 🎯 Usage Locations

### Home Page (`app/page.tsx`)
- **tiktiktimer.png**: Top-right decorative element
- **workout1.jpg**: Bottom-left decorative element
- **yoga.jpg**: Hero section decorative element
- **workout2.jpg**: Workout card background
- **yoga.jpg**: Meditation card background

### Workout Timer (`app/workout/page.tsx`)
- **workout1.jpg**: Background decorative elements and card backgrounds
- **workout2.jpg**: Background decorative elements and card backgrounds

### Meditation Timer (`app/meditation/page.tsx`)
- **yoga.jpg**: Background decorative elements and card backgrounds

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
- **Workout Images**: Integrated with sport-themed color scheme
- **Yoga Images**: Integrated with calm-themed color scheme
- **Logo**: Integrated with gradient text effects

### Visual Hierarchy
- **Primary Images**: Larger, more prominent placement
- **Decorative Images**: Smaller, subtle placement with low opacity
- **Background Images**: Very subtle, ambient placement

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
