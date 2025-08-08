# Design System - Sporty, Energetic & Calming

## 🎨 Color Palette

### Primary Colors

#### Sport Colors (Workout Timer)
- **sport-50**: `#f0f9ff` - Lightest sport blue
- **sport-100**: `#e0f2fe` - Very light sport blue
- **sport-200**: `#bae6fd` - Light sport blue
- **sport-300**: `#7dd3fc` - Medium light sport blue
- **sport-400**: `#38bdf8` - Medium sport blue
- **sport-500**: `#0ea5e9` - Primary sport blue
- **sport-600**: `#0284c7` - Dark sport blue
- **sport-700**: `#0369a1` - Darker sport blue
- **sport-800**: `#075985` - Very dark sport blue
- **sport-900**: `#0c4a6e` - Darkest sport blue

#### Calm Colors (Meditation Timer)
- **calm-50**: `#f0fdf4` - Lightest calm green
- **calm-100**: `#dcfce7` - Very light calm green
- **calm-200**: `#bbf7d0` - Light calm green
- **calm-300**: `#86efac` - Medium light calm green
- **calm-400**: `#4ade80` - Medium calm green
- **calm-500**: `#22c55e` - Primary calm green
- **calm-600**: `#16a34a` - Dark calm green
- **calm-700**: `#15803d` - Darker calm green
- **calm-800**: `#166534` - Very dark calm green
- **calm-900**: `#14532d` - Darkest calm green

#### Energy Colors (Accents)
- **energy-50**: `#fef7ee` - Lightest energy orange
- **energy-100**: `#fdedd4` - Very light energy orange
- **energy-200**: `#fbd7a8` - Light energy orange
- **energy-300**: `#f8bb71` - Medium light energy orange
- **energy-400**: `#f59538` - Medium energy orange
- **energy-500**: `#f37415` - Primary energy orange
- **energy-600**: `#e45a0b` - Dark energy orange
- **energy-700**: `#bd430c` - Darker energy orange
- **energy-800**: `#963510` - Very dark energy orange
- **energy-900**: `#792e0f` - Darkest energy orange

### Neutral Colors
- **gray-50**: `#fafafa` - Lightest gray
- **gray-100**: `#f5f5f5` - Very light gray
- **gray-200**: `#e5e5e5` - Light gray
- **gray-300**: `#d4d4d4` - Medium light gray
- **gray-400**: `#a3a3a3` - Medium gray
- **gray-500**: `#737373` - Medium dark gray
- **gray-600**: `#525252` - Dark gray
- **gray-700**: `#404040` - Darker gray
- **gray-800**: `#262626` - Very dark gray
- **gray-900**: `#171717` - Darkest gray

## 🎯 Design Principles

### 1. Sporty & Energetic (Workout Timer)
- **Colors**: Sport blues and energy oranges
- **Feel**: Dynamic, motivating, high-energy
- **Gradients**: Bold, vibrant gradients
- **Shadows**: Strong, prominent shadows
- **Animations**: Bouncy, energetic transitions

### 2. Calming & Peaceful (Meditation Timer)
- **Colors**: Calm greens and soft blues
- **Feel**: Serene, peaceful, relaxing
- **Gradients**: Soft, gentle gradients
- **Shadows**: Subtle, soft shadows
- **Animations**: Smooth, gentle transitions

### 3. Modern & Clean
- **Glass Effect**: Backdrop blur and transparency
- **Rounded Corners**: Consistent 2xl radius
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system

## 🧩 Components

### Cards
```css
.card {
  @apply bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6;
}

.card-sport {
  @apply bg-gradient-to-br from-sport-50 to-sport-100/50 backdrop-blur-sm rounded-2xl shadow-xl border border-sport-200/50 p-6;
}

.card-calm {
  @apply bg-gradient-to-br from-calm-50 to-calm-100/50 backdrop-blur-sm rounded-2xl shadow-xl border border-calm-200/50 p-6;
}

.card-energy {
  @apply bg-gradient-to-br from-energy-50 to-energy-100/50 backdrop-blur-sm rounded-2xl shadow-xl border border-energy-200/50 p-6;
}
```

### Buttons
```css
.btn-primary {
  @apply bg-gradient-to-r from-sport-500 to-sport-600 hover:from-sport-600 hover:to-sport-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sport-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
}

.btn-calm {
  @apply bg-gradient-to-r from-calm-500 to-calm-600 hover:from-calm-600 hover:to-calm-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-calm-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
}

.btn-energy {
  @apply bg-gradient-to-r from-energy-500 to-energy-600 hover:from-energy-600 hover:to-energy-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-energy-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
}
```

### Gradients
```css
.gradient-text {
  @apply bg-gradient-to-r from-sport-600 to-energy-600 bg-clip-text text-transparent;
}

.gradient-text-calm {
  @apply bg-gradient-to-r from-calm-600 to-sport-600 bg-clip-text text-transparent;
}
```

## 🎨 Backgrounds

### Page Backgrounds
```css
/* Workout Timer */
bg-gradient-to-br from-sport-50 via-blue-50 to-indigo-100

/* Meditation Timer */
bg-gradient-to-br from-calm-50 via-green-50 to-emerald-100

/* General Pages */
bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100
```

### Header Backgrounds
```css
bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50
```

## 🎭 Animations

### Keyframes
```css
@keyframes fadeIn {
  '0%': { opacity: '0' },
  '100%': { opacity: '1' },
}

@keyframes slideUp {
  '0%': { transform: 'translateY(10px)', opacity: '0' },
  '100%': { transform: 'translateY(0)', opacity: '1' },
}
```

### Animation Classes
```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}
```

## 🎯 Usage Guidelines

### Workout Timer
- **Primary Color**: Sport blue (`sport-500`)
- **Accent Color**: Energy orange (`energy-500`)
- **Background**: Sport gradient
- **Cards**: `card-sport`
- **Buttons**: `variant="sport"`
- **Feel**: Energetic, motivating, dynamic

### Meditation Timer
- **Primary Color**: Calm green (`calm-500`)
- **Accent Color**: Sport blue (`sport-500`)
- **Background**: Calm gradient
- **Cards**: `card-calm`
- **Buttons**: `variant="calm"`
- **Feel**: Peaceful, serene, relaxing

### General Pages
- **Primary Color**: Sport blue (`sport-500`)
- **Accent Color**: Energy orange (`energy-500`)
- **Background**: General gradient
- **Cards**: `card`
- **Buttons**: `variant="primary"`
- **Feel**: Modern, clean, professional

## 🎨 Visual Hierarchy

### Typography
- **Headings**: Bold, gradient text
- **Body**: Regular weight, gray text
- **Labels**: Medium weight, colored text
- **Buttons**: Medium weight, white text

### Spacing
- **Page Padding**: `px-4 sm:px-6 lg:px-8 py-8`
- **Card Padding**: `p-6`
- **Section Margin**: `mb-8`
- **Element Spacing**: `space-x-4`, `space-y-6`

### Shadows
- **Cards**: `shadow-xl`
- **Buttons**: `shadow-lg hover:shadow-xl`
- **Hover Effects**: `hover:-translate-y-0.5`

## 🎯 Accessibility

### Color Contrast
- All text meets WCAG AA standards
- High contrast ratios for readability
- Color-blind friendly palette

### Focus States
- Clear focus rings on interactive elements
- Consistent focus styling across components
- Keyboard navigation support

### Motion
- Respects `prefers-reduced-motion`
- Smooth, purposeful animations
- No flashing or jarring movements
