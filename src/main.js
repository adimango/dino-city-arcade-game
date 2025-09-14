import Phaser from 'phaser'
import MainMenuScene from './scenes/MainMenuScene.js'
import GamePlayScene from './scenes/GamePlayScene.js'
import GameOverScene from './scenes/GameOverScene.js'
import { GameState } from './utils/GameState.js'

// Initialize game state
window.gameState = new GameState()

// Game Configuration for full screen
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#2d4a36',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game-container'
    },
    scene: [MainMenuScene, GamePlayScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    audio: {
        disableWebAudio: false
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    }
}

// Improved responsive handling
function handleResize() {
    if (window.game && window.game.scale) {
        // Force refresh the scale manager
        window.game.scale.refresh()
        
        // Add a small delay to ensure proper scaling
        setTimeout(() => {
            if (window.game && window.game.scale) {
                window.game.scale.refresh()
            }
        }, 50)
    }
}

// Better event handling for responsive design
function setupResponsive() {
    // Handle window resize
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimeout)
        window.resizeTimeout = setTimeout(handleResize, 100)
    })
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        // Longer delay for orientation changes as they take more time
        setTimeout(() => {
            handleResize()
            // Additional refresh after orientation stabilizes
            setTimeout(handleResize, 500)
        }, 200)
    })
    
    // Handle visibility change (when switching apps)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(handleResize, 100)
        }
    })
}

// Remove loading text
const loadingElement = document.querySelector('.loading')
if (loadingElement) {
    loadingElement.remove()
}

// Initialize the game
const game = new Phaser.Game(config)

// Global game reference
window.game = game

// Setup responsive handling after game is initialized
setupResponsive()

// Initial resize to ensure proper scaling
setTimeout(handleResize, 100)
