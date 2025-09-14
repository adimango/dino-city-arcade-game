export class SpriteLoader {
    constructor(scene) {
        this.scene = scene
        this.loadedSprites = new Map()
    }

    // Load all dinosaur sprite animations
    loadDinosaurSprites() {
        const dinosaurs = ['Alanqa', 'Baryonyx', 'Carnotaurus', 'Oviraptor', 'Styracosaurus']
        
        dinosaurs.forEach(dinoName => {
            this.loadDinosaurAnimations(dinoName)
        })
    }

    loadDinosaurAnimations(dinoName) {
        const animations = this.getDinosaurAnimations(dinoName)
        
        animations.forEach(animType => {
            const frames = this.getAnimationFrameCount(dinoName, animType)
            
            // Load individual frames
            for (let i = 0; i < frames; i++) {
                const frameKey = `${dinoName}_${animType}_${i.toString().padStart(3, '0')}`
                const framePath = `/assets/dinosaurs/${dinoName}/${animType}_${i.toString().padStart(3, '0')}.png`
                
                try {
                    this.scene.load.image(frameKey, framePath)
                } catch (error) {
                    console.warn(`Failed to load sprite: ${framePath}`)
                }
            }
        })
    }

    getDinosaurAnimations(dinoName) {
        const animationSets = {
            'Alanqa': ['Dead', 'Fly', 'Hurt'],
            'Baryonyx': ['Attack', 'Dead', 'Hurt', 'Idle', 'Walk'],
            'Carnotaurus': ['Attack', 'Dead', 'Hurt', 'Idle', 'Walk'], 
            'Oviraptor': ['Attack', 'Dead', 'Hurt', 'Idle', 'Walk'],
            'Styracosaurus': ['Attack', 'Dead', 'Hurt', 'Idle', 'Walk']
        }
        return animationSets[dinoName] || []
    }

    getAnimationFrameCount(dinoName, animType) {
        // Frame counts based on the file listing
        const frameCounts = {
            'Alanqa': {
                'Dead': 2, 'Fly': 4, 'Hurt': 3
            },
            'Baryonyx': {
                'Attack': 7, 'Dead': 5, 'Hurt': 3, 'Idle': 6, 'Walk': 12
            },
            'Carnotaurus': {
                'Attack': 6, 'Dead': 7, 'Hurt': 3, 'Idle': 6, 'Walk': 11
            },
            'Oviraptor': {
                'Attack': 6, 'Dead': 7, 'Hurt': 4, 'Idle': 6, 'Walk': 9
            },
            'Styracosaurus': {
                'Attack': 7, 'Dead': 4, 'Hurt': 3, 'Idle': 6, 'Walk': 12
            }
        }
        
        return frameCounts[dinoName]?.[animType] || 1
    }

    createAnimations() {
        const dinosaurs = ['Alanqa', 'Baryonyx', 'Carnotaurus', 'Oviraptor', 'Styracosaurus']
        
        dinosaurs.forEach(dinoName => {
            this.createDinosaurAnimations(dinoName)
        })
    }

    createDinosaurAnimations(dinoName) {
        const animations = this.getDinosaurAnimations(dinoName)
        
        animations.forEach(animType => {
            const frames = this.getAnimationFrameCount(dinoName, animType)
            const animKey = `${dinoName}_${animType}`
            
            // Create frame array
            const frameArray = []
            for (let i = 0; i < frames; i++) {
                frameArray.push({
                    key: `${dinoName}_${animType}_${i.toString().padStart(3, '0')}`
                })
            }
            
            // Animation config based on type
            const config = this.getAnimationConfig(animType)
            
            // Create animation
            if (!this.scene.anims.exists(animKey)) {
                this.scene.anims.create({
                    key: animKey,
                    frames: frameArray,
                    frameRate: config.frameRate,
                    repeat: config.repeat
                })
            }
        })
    }

    getAnimationConfig(animType) {
        const configs = {
            'Walk': { frameRate: 12, repeat: -1 },
            'Fly': { frameRate: 12, repeat: -1 },
            'Idle': { frameRate: 8, repeat: -1 },
            'Attack': { frameRate: 15, repeat: 0 },
            'Hurt': { frameRate: 10, repeat: 0 },
            'Dead': { frameRate: 8, repeat: 0 }
        }
        
        return configs[animType] || { frameRate: 10, repeat: -1 }
    }

    // Get random dinosaur type
    getRandomDinosaurType() {
        const types = ['Baryonyx', 'Carnotaurus', 'Oviraptor', 'Styracosaurus']
        return Phaser.Utils.Array.GetRandom(types)
    }

    // Get sprite key for specific animation frame
    getSpriteKey(dinoName, animType, frame = 0) {
        return `${dinoName}_${animType}_${frame.toString().padStart(3, '0')}`
    }

    // Get animation key
    getAnimationKey(dinoName, animType) {
        return `${dinoName}_${animType}`
    }
}
