# Workout Music Files

This directory should contain workout music files that will be played during workout sessions.

## Required Files

The following files are expected by the workout timer:

- `workout_music1.mp3` - First workout music track
- `workout_music2.mp3` - Second workout music track  
- `workout_music3.mp3` - Third workout music track
- `workout_music4.mp3` - Fourth workout music track
- `workout_music5.mp3` - Fifth workout music track

## How It Works

- When a workout starts, the timer randomly shuffles these tracks
- Tracks play sequentially in the shuffled order
- When all tracks finish, the playlist reshuffles and starts over
- Music automatically pauses/resumes with the timer
- Music stops when the workout is reset or completed

## Adding Your Music

1. Place your MP3 files in this directory
2. Name them exactly as shown above (workout_music1.mp3, etc.)
3. Ensure files are high quality and appropriate length for workouts
4. The system will automatically detect and use them

## Audio Format

- **Format**: MP3
- **Quality**: 128kbps or higher recommended
- **Length**: 2-5 minutes per track recommended
- **Volume**: Normalized to prevent volume differences
