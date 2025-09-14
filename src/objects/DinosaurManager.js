export default class DinosaurManager {
    constructor(scene, spriteLoader) {
        this.scene = scene
        this.spriteLoader = spriteLoader
        this.dinosaurs = scene.add.group()
        this.pool = []
        this.activeCount = 0
        this.dinoTypes = ['Alanqa', 'Baryonyx', 'Carnotaurus', 'Oviraptor', 'Styracosaurus']
        
        // Pre-populate object pool
        this.initializePool()
    }

    initializePool() {
        // Create a pool of dinosaur objects for performance
        for (let i = 0; i < 15; i++) {
            const dino = this.createDinosaurObject()
            dino.setActive(false)
            dino.setVisible(false)
            this.pool.push(dino)
        }
    }

    createDinosaurObject() {
        // Create sprite-based dinosaur
        const dino = this.scene.add.sprite(0, 0, '')
        
        // Add properties
        dino.dinoType = null
        dino.speed = 0
        dino.direction = 1
        dino.hitbox = null
        dino.isHurt = false
        dino.currentAnimation = null
        
        // Set up scale and origin
        dino.setScale(0.4) // Adjust scale to fit game
        dino.setOrigin(0.5, 0.9) // Bottom center origin - adjusted for proper positioning
        
        this.dinosaurs.add(dino)
        return dino
    }

    spawnDinosaur() {
        let dino = this.getDinoFromPool()
        
        if (!dino) {
            dino = this.createDinosaurObject()
        }

        // Random dinosaur type
        const dinoType = Phaser.Utils.Array.GetRandom(this.dinoTypes)
        dino.dinoType = dinoType
        
        // Random spawn position (edges of screen)
        const spawnSide = Math.random() < 0.5 ? 'left' : 'right'
        let startX, endX, y
        
        if (spawnSide === 'left') {
            startX = -100
            endX = this.scene.cameras.main.width + 100
            dino.direction = 1
        } else {
            startX = this.scene.cameras.main.width + 100
            endX = -100
            dino.direction = -1
        }
        
        // Different spawn heights for different dinosaur types
        if (dinoType === 'Alanqa') {
            // Flying pterosaur spawns higher in the sky
            y = Phaser.Math.Between(100, 250)
        } else {
            // Ground-based dinosaurs spawn much closer to the bottom (street level)
            y = Phaser.Math.Between(this.scene.cameras.main.height - 120, this.scene.cameras.main.height - 60)
        }
        
        // Set position and state
        dino.setPosition(startX, y)
        dino.setActive(true)
        dino.setVisible(true)
        dino.isHurt = false
        
        // Set movement speed based on type and level - intense challenge
        const baseSpeed = this.getSpeedForType(dinoType)
        // Aggressive speed increase per level for intense gameplay
        dino.speed = baseSpeed + (window.gameState.level * 12) // Much higher speed scaling
        
        // Set up sprite and animation
        this.setupDinosaurSprite(dino, dinoType)
        
        // Set direction - flip sprites so they face the direction they're moving
        dino.setFlipX(dino.direction === 1) // Flip for left-to-right movement
        
        // Start appropriate animation based on dinosaur type
        let animType = 'Walk'
        if (dinoType === 'Alanqa') {
            animType = 'Fly'  // Alanqa is a flying pterosaur
        }
        
        const anim = this.spriteLoader.getAnimationKey(dinoType, animType)
        if (this.scene.anims.exists(anim)) {
            dino.play(anim)
            dino.currentAnimation = animType
        }
        
        // Animate movement
        const duration = Math.abs(endX - startX) / dino.speed * 1000
        
        this.scene.tweens.add({
            targets: dino,
            x: endX,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.escapedDinosaur(dino)
            }
        })
        
        // Add entrance roar sound
        if (window.gameState.soundEnabled) {
            // Would play spawn sound here
        }
        
        this.activeCount++
    }

    setupDinosaurSprite(dino, type) {
        // Set initial sprite texture
        const initialFrame = this.spriteLoader.getSpriteKey(type, 'Walk', 0)
        if (this.scene.textures.exists(initialFrame)) {
            dino.setTexture(initialFrame)
        }
        
        // Create hitbox based on sprite bounds
        const bounds = dino.getBounds()
        dino.hitbox = new Phaser.Geom.Rectangle(
            -bounds.width/2, 
            -bounds.height/2, 
            bounds.width, 
            bounds.height
        )
    }

    getSpeedForType(type) {
        // High base speeds for intense challenging gameplay
        const speeds = {
            'Alanqa': 70,      // Flying pterosaur - very fast aerial threat
            'Baryonyx': 45,    // Fast aquatic predator
            'Carnotaurus': 55, // Very fast running predator
            'Oviraptor': 60,   // Extremely agile and quick
            'Styracosaurus': 40 // Heavy but surprisingly fast
        }
        return speeds[type] || 45
    }

    getDinoFromPool() {
        for (let i = 0; i < this.pool.length; i++) {
            if (!this.pool[i].active) {
                return this.pool[i]
            }
        }
        return null
    }

    checkCollision(x, y) {
        for (let dino of this.dinosaurs.children.entries) {
            if (dino.active && dino.visible && !dino.isHurt) {
                const bounds = dino.getBounds()
                if (Phaser.Geom.Rectangle.Contains(bounds, x, y)) {
                    return dino
                }
            }
        }
        return null
    }

    destroyDinosaur(dino) {
        if (!dino.active) return

        // Play hurt animation first
        dino.isHurt = true
        const hurtAnim = this.spriteLoader.getAnimationKey(dino.dinoType, 'Hurt')
        
        if (this.scene.anims.exists(hurtAnim)) {
            dino.play(hurtAnim)
            
            // Wait for hurt animation to complete, then destroy
            dino.on('animationcomplete', () => {
                this.returnDinosaurToPool(dino)
            }, this)
        } else {
            // No hurt animation, destroy immediately
            this.returnDinosaurToPool(dino)
        }
        
        // Stop movement tween
        this.scene.tweens.killTweensOf(dino)
    }

    returnDinosaurToPool(dino) {
        // Return to pool
        dino.setActive(false)
        dino.setVisible(false)
        dino.setPosition(0, 0)
        dino.setScale(0.4)
        dino.setFlipX(false)
        dino.isHurt = false
        dino.currentAnimation = null
        
        // Remove any event listeners
        dino.removeAllListeners()
        
        this.activeCount--
    }

    escapedDinosaur(dino) {
        if (dino.active) {
            // Dinosaur escaped - lose life
            window.gameState.loseLife()
            this.returnDinosaurToPool(dino)
        }
    }

    checkEscaped() {
        // This is handled by the tween completion callback
        // But we could add additional checks here if needed
    }

    getActiveCount() {
        return this.activeCount
    }

    clearAll() {
        for (let dino of this.dinosaurs.children.entries) {
            if (dino.active) {
                this.scene.tweens.killTweensOf(dino)
                this.returnDinosaurToPool(dino)
            }
        }
        this.activeCount = 0
    }

    update(time, delta) {
        // Update logic for dinosaurs if needed
        // Most animation is handled by Phaser animations
    }
}
