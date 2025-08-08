# Audio Generation Guide

This guide will help you generate the missing audio files for your workout and meditation timer application.

## 🎯 Priority Order

### **HIGH PRIORITY** (Generate First)
1. **Workout Core Cues** - Essential for workout timer functionality
2. **Chime Sounds** - Needed for all timer interactions
3. **Meditation Cues** - Essential for meditation timer

### **MEDIUM PRIORITY** (Generate Second)
1. **Motivational Cues** - Enhances workout experience
2. **Meditation Timer Cues** - Improves meditation experience

### **LOW PRIORITY** (Generate Last)
1. **Ambient Sounds** - Optional background audio

## 🎤 Method 1: ElevenLabs (Recommended)

### Setup Instructions:
1. **Create Account**: Sign up at [elevenlabs.io](https://elevenlabs.io)
2. **Choose Voice**: Select a calm, professional voice (recommended: Rachel, Adam, or similar)
3. **Voice Settings**:
   - **Stability**: 75-85%
   - **Similarity**: 75-85%
   - **Style**: 0-20%
   - **Speed**: 0.8-0.9 (slightly slower for clarity)

### Generation Process:

#### Step 1: Workout Core Cues
```
Text to generate:
- "Start"
- "Rest" 
- "Round 1" through "Round 8"
- "Final Round"
- "Workout complete"
```

#### Step 2: Meditation Cues
```
Text to generate:
- "Meditation beginning"
- "Meditation complete"
- "Take a moment to return to your surroundings."
```

#### Step 3: Motivational Cues
```
Text to generate:
- "You've got this!"
- "Halfway there!"
- "Keep going!"
- "Almost there!"
- "Great work!"
- "Stay strong!"
```

### File Naming Convention:
```
workout/core/start.mp3
workout/core/rest.mp3
workout/core/round-1.mp3
workout/core/round-2.mp3
workout/core/round-3.mp3
workout/core/round-4.mp3
workout/core/round-5.mp3
workout/core/round-6.mp3
workout/core/round-7.mp3
workout/core/round-8.mp3
workout/core/final-round.mp3
workout/core/workout-complete.mp3
workout/motivational/youve-got-this.mp3
workout/motivational/halfway-there.mp3
workout/motivational/keep-going.mp3
workout/motivational/almost-there.mp3
workout/motivational/great-work.mp3
workout/motivational/stay-strong.mp3
meditation/cues/meditation-beginning.mp3
meditation/cues/meditation-complete.mp3
meditation/cues/return-surroundings.mp3
```

## 🔔 Method 2: Chime Sounds

### Option A: ElevenLabs Sound Generation
1. Use ElevenLabs sound generation feature
2. Generate these sounds:
   - `chimes/start-chime.mp3` - 1-second bell sound
   - `chimes/rest-chime.mp3` - 1-second bell sound
   - `chimes/round-chime.mp3` - 1-second bell sound
   - `chimes/completion-chime.mp3` - 1-second bell sound
   - `chimes/meditation-start-chime.mp3` - Gentle bell
   - `chimes/meditation-end-chime.mp3` - Gentle bell
   - `chimes/midway-chime.mp3` - Optional bell

### Option B: Free Sound Libraries
1. **Freesound.org** - Search for "bell chime" or "notification sound"
2. **Zapsplat.com** - Professional sound effects
3. **Soundbible.com** - Free sound effects

### Option C: Generate with Code
```bash
# Using ffmpeg to generate simple chime sounds
ffmpeg -f lavfi -i "sine=frequency=800:duration=1" -c:a mp3 chimes/start-chime.mp3
ffmpeg -f lavfi -i "sine=frequency=600:duration=1" -c:a mp3 chimes/rest-chime.mp3
```

## 🎵 Method 3: Ambient Sounds

### Option A: ElevenLabs Sound Generation
Generate 10-minute loops of:
- `ambient/rain-sounds.mp3`
- `ambient/ocean-waves.mp3`
- `ambient/tibetan-bells.mp3`

### Option B: Free Ambient Sound Libraries
1. **Ambient Mixer** - Free ambient sounds
2. **Freesound.org** - Search for "rain", "ocean", "bells"
3. **Zapsplat.com** - Professional ambient sounds

## 📁 File Organization

After generating, organize files in this structure:

```
public/audio/
├── workout/
│   ├── core/
│   │   ├── start.mp3
│   │   ├── rest.mp3
│   │   ├── round-1.mp3
│   │   ├── round-2.mp3
│   │   ├── round-3.mp3
│   │   ├── round-4.mp3
│   │   ├── round-5.mp3
│   │   ├── round-6.mp3
│   │   ├── round-7.mp3
│   │   ├── round-8.mp3
│   │   ├── final-round.mp3
│   │   └── workout-complete.mp3
│   └── motivational/
│       ├── youve-got-this.mp3
│       ├── halfway-there.mp3
│       ├── keep-going.mp3
│       ├── almost-there.mp3
│       ├── great-work.mp3
│       └── stay-strong.mp3
├── meditation/
│   ├── prompts/ (already exists)
│   └── cues/
│       ├── meditation-beginning.mp3
│       ├── meditation-complete.mp3
│       └── return-surroundings.mp3
├── chimes/
│   ├── start-chime.mp3
│   ├── rest-chime.mp3
│   ├── round-chime.mp3
│   ├── completion-chime.mp3
│   ├── meditation-start-chime.mp3
│   ├── meditation-end-chime.mp3
│   └── midway-chime.mp3
└── ambient/
    ├── rain-sounds.mp3
    ├── ocean-waves.mp3
    └── tibetan-bells.mp3
```

## 🔧 Implementation Steps

### Step 1: Generate High Priority Audio
1. Use ElevenLabs to generate workout core cues
2. Generate or download chime sounds
3. Generate meditation cues

### Step 2: Update Audio Manager
```typescript
// Add to lib/audio.ts
private preloadWorkoutAudio() {
  const workoutCues = [
    'start', 'rest', 'round-1', 'round-2', 'round-3', 'round-4',
    'round-5', 'round-6', 'round-7', 'round-8', 'final-round', 'workout-complete'
  ]
  
  workoutCues.forEach(cue => {
    const audio = new Audio(`/audio/workout/core/${cue}.mp3`)
    audio.preload = 'auto'
    this.audioElements.set(cue, audio)
  })
}
```

### Step 3: Test Audio Integration
1. Test each audio file plays correctly
2. Verify timing and volume levels
3. Test on different devices and browsers

## 💡 Tips for Best Results

1. **Consistency**: Use the same voice for all cues
2. **Pacing**: Slightly slower than normal speech for clarity
3. **Tone**: Warm, encouraging, and professional
4. **Volume**: Keep consistent levels across all files
5. **Format**: Use MP3 format for compatibility
6. **Quality**: Use high-quality settings for clear audio

## 🚀 Quick Start Commands

```bash
# Create directories
mkdir -p public/audio/workout/core
mkdir -p public/audio/workout/motivational
mkdir -p public/audio/meditation/cues
mkdir -p public/audio/chimes
mkdir -p public/audio/ambient

# Generate simple chimes with ffmpeg (if available)
ffmpeg -f lavfi -i "sine=frequency=800:duration=1" -c:a mp3 public/audio/chimes/start-chime.mp3
ffmpeg -f lavfi -i "sine=frequency=600:duration=1" -c:a mp3 public/audio/chimes/rest-chime.mp3
```

## 📞 Support

If you need help with audio generation:
1. Check ElevenLabs documentation
2. Use free sound libraries as backup
3. Consider hiring a voice actor for professional quality
4. Test audio quality on multiple devices
