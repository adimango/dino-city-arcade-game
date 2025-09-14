export class GameState {
    constructor() {
        this.score = 0
        this.highScore = parseInt(localStorage.getItem('dinoHighScore')) || 0
        this.lives = 3
        this.level = 1
        this.spawnRate = 1400  // Much faster starting pace - intense action
        this.maxDinosaurs = 6  // Start with more dinosaurs
        this.soundEnabled = true
        this.gameRunning = false
        this.dinosaursKilled = 0
        this.combo = 0
        this.maxCombo = 0
    }

    reset() {
        this.score = 0
        this.lives = 3
        this.level = 1
        this.spawnRate = 1400  // Much faster starting pace - intense action
        this.maxDinosaurs = 6  // Start with more dinosaurs
        this.gameRunning = false
        this.dinosaursKilled = 0
        this.combo = 0
    }

    addScore(points) {
        this.score += points
        this.dinosaursKilled++
        this.combo++
        
        // Combo bonus
        if (this.combo > 1) {
            this.score += this.combo * 5
        }
        
        this.maxCombo = Math.max(this.maxCombo, this.combo)
        
        // Level progression - fast progression for intense gameplay
        if (this.dinosaursKilled % 8 === 0) {
            this.levelUp()
        }
        
        // Save high score
        if (this.score > this.highScore) {
            this.highScore = this.score
            localStorage.setItem('dinoHighScore', this.highScore.toString())
        }
    }

    levelUp() {
        this.level++
        
        // Aggressive progression for intense challenge
        if (this.level <= 2) {
            // Early levels: reduce spawn time by 200ms
            this.spawnRate = Math.max(800, this.spawnRate - 200)
        } else if (this.level <= 5) {
            // Mid levels: reduce spawn time by 160ms  
            this.spawnRate = Math.max(500, this.spawnRate - 160)
        } else {
            // Higher levels: reduce spawn time by 140ms
            this.spawnRate = Math.max(300, this.spawnRate - 140)
        }
        
        // Add dinosaurs more aggressively
        if (this.level <= 4) {
            // Add 1 dinosaur every level early on
            this.maxDinosaurs = Math.min(10, this.maxDinosaurs + 1)
        } else {
            // Add 1 dinosaur every 2 levels later
            if (this.level % 2 === 0) {
                this.maxDinosaurs = Math.min(12, this.maxDinosaurs + 1)
            }
        }
        
        // Visual feedback for leveling up
        this.showLevelUpFeedback = true
    }

    loseLife() {
        this.lives--
        this.combo = 0
        return this.lives <= 0
    }

    resetCombo() {
        this.combo = 0
    }

    getGameData() {
        return {
            score: this.score,
            highScore: this.highScore,
            lives: this.lives,
            level: this.level,
            combo: this.combo,
            maxCombo: this.maxCombo,
            dinosaursKilled: this.dinosaursKilled
        }
    }
}
