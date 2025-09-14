# 🦕 Dino City Arcade Game

A thrilling web-based arcade defense game built with Phaser.js and Vite, featuring a "Jurassic Park meets city" aesthetic. Click on dinosaurs to eliminate them before they overrun the post-apocalyptic urban environment!

## 🎮 Game Features

### Core Gameplay
- **Click-to-Eliminate**: Point and click to take down dinosaurs
- **Progressive Difficulty**: Spawn rates increase and dinosaurs get faster as levels progress
- **Multiple Dinosaur Types**: T-Rex, Velociraptors, and Triceratops with unique behaviors
- **Combo System**: Chain kills for bonus points and multipliers
- **Lives System**: Don't let too many dinosaurs escape!

### Visual & Audio
- **Retro Arcade Aesthetic**: Pixel-perfect styling with bold, high-contrast UI
- **Post-Apocalyptic City**: Procedurally generated destroyed cityscape
- **Dynamic Lighting**: Lit windows, fires, and atmospheric effects
- **Particle Systems**: Explosions, muzzle flashes, blood splatters, and debris
- **Procedural Audio**: Web Audio API-generated sound effects and ambient audio
- **Atmospheric Effects**: Floating dust, smoke, and starfield backgrounds

### Game Systems
- **Object Pooling**: Optimized performance for 60fps gameplay
- **Local Storage**: Persistent high score tracking
- **Performance Ratings**: Rank system from Recruit to Legend
- **Easter Egg Achievements**: Special titles for unique play styles
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dino-city-arcade
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

### Deploying to Vercel

You can easily deploy this game to Vercel for free hosting:

#### Option 1: Deploy from GitHub
1. **Push your code to GitHub** (if not already done)
2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
3. **Click "New Project"** and import your repository  
4. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Click "Deploy"** - Vercel will automatically build and deploy your game!

#### Option 2: Deploy with Vercel CLI
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy the project**:
   ```bash
   npm run build
   vercel --prod
   ```

3. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: (select your account)
   - Link to existing project: `N` 
   - Project name: `dino-city-arcade` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

#### Auto-deployment
Once connected to GitHub, Vercel will automatically redeploy your game every time you push changes to the main branch.

**Your game will be live at**: `https://your-project-name.vercel.app`

## 🎯 How to Play

1. **Main Menu**: Click "START GAME" to begin your defense mission
2. **Gameplay**: Click on dinosaurs as they appear to eliminate them
3. **Scoring**: Different dinosaur types give different points
4. **Combos**: Quick consecutive kills multiply your score
5. **Lives**: You lose lives when dinosaurs escape off-screen
6. **Game Over**: Occurs when you run out of lives or too many dinosaurs are on screen

### Controls
- **Mouse/Touch**: Click/tap to shoot
- **ESC or P**: Pause game (in gameplay)
- **SPACE**: Play again (on game over screen)
- **ESC**: Return to main menu (on game over screen)

## 🏗️ Technical Architecture

### Built With
- **[Phaser.js 3.70.0](https://phaser.io/)**: Game engine and framework
- **[Vite](https://vitejs.dev/)**: Build tool and development server
- **Web Audio API**: Procedural sound generation
- **ES6+ JavaScript**: Modern JavaScript features
- **CSS3**: Styling and responsive design

### Project Structure
```
src/
├── main.js                 # Game initialization
├── index.html             # HTML entry point
├── scenes/                # Game scenes
│   ├── MainMenuScene.js   # Main menu
│   ├── GamePlayScene.js   # Core gameplay
│   └── GameOverScene.js   # Game over screen
├── objects/               # Game objects
│   ├── DinosaurManager.js # Dinosaur spawning & management
│   └── ParticleManager.js # Visual effects
└── utils/                 # Utility classes
    ├── GameState.js       # Game state management
    └── AudioManager.js    # Sound system
```

### Key Systems

#### DinosaurManager
- Object pooling for performance optimization
- Procedural dinosaur generation with geometric shapes
- Three dinosaur types with unique properties and behaviors
- Smooth animations and movement patterns

#### ParticleManager
- Explosion effects with randomized particles
- Muzzle flash effects for shooting feedback
- Blood splatter and debris systems
- Celebration particles for achievements

#### AudioManager
- Procedural audio generation using Web Audio API
- Dynamic sound effects (hits, misses, spawns)
- Ambient city atmosphere with distant roars
- Volume controls and browser compatibility

#### GameState
- Score tracking and high score persistence
- Level progression system
- Combo multiplier logic
- Statistics tracking for mission reports

## 🎨 Art Direction

The game embraces a **retro arcade aesthetic** combined with a **Jurassic Park urban setting**:

### Color Palette
- **Primary Green**: `#7fb069` (UI elements, vegetation)
- **Secondary Green**: `#a3c585` (accents, highlights)
- **Dark Green**: `#2d4a36` (shadows, outlines)
- **Urban Grays**: `#1a1a1a`, `#333333` (buildings, structures)
- **Warning Red**: `#ff4444` (danger, game over)
- **Accent Yellow**: `#ffff00` (scores, combos)

### Visual Style
- **Geometric dinosaur shapes** created with Phaser's built-in graphics
- **Procedural building generation** for unique cityscapes each play
- **Particle effects** for impact and atmosphere
- **Smooth animations** with breathing, blinking, and movement
- **Screen shake** and visual feedback for actions

## 🏆 Scoring System

### Base Points
- **T-Rex**: 100 points
- **Raptor**: 50 points  
- **Triceratops**: 75 points

### Multipliers
- **Level Multiplier**: Increases with level progression
- **Combo Bonus**: +5 points per combo hit
- **Perfect Accuracy**: Bonus for high hit rates

### Rankings
- **Recruit**: 0-499 points
- **Cadet**: 500-1,499 points
- **Soldier**: 1,500-2,999 points
- **Veteran**: 3,000-4,999 points
- **Legend**: 5,000+ points

## 🐛 Known Issues & Future Enhancements

### Potential Improvements
- Additional dinosaur types and behaviors
- Power-ups and special weapons
- Multiple city environments
- Multiplayer support
- Mobile-specific optimizations
- Save game functionality

### Browser Compatibility
- Modern browsers with ES6+ support
- WebGL-capable devices
- Web Audio API support (optional for sound)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

If you encounter any issues or have questions, please create an issue in the repository.

---

**Built with ❤️ using Phaser.js & Vite**

*Defend the city. Eliminate the threat. Become a legend.*
