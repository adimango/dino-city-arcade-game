export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' })
    }

    preload() {
        // Load background music
        this.load.audio('backgroundMusic', 'assets/music/background-music.mp3')
    }

    create() {
        // Start background music if not already playing
        this.startBackgroundMusic()
        
        // Create jungle background
        this.createJungleBackground()
        
        // Create city/jungle silhouette
        this.createCitySilhouette()
        
        // Responsive layout based on screen dimensions
        const screenWidth = this.cameras.main.width
        const screenHeight = this.cameras.main.height
        const isLandscape = screenWidth > screenHeight
        const isMobile = screenWidth < 768
        
        // Adjust layout for different screen orientations
        let titleY, subtitleY, highScoreY, buttonY, instructionsY
        let titleSize, subtitleSize, buttonSize, instructionSize
        
        if (isLandscape && isMobile) {
            // iPhone landscape - compact layout
            titleY = screenHeight * 0.15
            subtitleY = screenHeight * 0.28
            highScoreY = screenHeight * 0.45
            buttonY = screenHeight * 0.65
            instructionsY = screenHeight * 0.85
            titleSize = '48px'
            subtitleSize = '20px'
            buttonSize = '20px'
            instructionSize = '14px'
        } else if (!isLandscape && isMobile) {
            // iPhone portrait - normal layout
            titleY = screenHeight * 0.2
            subtitleY = screenHeight * 0.3
            highScoreY = screenHeight * 0.45
            buttonY = screenHeight * 0.6
            instructionsY = screenHeight * 0.75
            titleSize = '56px'
            subtitleSize = '28px'
            buttonSize = '22px'
            instructionSize = '16px'
        } else {
            // Desktop/tablet - full layout
            titleY = 150
            subtitleY = 220
            highScoreY = 350
            buttonY = 450
            instructionsY = 550
            titleSize = '72px'
            subtitleSize = '32px'
            buttonSize = '24px'
            instructionSize = '18px'
        }
        
        // Title with arcade jungle theme - yellow/gold text with black outline using monospace font
        const title = this.add.text(this.cameras.main.centerX, titleY, 'CITTÀ DINO', {
            fontSize: titleSize,
            fontFamily: 'Courier New, monospace',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            fontStyle: 'bold'
        }).setOrigin(0.5)

        // Add title glow effect
        this.tweens.add({
            targets: title,
            alpha: 0.9,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })

        const subtitle = this.add.text(this.cameras.main.centerX, subtitleY, 'ARCADE GIUNGLA', {
            fontSize: subtitleSize,
            fontFamily: 'Courier New, monospace',
            fill: '#FFA500',
            stroke: '#000000',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5)

        // Animated dinosaur silhouette (only show on larger screens)
        if (!isLandscape || !isMobile) {
            this.createMenuDinosaur()
        }

        // High Score
        const highScoreText = this.add.text(this.cameras.main.centerX, highScoreY, `RECORD: ${window.gameState.highScore}`, {
            fontSize: buttonSize,
            fontFamily: 'Courier New, monospace',
            fill: '#7fb069'
        }).setOrigin(0.5)

        // Start Button - responsive size
        const buttonWidth = isMobile ? 160 : 200
        const buttonHeight = isMobile ? 50 : 60
        
        const startButton = this.add.rectangle(this.cameras.main.centerX, buttonY, buttonWidth, buttonHeight, 0x7fb069)
            .setInteractive()
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => startButton.setFillStyle(0xa3c585))
            .on('pointerout', () => startButton.setFillStyle(0x7fb069))

        // Button border
        const startButtonBorder = this.add.rectangle(this.cameras.main.centerX, buttonY, buttonWidth, buttonHeight)
            .setStrokeStyle(4, 0x2d4a36)
            .setFillStyle()

        const startText = this.add.text(this.cameras.main.centerX, buttonY, 'INIZIA', {
            fontSize: buttonSize,
            fontFamily: 'Courier New, monospace',
            fill: '#000000'
        }).setOrigin(0.5)

        // Instructions - shorter text on mobile landscape
        let instructionText = 'Clicca sui dinosauri per bloccarli!\nNon lasciarne scappare troppi!'
        if (isLandscape && isMobile) {
            instructionText = 'Tocca i dinosauri per bloccarli!'
        }
        
        const instructions = this.add.text(this.cameras.main.centerX, instructionsY, instructionText, {
            fontSize: instructionSize,
            fontFamily: 'Courier New, monospace',
            fill: '#a3c585',
            align: 'center'
        }).setOrigin(0.5)

        // Sound toggle - responsive position
        const soundButtonSize = isMobile ? 70 : 80
        const soundX = isMobile ? 40 : 50
        const soundY = isMobile ? 40 : 50
        
        const soundButton = this.add.rectangle(soundX, soundY, soundButtonSize, 40, window.gameState.soundEnabled ? 0x7fb069 : 0x666666)
            .setInteractive()
            .on('pointerdown', () => this.toggleSound(soundButton, soundText))

        // Sound button border
        const soundButtonBorder = this.add.rectangle(soundX, soundY, soundButtonSize, 40)
            .setStrokeStyle(2, 0x2d4a36)
            .setFillStyle()

        const soundText = this.add.text(soundX, soundY, window.gameState.soundEnabled ? 'SUONI ON' : 'SUONI OFF', {
            fontSize: isMobile ? '10px' : '12px',
            fontFamily: 'Courier New, monospace',
            fill: '#000000'
        }).setOrigin(0.5)

        // Credits - only show on non-mobile landscape
        if (!isLandscape || !isMobile) {
            this.add.text(this.cameras.main.centerX, this.cameras.main.height - 30, 'Built with Phaser.js & Vite', {
                fontSize: '14px',
                fontFamily: 'Courier New, monospace',
                fill: '#666666'
            }).setOrigin(0.5)
        }
    }

    createJungleBackground() {
        // Create jungle gradient background - darker green like the image
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x2d4a36)
        background.setOrigin(0, 0)
        
        // Add jungle atmospheric effects
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width)
            const y = Phaser.Math.Between(0, this.cameras.main.height/2)
            const leaf = this.add.circle(x, y, Phaser.Math.Between(2, 4), 0x1a3a26, 0.3)
            
            // Animate floating leaves
            this.tweens.add({
                targets: leaf,
                x: leaf.x + Phaser.Math.Between(-100, 100),
                y: leaf.y + Phaser.Math.Between(50, 150),
                alpha: 0.1,
                duration: Phaser.Math.Between(8000, 15000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            })
        }
    }

    createCitySilhouette() {
        // Create destroyed city skyline
        const buildings = []
        const numBuildings = 8
        const buildingWidth = this.cameras.main.width / numBuildings

        for (let i = 0; i < numBuildings; i++) {
            const x = i * buildingWidth
            const height = Phaser.Math.Between(100, 300)
            const y = this.cameras.main.height - height

            // Main building shape
            const building = this.add.rectangle(x + buildingWidth/2, y + height/2, buildingWidth, height, 0x1a1a1a, 0.8)
            buildings.push(building)

            // Add some destroyed/damaged effects
            if (Math.random() < 0.5) {
                // Damaged roof
                const damage = this.add.triangle(x + buildingWidth/2, y, 0, 0, buildingWidth/4, 20, buildingWidth/2, 0, 0x0d1912)
            }

            // Windows (some lit, some broken)
            for (let row = 0; row < Math.floor(height/40); row++) {
                for (let col = 0; col < 3; col++) {
                    if (Math.random() < 0.3) {
                        const windowX = x + 20 + col * 25
                        const windowY = y + 20 + row * 40
                        const color = Math.random() < 0.2 ? 0x7fb069 : 0x333333
                        this.add.rectangle(windowX, windowY, 8, 12, color)
                    }
                }
            }
        }
    }

    createMenuDinosaur() {
        // Create animated T-Rex silhouette
        const dinoX = 150
        const dinoY = this.cameras.main.height - 150

        // T-Rex body (simplified geometric shape)
        const body = this.add.ellipse(dinoX, dinoY, 80, 120, 0x2d4a36, 0.8)
        
        // Head
        const head = this.add.ellipse(dinoX + 20, dinoY - 80, 60, 80, 0x2d4a36, 0.8)
        
        // Tail
        const tail = this.add.triangle(dinoX - 40, dinoY + 20, -60, 0, 0, -30, 0, 30, 0x2d4a36, 0.8)
        
        // Legs
        const leg1 = this.add.rectangle(dinoX - 20, dinoY + 80, 25, 80, 0x2d4a36, 0.8)
        const leg2 = this.add.rectangle(dinoX + 20, dinoY + 80, 25, 80, 0x2d4a36, 0.8)
        
        // Small arms
        const arm1 = this.add.rectangle(dinoX + 30, dinoY - 20, 15, 40, 0x2d4a36, 0.8)
        const arm2 = this.add.rectangle(dinoX + 45, dinoY - 20, 15, 40, 0x2d4a36, 0.8)

        // Eyes (glowing)
        const eye1 = this.add.circle(dinoX + 35, dinoY - 90, 3, 0xff0000)
        const eye2 = this.add.circle(dinoX + 45, dinoY - 90, 3, 0xff0000)

        // Group all parts
        const dinoGroup = this.add.group([body, head, tail, leg1, leg2, arm1, arm2, eye1, eye2])

        // Animate breathing
        this.tweens.add({
            targets: [body, head],
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })

        // Animate eyes
        this.tweens.add({
            targets: [eye1, eye2],
            alpha: 0.3,
            duration: 3000,
            yoyo: true,
            repeat: -1
        })
    }

    startBackgroundMusic() {
        // Only start if music is not already playing and sound is enabled
        if (window.gameState.soundEnabled && !this.registry.get('backgroundMusicPlaying')) {
            const music = this.sound.add('backgroundMusic', {
                loop: true,
                volume: 0.1
            })
            
            music.play()
            
            // Mark that background music is now playing
            this.registry.set('backgroundMusicPlaying', true)
            this.registry.set('backgroundMusicInstance', music)
        }
    }

    toggleSound(button, text) {
        window.gameState.soundEnabled = !window.gameState.soundEnabled
        button.setFillStyle(window.gameState.soundEnabled ? 0x7fb069 : 0x666666)
        text.setText(window.gameState.soundEnabled ? 'SUONI ON' : 'SUONI OFF')
        
        // Handle background music when toggling sound
        const musicInstance = this.registry.get('backgroundMusicInstance')
        if (window.gameState.soundEnabled) {
            if (musicInstance && !musicInstance.isPlaying) {
                musicInstance.resume()
            } else if (!musicInstance) {
                this.startBackgroundMusic()
            }
        } else {
            if (musicInstance && musicInstance.isPlaying) {
                musicInstance.pause()
            }
        }
    }

    startGame() {
        window.gameState.reset()
        window.gameState.gameRunning = true
        this.scene.start('GamePlayScene')
    }
}
