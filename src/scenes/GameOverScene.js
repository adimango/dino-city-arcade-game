import { track } from '@vercel/analytics'

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' })
    }

    create() {
        // Create dark overlay
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8).setOrigin(0, 0)
        
        // Create starfield background
        this.createStarfield()
        
        // Create destroyed city silhouette
        this.createDestroyCityBackground()
        
        // Game Over title
        const gameOverText = this.add.text(this.cameras.main.centerX, 150, 'GIOCO FINITO', {
            fontSize: '64px',
            fontFamily: 'Courier New, monospace',
            fill: '#ff4444',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5)

        // Add dramatic effect
        this.tweens.add({
            targets: gameOverText,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })

        // Get game data
        const gameData = window.gameState.getGameData()
        
        // Track game completion with comprehensive analytics
        track('game_completed', {
            finalScore: gameData.score,
            level: gameData.level,
            dinosaursKilled: gameData.dinosaursKilled,
            maxCombo: gameData.maxCombo,
            livesLost: 3 - gameData.lives,
            isNewHighScore: gameData.score >= gameData.highScore,
            previousHighScore: gameData.highScore,
            deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            sessionDuration: gameData.sessionDuration || 0
        })
        
        // Score display
        const finalScoreText = this.add.text(this.cameras.main.centerX, 250, `PUNTEGGIO FINALE: ${gameData.score}`, {
            fontSize: '32px',
            fontFamily: 'Courier New, monospace',
            fill: '#7fb069',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)

        // High score check
        let highScoreText
        if (gameData.score >= gameData.highScore) {
            highScoreText = this.add.text(this.cameras.main.centerX, 290, 'NUOVO RECORD!', {
                fontSize: '24px',
                fontFamily: 'Courier New, monospace',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5)

            // Celebration effect
            this.tweens.add({
                targets: highScoreText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Power2'
            })

            // Particle burst
            this.createCelebrationParticles()
        } else {
            highScoreText = this.add.text(this.cameras.main.centerX, 290, `RECORD: ${gameData.highScore}`, {
                fontSize: '24px',
                fontFamily: 'Courier New, monospace',
                fill: '#a3c585',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5)
        }

        // Statistics
        const statsY = 350
        this.add.text(this.cameras.main.centerX, statsY, 'RAPPORTO MISSIONE:', {
            fontSize: '20px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)

        const statsText = [
            `Livello Raggiunto: ${gameData.level}`,
            `Dinosauri Bloccati: ${gameData.dinosaursKilled}`,
            `Miglior Combo: x${gameData.maxCombo}`,
            `Vite Perse: ${3 - gameData.lives}`
        ]

        statsText.forEach((text, index) => {
            this.add.text(this.cameras.main.centerX, statsY + 40 + (index * 25), text, {
                fontSize: '16px',
                fontFamily: 'Courier New, monospace',
                fill: '#cccccc',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5)
        })

        // Performance rating
        this.displayPerformanceRating(gameData)

        // Buttons
        this.createButtons()

        // Easter egg message
        this.createEasterEggMessage(gameData)

        console.log('Game Over Scene Created')
    }

    createStarfield() {
        // Create fewer, dimmer stars for somber mood
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width)
            const y = Phaser.Math.Between(0, this.cameras.main.height)
            const star = this.add.circle(x, y, 1, 0x555555, 0.3)
            
            this.tweens.add({
                targets: star,
                alpha: 0.1,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1
            })
        }
    }

    createDestroyCityBackground() {
        // More destroyed looking city
        const numBuildings = 10
        const buildingWidth = this.cameras.main.width / numBuildings

        for (let i = 0; i < numBuildings; i++) {
            const x = i * buildingWidth
            const baseHeight = Phaser.Math.Between(80, 200)
            const damageHeight = Phaser.Math.Between(20, baseHeight * 0.4)
            const finalHeight = baseHeight - damageHeight
            const y = this.cameras.main.height - finalHeight

            // Damaged building
            const building = this.add.rectangle(x + buildingWidth/2, y + finalHeight/2, buildingWidth - 2, finalHeight, 0x111111, 0.9)

            // Damage effects
            for (let d = 0; d < 3; d++) {
                if (Math.random() < 0.7) {
                    const damageX = x + Phaser.Math.Between(5, buildingWidth - 5)
                    const damageY = y + Phaser.Math.Between(5, finalHeight - 5)
                    const damageSize = Phaser.Math.Between(8, 20)
                    this.add.circle(damageX, damageY, damageSize, 0x000000, 0.8)
                }
            }

            // Fires/glows
            if (Math.random() < 0.3) {
                const fireX = x + Phaser.Math.Between(10, buildingWidth - 10)
                const fireY = y + Phaser.Math.Between(10, finalHeight - 10)
                const fire = this.add.circle(fireX, fireY, 6, 0xff4400, 0.6)
                
                this.tweens.add({
                    targets: fire,
                    alpha: 0.3,
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                })
            }
        }

        // Smoke effects
        this.createSmokeEffects()
    }

    createSmokeEffects() {
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, this.cameras.main.width - 100)
            const y = this.cameras.main.height - 50
            
            const smoke = this.add.circle(x, y, Phaser.Math.Between(8, 15), 0x444444, 0.3)
            
            this.tweens.add({
                targets: smoke,
                y: y - Phaser.Math.Between(100, 200),
                x: x + Phaser.Math.Between(-50, 50),
                alpha: 0,
                scale: 2,
                duration: Phaser.Math.Between(3000, 5000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            })
        }
    }

    displayPerformanceRating(gameData) {
        let rating = 'RECLUTA'
        let ratingColor = '#666666'
        
        if (gameData.score >= 5000) {
            rating = 'LEGGENDA'
            ratingColor = '#gold'
        } else if (gameData.score >= 3000) {
            rating = 'VETERANO'
            ratingColor = '#silver'
        } else if (gameData.score >= 1500) {
            rating = 'SOLDATO'
            ratingColor = '#bronze'
        } else if (gameData.score >= 500) {
            rating = 'CADETTO'
            ratingColor = '#7fb069'
        }

        this.add.text(this.cameras.main.centerX, 520, `GRADO: ${rating}`, {
            fontSize: '28px',
            fontFamily: 'Courier New, monospace',
            fill: ratingColor,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5)
    }

    createButtons() {
        // Play Again Button
        const playAgainButton = this.add.rectangle(this.cameras.main.centerX - 120, 600, 200, 50, 0x7fb069)
            .setInteractive()
            .on('pointerdown', () => this.playAgain())
            .on('pointerover', () => playAgainButton.setFillStyle(0xa3c585))
            .on('pointerout', () => playAgainButton.setFillStyle(0x7fb069))

        // Play Again Button Border
        const playAgainBorder = this.add.rectangle(this.cameras.main.centerX - 120, 600, 200, 50)
            .setStrokeStyle(3, 0x2d4a36)
            .setFillStyle()

        const playAgainText = this.add.text(this.cameras.main.centerX - 120, 600, 'GIOCA ANCORA', {
            fontSize: '18px',
            fontFamily: 'Courier New, monospace',
            fill: '#000000'
        }).setOrigin(0.5)

        // Main Menu Button
        const menuButton = this.add.rectangle(this.cameras.main.centerX + 120, 600, 200, 50, 0x666666)
            .setInteractive()
            .on('pointerdown', () => this.goToMenu())
            .on('pointerover', () => menuButton.setFillStyle(0x888888))
            .on('pointerout', () => menuButton.setFillStyle(0x666666))

        // Menu Button Border
        const menuBorder = this.add.rectangle(this.cameras.main.centerX + 120, 600, 200, 50)
            .setStrokeStyle(3, 0x333333)
            .setFillStyle()

        const menuText = this.add.text(this.cameras.main.centerX + 120, 600, 'MENU PRINCIPALE', {
            fontSize: '18px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffffff'
        }).setOrigin(0.5)

        // Keyboard shortcuts
        this.add.text(this.cameras.main.centerX, 680, 'PREMI SPAZIO PER GIOCARE ANCORA • ESC PER MENU', {
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            fill: '#888888'
        }).setOrigin(0.5)

        // Setup keyboard input
        this.input.keyboard.on('keydown-SPACE', () => this.playAgain())
        this.input.keyboard.on('keydown-ESC', () => this.goToMenu())
        this.input.keyboard.on('keydown-ENTER', () => this.playAgain())
    }

    createEasterEggMessage(gameData) {
        let message = ''
        
        if (gameData.dinosaursKilled === 0) {
            message = '"Esploratore Pacifico"'
        } else if (gameData.combo === 0 && gameData.dinosaursKilled > 0) {
            message = '"Tiratore Calmo"'
        } else if (gameData.maxCombo >= 10) {
            message = '"Maestro Combo"'
        } else if (gameData.level >= 10) {
            message = '"Sopravvissuto"'
        } else if (gameData.score === gameData.highScore && gameData.score > 100) {
            message = '"Nuovo Campione"'
        }

        if (message) {
            this.add.text(this.cameras.main.centerX, 550, message, {
                fontSize: '16px',
                fontFamily: 'Courier New, monospace',
                fill: '#ffaa00',
                stroke: '#000000',
                strokeThickness: 1,
                style: 'italic'
            }).setOrigin(0.5)
        }
    }

    createCelebrationParticles() {
        // Create celebration particles for new high score
        for (let i = 0; i < 20; i++) {
            const x = this.cameras.main.centerX + Phaser.Math.Between(-200, 200)
            const y = Phaser.Math.Between(200, 400)
            
            const colors = [0xffff00, 0xffa500, 0xff6600, 0xff0066]
            const particle = this.add.circle(x, y, Phaser.Math.Between(3, 8), Phaser.Utils.Array.GetRandom(colors), 0.8)
            
            this.tweens.add({
                targets: particle,
                y: y + Phaser.Math.Between(50, 150),
                x: x + Phaser.Math.Between(-100, 100),
                alpha: 0,
                scale: 0.3,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Power2',
                onComplete: () => particle.destroy()
            })
        }

        // Confetti effect
        this.createConfetti()
    }

    createConfetti() {
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width)
            const y = -20
            
            const colors = [0xff1744, 0xe91e63, 0x9c27b0, 0x673ab7, 0x3f51b5]
            const confetti = this.add.rectangle(x, y, 8, 3, Phaser.Utils.Array.GetRandom(colors), 0.9)
            
            this.tweens.add({
                targets: confetti,
                y: this.cameras.main.height + 50,
                x: x + Phaser.Math.Between(-100, 100),
                rotation: Math.PI * 4,
                duration: Phaser.Math.Between(3000, 6000),
                ease: 'Power1',
                onComplete: () => confetti.destroy()
            })
        }
    }

    playAgain() {
        // Track play again action
        track('play_again_clicked', {
            deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        })
        
        // Reset game state
        window.gameState.reset()
        window.gameState.gameRunning = true
        
        // Start new game
        this.scene.start('GamePlayScene')
    }

    goToMenu() {
        // Track return to menu action
        track('return_to_menu', {
            deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        })
        
        // Go to main menu
        this.scene.start('MainMenuScene')
    }
}
