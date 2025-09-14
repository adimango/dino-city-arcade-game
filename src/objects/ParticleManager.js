export default class ParticleManager {
    constructor(scene) {
        this.scene = scene
        this.particles = []
        this.explosionPool = []
        this.muzzleFlashPool = []
        
        // Initialize particle pools
        this.initializePools()
    }

    initializePools() {
        // Pre-create particle objects for performance
        for (let i = 0; i < 20; i++) {
            this.explosionPool.push(this.createExplosionParticles())
            this.muzzleFlashPool.push(this.createMuzzleFlashParticles())
        }
    }

    createExplosionParticles() {
        const group = this.scene.add.group()
        
        // Create multiple particles for explosion
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.circle(0, 0, Phaser.Math.Between(3, 8), 0xff4444, 0.8)
            particle.setActive(false)
            particle.setVisible(false)
            group.add(particle)
        }
        
        return group
    }

    createMuzzleFlashParticles() {
        const group = this.scene.add.group()
        
        // Create muzzle flash effect
        for (let i = 0; i < 4; i++) {
            const particle = this.scene.add.circle(0, 0, Phaser.Math.Between(2, 5), 0xffff44, 0.9)
            particle.setActive(false)
            particle.setVisible(false)
            group.add(particle)
        }
        
        return group
    }

    createExplosion(x, y) {
        let explosionGroup = this.getFromPool(this.explosionPool)
        
        if (!explosionGroup) {
            explosionGroup = this.createExplosionParticles()
        }

        // Position all particles at explosion point
        explosionGroup.children.entries.forEach(particle => {
            particle.setPosition(x, y)
            particle.setActive(true)
            particle.setVisible(true)
            particle.setAlpha(1)
            particle.setScale(1)
            
            // Random color for explosion
            const colors = [0xff4444, 0xff8844, 0xffff44, 0xff6644]
            particle.setFillStyle(Phaser.Utils.Array.GetRandom(colors))
        })

        // Animate explosion particles
        this.scene.tweens.add({
            targets: explosionGroup.children.entries,
            x: (target, targetKey, value, targetIndex) => {
                return x + Phaser.Math.Between(-50, 50)
            },
            y: (target, targetKey, value, targetIndex) => {
                return y + Phaser.Math.Between(-50, 50)
            },
            alpha: 0,
            scale: 0.3,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.returnToPool(explosionGroup, this.explosionPool)
            }
        })

        // Add screen particles
        this.createScreenDebris(x, y)
        
        // Add blood splatter effect
        this.createBloodSplatter(x, y)
    }

    createScreenDebris(x, y) {
        // Create small debris particles
        for (let i = 0; i < 6; i++) {
            const debris = this.scene.add.rectangle(
                x + Phaser.Math.Between(-10, 10),
                y + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(2, 6),
                Phaser.Math.Between(2, 6),
                0x8b4513,
                0.7
            )

            this.scene.tweens.add({
                targets: debris,
                x: x + Phaser.Math.Between(-80, 80),
                y: y + Phaser.Math.Between(20, 100),
                rotation: Phaser.Math.Between(0, Math.PI * 2),
                alpha: 0,
                scale: 0.2,
                duration: 800,
                ease: 'Power2',
                onComplete: () => debris.destroy()
            })
        }
    }

    createBloodSplatter(x, y) {
        // Create blood splatter particles
        for (let i = 0; i < 5; i++) {
            const blood = this.scene.add.circle(
                x + Phaser.Math.Between(-15, 15),
                y + Phaser.Math.Between(-15, 15),
                Phaser.Math.Between(1, 4),
                0x8b0000,
                0.8
            )

            this.scene.tweens.add({
                targets: blood,
                x: x + Phaser.Math.Between(-60, 60),
                y: y + Phaser.Math.Between(-30, 60),
                alpha: 0.3,
                scale: 0.5,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    // Leave some blood stains
                    if (Math.random() < 0.3) {
                        blood.setAlpha(0.2)
                        blood.setScale(0.3)
                        this.scene.time.delayedCall(10000, () => {
                            if (blood && blood.scene) {
                                blood.destroy()
                            }
                        })
                    } else {
                        blood.destroy()
                    }
                }
            })
        }
    }

    createMuzzleFlash(x, y) {
        let muzzleGroup = this.getFromPool(this.muzzleFlashPool)
        
        if (!muzzleGroup) {
            muzzleGroup = this.createMuzzleFlashParticles()
        }

        // Position muzzle flash particles
        muzzleGroup.children.entries.forEach((particle, index) => {
            const angle = (index / 4) * Math.PI * 2
            const distance = Phaser.Math.Between(5, 15)
            
            particle.setPosition(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance
            )
            particle.setActive(true)
            particle.setVisible(true)
            particle.setAlpha(0.9)
            particle.setScale(1)
            
            // Random bright colors
            const colors = [0xffff44, 0xffffff, 0xffaa00]
            particle.setFillStyle(Phaser.Utils.Array.GetRandom(colors))
        })

        // Quick flash animation
        this.scene.tweens.add({
            targets: muzzleGroup.children.entries,
            alpha: 0,
            scale: 2,
            duration: 150,
            ease: 'Power2',
            onComplete: () => {
                this.returnToPool(muzzleGroup, this.muzzleFlashPool)
            }
        })
    }

    createHitMarker(x, y, points) {
        // Create hit confirmation marker
        const hitMarker = this.scene.add.text(x, y, `${points}`, {
            fontSize: '18px',
            fontFamily: 'Courier New, monospace',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)

        // Animate hit marker
        this.scene.tweens.add({
            targets: hitMarker,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 800,
            ease: 'Power2',
            onComplete: () => hitMarker.destroy()
        })
    }

    createComboEffect(x, y, comboCount) {
        // Create combo visual effect
        const comboText = this.scene.add.text(x, y, `COMBO x${comboCount}!`, {
            fontSize: '24px',
            fontFamily: 'Courier New, monospace',
            fill: '#ff6600',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5)

        // Pulsating animation
        this.scene.tweens.add({
            targets: comboText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            repeat: 1,
            ease: 'Power2'
        })

        // Fade out
        this.scene.tweens.add({
            targets: comboText,
            alpha: 0,
            y: y - 80,
            duration: 1500,
            delay: 500,
            ease: 'Power2',
            onComplete: () => comboText.destroy()
        })

        // Add sparkle effects
        this.createSparkles(x, y, comboCount)
    }

    createSparkles(x, y, count) {
        for (let i = 0; i < Math.min(count, 8); i++) {
            const sparkle = this.scene.add.star(
                x + Phaser.Math.Between(-30, 30),
                y + Phaser.Math.Between(-30, 30),
                4, 2, 8, 0xffff00, 0.8
            )

            this.scene.tweens.add({
                targets: sparkle,
                x: sparkle.x + Phaser.Math.Between(-50, 50),
                y: sparkle.y + Phaser.Math.Between(-50, 50),
                rotation: Math.PI * 2,
                alpha: 0,
                scale: 0.3,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => sparkle.destroy()
            })
        }
    }

    createCelebration(x, y) {
        // Create celebration particle burst for level up
        for (let i = 0; i < 15; i++) {
            const colors = [0xffff00, 0xff6600, 0x00ff00, 0xff00ff, 0x00ffff]
            const particle = this.scene.add.circle(
                x + Phaser.Math.Between(-10, 10),
                y + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(3, 8),
                Phaser.Utils.Array.GetRandom(colors),
                0.8
            )

            const angle = (i / 15) * Math.PI * 2
            const distance = Phaser.Math.Between(80, 150)

            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0.3,
                rotation: Math.PI * 2,
                duration: 1200,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            })
        }

        // Add sparkly stars
        for (let i = 0; i < 8; i++) {
            const star = this.scene.add.star(
                x + Phaser.Math.Between(-20, 20),
                y + Phaser.Math.Between(-20, 20),
                4, 3, 8, 0xffff00, 0.9
            )

            this.scene.tweens.add({
                targets: star,
                x: star.x + Phaser.Math.Between(-100, 100),
                y: star.y + Phaser.Math.Between(-80, 80),
                rotation: Math.PI * 4,
                alpha: 0,
                scale: 0.2,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => star.destroy()
            })
        }
    }

    createLevelUpEffect() {
        // Screen-wide level up effect
        const centerX = this.scene.cameras.main.centerX
        const centerY = this.scene.cameras.main.centerY

        // Level up text
        const levelText = this.scene.add.text(centerX, centerY, 'LEVEL UP!', {
            fontSize: '48px',
            fontFamily: 'Courier New, monospace',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5)

        // Scale animation
        levelText.setScale(0)
        this.scene.tweens.add({
            targets: levelText,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        })

        // Fade out
        this.scene.tweens.add({
            targets: levelText,
            alpha: 0,
            duration: 1000,
            delay: 1500,
            onComplete: () => levelText.destroy()
        })

        // Particle burst
        for (let i = 0; i < 20; i++) {
            const particle = this.scene.add.circle(
                centerX,
                centerY,
                Phaser.Math.Between(3, 8),
                0x00ff00,
                0.7
            )

            const angle = (i / 20) * Math.PI * 2
            const distance = Phaser.Math.Between(100, 200)

            this.scene.tweens.add({
                targets: particle,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0.3,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            })
        }
    }

    createWarningEffect() {
        // Red warning flash effect
        const warning = this.scene.add.rectangle(
            0, 0,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xff0000,
            0.3
        ).setOrigin(0, 0)

        this.scene.tweens.add({
            targets: warning,
            alpha: 0,
            duration: 300,
            repeat: 2,
            yoyo: true,
            onComplete: () => warning.destroy()
        })
    }

    getFromPool(pool) {
        for (let group of pool) {
            const allInactive = group.children.entries.every(child => !child.active)
            if (allInactive) {
                return group
            }
        }
        return null
    }

    returnToPool(group, pool) {
        group.children.entries.forEach(particle => {
            particle.setActive(false)
            particle.setVisible(false)
            particle.setPosition(0, 0)
            particle.setScale(1)
            particle.setAlpha(1)
        })
    }

    createDustCloud(x, y) {
        // Environmental dust when dinosaur moves
        for (let i = 0; i < 3; i++) {
            const dust = this.scene.add.circle(
                x + Phaser.Math.Between(-20, 20),
                y + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(2, 5),
                0x8b7355,
                0.4
            )

            this.scene.tweens.add({
                targets: dust,
                x: dust.x + Phaser.Math.Between(-30, 30),
                y: dust.y - Phaser.Math.Between(10, 30),
                alpha: 0,
                scale: 2,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => dust.destroy()
            })
        }
    }

    update(time, delta) {
        // Clean up any stray particles if needed
        // Most cleanup is handled by tween completion callbacks
    }

    clearAll() {
        // Stop all particle tweens and clear particles
        this.scene.tweens.killAll()
        
        // Reset pools
        this.explosionPool.forEach(group => {
            group.children.entries.forEach(particle => {
                particle.setActive(false)
                particle.setVisible(false)
            })
        })
        
        this.muzzleFlashPool.forEach(group => {
            group.children.entries.forEach(particle => {
                particle.setActive(false)
                particle.setVisible(false)
            })
        })
    }
}
