# Workout & Meditation Timer

A clean, minimalist SaaS application for workout and meditation timing with customizable intervals and professional audio cues.

## 🚀 Features

- **Workout Timer**: Interval training with customizable work/rest periods
- **Meditation Timer**: Multiple modes (silent, guided, ambient sound)
- **Audio Cues**: Professional voice prompts and chime sounds
- **Workout Music**: Background music that plays during work phases
- **Dual Mute Controls**: Separate controls for music and voice guidance
- **Smart Audio**: Music automatically pauses during rest periods
- **PWA Support**: Installable as a mobile app
- **Clean Design**: Minimalist interface inspired by CrossHero Timer

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🚀 Quick Start Scripts

The project includes two convenient scripts for launching the development server:

### `init.sh` - Full Initialization Script
- Checks for Node.js and npm installation
- Installs dependencies if needed
- Creates `.env.local` from example if missing
- Kills any existing process on port 3000
- Starts the development server

```bash
./init.sh
```

### `start.sh` - Quick Start Script
- Kills any existing process on port 3000
- Starts the development server immediately

```bash
./start.sh
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd workout-meditation-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   
   **Option 1: Using the init script (recommended for first time)**
   ```bash
   ./init.sh
   ```
   
   **Option 2: Using the quick start script**
   ```bash
   ./start.sh
   ```
   
   **Option 3: Manual start**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── timer/            # Timer-related components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
    └── audio/            # Audio files
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 PWA Features

- Installable on mobile devices
- Offline functionality
- Push notifications (future)
- App-like experience

## 🎨 Design System

- **Colors**: Clean blue and gray palette
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from [CrossHero Timer](https://timer.crosshero.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) 