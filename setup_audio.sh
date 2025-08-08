#!/bin/bash

# Audio Setup Script for Workout & Meditation Timer
# This script creates the necessary directories and generates basic chime sounds

echo "🎵 Setting up audio directories and generating basic chimes..."

# Create audio directories
echo "📁 Creating audio directories..."
mkdir -p public/audio/workout/core
mkdir -p public/audio/workout/motivational
mkdir -p public/audio/meditation/cues
mkdir -p public/audio/chimes
mkdir -p public/audio/ambient

# Check if ffmpeg is available
if command -v ffmpeg &> /dev/null; then
    echo "🔔 Generating basic chime sounds with ffmpeg..."
    
    # Generate chime sounds
    ffmpeg -f lavfi -i "sine=frequency=800:duration=1" -c:a mp3 public/audio/chimes/start-chime.mp3 -y
    ffmpeg -f lavfi -i "sine=frequency=600:duration=1" -c:a mp3 public/audio/chimes/rest-chime.mp3 -y
    ffmpeg -f lavfi -i "sine=frequency=700:duration=1" -c:a mp3 public/audio/chimes/round-chime.mp3 -y
    ffmpeg -f lavfi -i "sine=frequency=500:duration=1" -c:a mp3 public/audio/chimes/completion-chime.mp3 -y
    ffmpeg -f lavfi -i "sine=frequency=400:duration=1" -c:a mp3 public/audio/chimes/meditation-start-chime.mp3 -y
    ffmpeg -f lavfi -i "sine=frequency=300:duration=1" -c:a mp3 public/audio/chimes/meditation-end-chime.mp3 -y
    ffmpeg -f lavfi -i "sine=frequency=600:duration=0.5" -c:a mp3 public/audio/chimes/midway-chime.mp3 -y
    
    echo "✅ Chime sounds generated successfully!"
else
    echo "⚠️  ffmpeg not found. Please install ffmpeg to generate chime sounds automatically."
    echo "   You can download chime sounds from:"
    echo "   - https://freesound.org/search/?q=bell+chime"
    echo "   - https://zapsplat.com/sound-effect-category/bells/"
    echo "   - https://soundbible.com/tags-chime.html"
fi

# Create placeholder files for missing audio
echo "📝 Creating placeholder files for missing audio..."

# Workout core cues placeholders
cat > public/audio/workout/core/README.md << 'EOF'
# Workout Core Audio Cues

These files need to be generated using ElevenLabs or similar TTS service:

- start.mp3 - "Start"
- rest.mp3 - "Rest"
- round-1.mp3 - "Round 1"
- round-2.mp3 - "Round 2"
- round-3.mp3 - "Round 3"
- round-4.mp3 - "Round 4"
- round-5.mp3 - "Round 5"
- round-6.mp3 - "Round 6"
- round-7.mp3 - "Round 7"
- round-8.mp3 - "Round 8"
- final-round.mp3 - "Final Round"
- workout-complete.mp3 - "Workout complete"

See AUDIO_GENERATION_GUIDE.md for detailed instructions.
EOF

# Motivational cues placeholders
cat > public/audio/workout/motivational/README.md << 'EOF'
# Workout Motivational Audio Cues

These files need to be generated using ElevenLabs or similar TTS service:

- youve-got-this.mp3 - "You've got this!"
- halfway-there.mp3 - "Halfway there!"
- keep-going.mp3 - "Keep going!"
- almost-there.mp3 - "Almost there!"
- great-work.mp3 - "Great work!"
- stay-strong.mp3 - "Stay strong!"

See AUDIO_GENERATION_GUIDE.md for detailed instructions.
EOF

# Meditation cues placeholders
cat > public/audio/meditation/cues/README.md << 'EOF'
# Meditation Timer Audio Cues

These files need to be generated using ElevenLabs or similar TTS service:

- meditation-beginning.mp3 - "Meditation beginning"
- meditation-complete.mp3 - "Meditation complete"
- return-surroundings.mp3 - "Take a moment to return to your surroundings."

See AUDIO_GENERATION_GUIDE.md for detailed instructions.
EOF

# Ambient sounds placeholders
cat > public/audio/ambient/README.md << 'EOF'
# Ambient Sounds

These files need to be generated or downloaded:

- rain-sounds.mp3 - 10-minute loop of gentle rain
- ocean-waves.mp3 - 10-minute loop of ocean waves
- tibetan-bells.mp3 - 10-minute loop of Tibetan singing bowls

Sources:
- https://freesound.org/search/?q=rain+ambient
- https://freesound.org/search/?q=ocean+waves
- https://freesound.org/search/?q=tibetan+bells

See AUDIO_GENERATION_GUIDE.md for detailed instructions.
EOF

echo "✅ Audio setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Generate workout core cues using ElevenLabs (see AUDIO_GENERATION_GUIDE.md)"
echo "2. Generate meditation cues using ElevenLabs"
echo "3. Download or generate ambient sounds"
echo "4. Test audio integration in the application"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - AUDIO_GENERATION_GUIDE.md"
echo "   - AUDIO_CONTENT.md"
echo "   - ELEVENLABS_TEXT_LIST.txt"
