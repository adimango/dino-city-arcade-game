import DinosaurManager from '../objects/DinosaurManager.js'
import ParticleManager from '../objects/ParticleManager.js'
import AudioManager from '../utils/AudioManager.js'
import { SpriteLoader } from '../utils/SpriteLoader.js'

export default class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePlayScene' })
        this.dinosaurs = null
        this.particles = null
        this.audio = null
        this.spriteLoader = null
        this.ui = {}
        this.spawnTimer = null
        this.cityBackground = null
        this.crosshair = null
        this.screenShake = false
    }

    preload() {
        // Initialize sprite loader and load all dinosaur sprites
        this.spriteLoader = new SpriteLoader(this)
        this.spriteLoader.loadDinosaurSprites()
    }

    create() {
        // Create city background
        this.createCityBackground()
        
        // Create sprite animations after loading
        this.spriteLoader.createAnimations()
        
        // Initialize managers
        this.dinosaurs = new DinosaurManager(this, this.spriteLoader)
        this.particles = new ParticleManager(this)
        this.audio = new AudioManager(this)
        
        // Create UI
        this.createUI()
        
        // Create crosshair
        this.createCrosshair()
        
        // Setup input
        this.setupInput()
        
        // Start spawn timer
        this.startSpawnTimer()
        
        // Add atmospheric effects
        this.createAtmosphere()
        
        console.log('GamePlay Scene Started')
    }

    createCityBackground() {
        // Create jungle city background
        this.cityBackground = this.add.group()
        
        // Jungle sky gradient effect - darker green like the reference image
        const sky = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height/2, 0x2d4a36, 0.8)
        sky.setOrigin(0, 0)
        
        // Add jungle atmosphere layer
        const atmosphere = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x1a3a26, 0.2)
        atmosphere.setOrigin(0, 0)
        
        // Buildings
        const numBuildings = 12
        const buildingWidth = this.cameras.main.width / numBuildings
        
        for (let i = 0; i < numBuildings; i++) {
            const x = i * buildingWidth
            const height = Phaser.Math.Between(200, 400)
            const y = this.cameras.main.height - height
            
            // Building base
            const building = this.add.rectangle(x + buildingWidth/2, y + height/2, buildingWidth - 5, height, 0x1a1a1a, 0.9)
            this.cityBackground.add(building)
            
            // Building details
            this.addBuildingDetails(x, y, buildingWidth, height)
            
            // Overgrown vegetation
            if (Math.random() < 0.4) {
                const vegetation = this.add.rectangle(
                    x + Phaser.Math.Between(10, buildingWidth - 10), 
                    y + height - 10, 
                    Phaser.Math.Between(15, 30), 
                    Phaser.Math.Between(20, 40), 
                    0x2d4a36, 
                    0.7
                )
                this.cityBackground.add(vegetation)
            }
        }
    }

    addBuildingDetails(x, y, width, height) {
        // Windows
        const rows = Math.floor(height / 50)
        const cols = 3
        
        for (let row = 1; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (Math.random() < 0.4) {
                    const windowX = x + 15 + col * (width / 4)
                    const windowY = y + row * 50
                    const isLit = Math.random() < 0.3
                    const windowColor = isLit ? 0xffff99 : 0x333333
                    
                    const window = this.add.rectangle(windowX, windowY, 12, 20, windowColor, isLit ? 0.8 : 0.5)
                    this.cityBackground.add(window)
                }
            }
        }
        
        // Damage effects
        if (Math.random() < 0.3) {
            const damageX = x + Phaser.Math.Between(10, width - 10)
            const damageY = y + Phaser.Math.Between(10, height - 50)
            const damage = this.add.circle(damageX, damageY, Phaser.Math.Between(5, 15), 0x0d1912, 0.8)
            this.cityBackground.add(damage)
        }
    }

    createUI() {
        // Score
        this.ui.scoreText = this.add.text(20, 20, `PUNTEGGIO: ${window.gameState.score}`, {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            fill: '#7fb069',
            stroke: '#000000',
            strokeThickness: 2
        })

        // Lives
        this.ui.livesText = this.add.text(20, 50, `VITE: ${window.gameState.lives}`, {
            fontSize: '20px',
            fontFamily: 'Courier New, monospace',
            fill: '#ff6b6b',
            stroke: '#000000',
            strokeThickness: 2
        })

        // Level
        this.ui.levelText = this.add.text(20, 80, `LIVELLO: ${window.gameState.level}`, {
            fontSize: '20px',
            fontFamily: 'Courier New, monospace',
            fill: '#4ecdc4',
            stroke: '#000000',
            strokeThickness: 2
        })

        // Combo
        this.ui.comboText = this.add.text(this.cameras.main.width - 20, 20, '', {
            fontSize: '18px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffa726',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0)

        // Dinosaur counter
        this.ui.dinoCountText = this.add.text(this.cameras.main.width - 20, 50, '', {
            fontSize: '16px',
            fontFamily: 'Courier New, monospace',
            fill: '#e74c3c',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0)

        // Warning text for when too many dinos
        this.ui.warningText = this.add.text(this.cameras.main.centerX, 150, '', {
            fontSize: '32px',
            fontFamily: 'Courier New, monospace',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setVisible(false)
    }

    createCrosshair() {
        // Custom crosshair
        this.crosshair = this.add.group()
        
        // Crosshair lines
        const line1 = this.add.line(0, 0, -15, 0, 15, 0, 0x7fb069, 0.8).setLineWidth(2)
        const line2 = this.add.line(0, 0, 0, -15, 0, 15, 0x7fb069, 0.8).setLineWidth(2)
        const circle = this.add.circle(0, 0, 20, 0x7fb069, 0).setStrokeStyle(2, 0x7fb069, 0.6)
        
        this.crosshair.addMultiple([line1, line2, circle])
        this.crosshair.setVisible(false)
    }

    setupInput() {
        // Detect if device is mobile/touch
        const isMobile = this.sys.game.device.input.touch
        
        // Mouse/touch input
        this.input.on('pointermove', (pointer) => {
            // Only show crosshair on desktop (non-touch devices)
            if (!isMobile) {
                this.crosshair.setVisible(true)
                Phaser.Actions.SetXY(this.crosshair.children.entries, pointer.x, pointer.y)
            }
        })

        this.input.on('pointerdown', (pointer) => {
            this.handleClick(pointer.x, pointer.y)
        })

        // Hide crosshair when mouse leaves game area (desktop only)
        this.input.on('pointerout', () => {
            if (!isMobile) {
                this.crosshair.setVisible(false)
            }
        })

        // Keep crosshair hidden on mobile devices
        if (isMobile) {
            this.crosshair.setVisible(false)
        }

        // Keyboard input for pause/menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.pauseGame()
        })

        this.input.keyboard.on('keydown-P', () => {
            this.pauseGame()
        })
    }

    handleClick(x, y) {
        // Check if click hit a dinosaur
        const hitDinosaur = this.dinosaurs.checkCollision(x, y)
        
        if (hitDinosaur) {
            // Dinosaur blocked (kid-friendly term)
            this.dinosaurs.destroyDinosaur(hitDinosaur)
            this.particles.createExplosion(x, y)
            this.audio.playHitSound()
            
            // Screen shake
            this.cameras.main.shake(100, 0.01)
            
            // Score
            const points = this.calculatePoints(hitDinosaur.dinoType)
            window.gameState.addScore(points)
            
            // Show score popup
            this.showScorePopup(x, y, points)
            
        } else {
            // Missed shot
            this.audio.playMissSound()
            window.gameState.resetCombo()
            
            // Small screen shake for missed shots
            this.cameras.main.shake(50, 0.005)
        }
        
        // Muzzle flash effect
        this.particles.createMuzzleFlash(x, y)
        
        this.updateUI()
    }

    checkLevelUpFeedback() {
        if (window.gameState.showLevelUpFeedback) {
            window.gameState.showLevelUpFeedback = false
            this.showLevelUpAnimation()
        }
    }

    showLevelUpAnimation() {
        // Create celebratory "LEVEL UP!" text for children
        const levelUpText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 
            `LIVELLO ${window.gameState.level}!`, {
            fontSize: '48px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 0, stroke: false, fill: true }
        }).setOrigin(0.5)

        const subText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 10, 
            'Bravo!', {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            fill: '#7fb069',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)

        // Add celebration particles
        this.particles.createCelebration(this.cameras.main.centerX, this.cameras.main.centerY - 50)

        // Animate the level up text
        this.tweens.add({
            targets: [levelUpText, subText],
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 1,
            ease: 'Bounce.easeOut'
        })

        // Fade out after showing
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: [levelUpText, subText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    levelUpText.destroy()
                    subText.destroy()
                }
            })
        })
    }

    calculatePoints(dinoType) {
        const basePoints = {
            'Alanqa': 150,      // Flying pterosaur - high points for difficulty
            'Baryonyx': 100,    // Fast aquatic predator  
            'Carnotaurus': 125, // Very fast running predator
            'Oviraptor': 75,    // Smaller, agile dinosaur
            'Styracosaurus': 100 // Heavy armored dinosaur
        }
        
        const levelMultiplier = window.gameState.level * 0.5 + 1
        const points = basePoints[dinoType] || 50 // Default fallback points
        return Math.floor(points * levelMultiplier)
    }

    showScorePopup(x, y, points) {
        const comboBonus = window.gameState.combo > 1 ? window.gameState.combo * 5 : 0
        const totalPoints = points + comboBonus
        
        let text = `+${points}`
        if (comboBonus > 0) {
            text += `\n+${comboBonus} COMBO!`
        }
        
        const popup = this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5)
        
        this.tweens.add({
            targets: popup,
            y: y - 100,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => popup.destroy()
        })
    }

    startSpawnTimer() {
        this.spawnTimer = this.time.addEvent({
            delay: window.gameState.spawnRate,
            callback: () => {
                if (this.dinosaurs.getActiveCount() < window.gameState.maxDinosaurs) {
                    this.dinosaurs.spawnDinosaur()
                }
            },
            loop: true
        })
    }

    createAtmosphere() {
        // Dust particles
        for (let i = 0; i < 10; i++) {
            const dust = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(1, 3),
                0x8b7355,
                0.2
            )
            
            this.tweens.add({
                targets: dust,
                x: dust.x + Phaser.Math.Between(-200, 200),
                y: dust.y + Phaser.Math.Between(-100, 100),
                duration: Phaser.Math.Between(10000, 20000),
                repeat: -1,
                yoyo: true
            })
        }
    }

    updateUI() {
        this.ui.scoreText.setText(`PUNTEGGIO: ${window.gameState.score}`)
        this.ui.livesText.setText(`VITE: ${window.gameState.lives}`)
        this.ui.levelText.setText(`LIVELLO: ${window.gameState.level}`)
        
        // Combo display
        if (window.gameState.combo > 1) {
            this.ui.comboText.setText(`COMBO x${window.gameState.combo}`)
            this.ui.comboText.setVisible(true)
        } else {
            this.ui.comboText.setVisible(false)
        }
        
        // Dinosaur counter
        const activeCount = this.dinosaurs.getActiveCount()
        this.ui.dinoCountText.setText(`DINO: ${activeCount}/${window.gameState.maxDinosaurs}`)
        
        // Warning when too many dinosaurs
        if (activeCount >= window.gameState.maxDinosaurs - 1) {
            this.ui.warningText.setText('ATTENZIONE: TROPPI DINO!')
            this.ui.warningText.setVisible(true)
            
            this.tweens.add({
                targets: this.ui.warningText,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            })
        } else {
            this.ui.warningText.setVisible(false)
        }
    }

    checkGameOver() {
        const activeCount = this.dinosaurs.getActiveCount()
        
        if (activeCount >= window.gameState.maxDinosaurs || window.gameState.lives <= 0) {
            this.gameOver()
        }
    }

    gameOver() {
        window.gameState.gameRunning = false
        
        // Stop spawn timer
        if (this.spawnTimer) {
            this.spawnTimer.remove()
        }
        
        // Clear all dinosaurs
        this.dinosaurs.clearAll()
        
        // Transition to game over scene
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene')
        })
    }

    pauseGame() {
        if (window.gameState.gameRunning) {
            this.scene.pause()
            // Could add pause menu here
        }
    }

    update(time, delta) {
        if (!window.gameState.gameRunning) return
        
        // Update managers
        this.dinosaurs.update(time, delta)
        this.particles.update(time, delta)
        
        // Check for escaped dinosaurs
        this.dinosaurs.checkEscaped()
        
        // Update spawn rate based on level
        if (this.spawnTimer) {
            this.spawnTimer.delay = window.gameState.spawnRate
        }
        
        // Check game over conditions
        this.checkGameOver()
        
        // Check for level up feedback
        this.checkLevelUpFeedback()
        
        // Update UI
        this.updateUI()
    }
}
