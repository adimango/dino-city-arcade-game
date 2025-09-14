export default class AudioManager {
    constructor(scene) {
        this.scene = scene
        this.sounds = {}
        this.musicVolume = 0.3
        this.sfxVolume = 0.7
        this.backgroundMusic = null
        
        // Create procedural audio using Web Audio API
        this.createAudioContext()
        this.initializeSounds()
        this.loadBackgroundMusic()
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
            this.masterGain = this.audioContext.createGain()
            this.masterGain.connect(this.audioContext.destination)
        } catch (e) {
            console.warn('Web Audio API not supported, audio disabled')
            this.audioContext = null
        }
    }

    initializeSounds() {
        if (!this.audioContext) return

        // Pre-generate sound buffers for better performance
        this.sounds = {
            hit: this.createHitSound(),
            miss: this.createMissSound(),
            spawn: this.createSpawnSound(),
            levelUp: this.createLevelUpSound(),
            gameOver: this.createGameOverSound(),
            combo: this.createComboSound()
        }
    }

    loadBackgroundMusic() {
        // Load background music using Phaser's audio system
        if (this.scene && this.scene.load) {
            this.scene.load.audio('backgroundMusic', 'assets/music/background-music.mp3')
        }
    }

    playBackgroundMusic() {
        if (!window.gameState.soundEnabled) return
        
        try {
            // Stop any existing background music
            this.stopBackgroundMusic()
            
            // Create new background music instance
            if (this.scene && this.scene.sound) {
                this.backgroundMusic = this.scene.sound.add('backgroundMusic', {
                    loop: true,
                    volume: this.musicVolume
                })
                
                this.backgroundMusic.play()
            }
        } catch (e) {
            console.warn('Error playing background music:', e)
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop()
            this.backgroundMusic.destroy()
            this.backgroundMusic = null
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause()
        }
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPaused) {
            this.backgroundMusic.resume()
        }
    }

    updateBackgroundMusicVolume() {
        if (this.backgroundMusic) {
            this.backgroundMusic.setVolume(this.musicVolume)
        }
    }

    createHitSound() {
        // Create hit sound (explosive pop)
        return {
            frequency: 300,
            type: 'hit',
            duration: 0.2
        }
    }

    createMissSound() {
        // Create miss sound (subtle click)
        return {
            frequency: 150,
            type: 'miss',
            duration: 0.1
        }
    }

    createSpawnSound() {
        // Create spawn sound (low growl)
        return {
            frequency: 80,
            type: 'spawn',
            duration: 0.5
        }
    }

    createLevelUpSound() {
        // Create level up sound (ascending notes)
        return {
            frequencies: [220, 277, 330, 440],
            type: 'levelUp',
            duration: 0.8
        }
    }

    createGameOverSound() {
        // Create game over sound (descending dramatic)
        return {
            frequencies: [440, 330, 220, 165],
            type: 'gameOver',
            duration: 1.0
        }
    }

    createComboSound() {
        // Create combo sound (quick beep)
        return {
            frequency: 880,
            type: 'combo',
            duration: 0.15
        }
    }

    playHitSound() {
        if (!window.gameState.soundEnabled || !this.audioContext) return
        
        const sound = this.sounds.hit
        this.playBeep(sound.frequency, sound.duration, 'square')
        
        // Add some white noise for impact
        this.playNoise(0.1, 0.05)
    }

    playMissSound() {
        if (!window.gameState.soundEnabled || !this.audioContext) return
        
        const sound = this.sounds.miss
        this.playBeep(sound.frequency, sound.duration, 'sine', 0.3)
    }

    playSpawnSound() {
        if (!window.gameState.soundEnabled || !this.audioContext) return
        
        const sound = this.sounds.spawn
        // Create growling effect with low frequency oscillation
        this.playModulatedTone(sound.frequency, sound.duration)
    }

    playLevelUpSound() {
        if (!window.gameState.soundEnabled || !this.audioContext) return
        
        const sound = this.sounds.levelUp
        // Play ascending notes
        sound.frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 0.2, 'triangle')
            }, index * 150)
        })
    }

    playGameOverSound() {
        if (!window.gameState.soundEnabled || !this.audioContext) return
        
        const sound = this.sounds.gameOver
        // Play descending dramatic notes
        sound.frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 0.3, 'sawtooth', 0.6)
            }, index * 200)
        })
    }

    playComboSound() {
        if (!window.gameState.soundEnabled || !this.audioContext) return
        
        const sound = this.sounds.combo
        this.playBeep(sound.frequency, sound.duration, 'sine', 0.4)
    }

    playBeep(frequency, duration, waveType = 'sine', volume = 0.5) {
        if (!this.audioContext) return

        try {
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(this.masterGain)
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
            oscillator.type = waveType
            
            // Envelope for more natural sound
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime + 0.01)
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
            
            oscillator.start(this.audioContext.currentTime)
            oscillator.stop(this.audioContext.currentTime + duration)
        } catch (e) {
            console.warn('Error playing beep:', e)
        }
    }

    playNoise(volume, duration) {
        if (!this.audioContext) return

        try {
            const bufferSize = this.audioContext.sampleRate * duration
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
            const output = buffer.getChannelData(0)
            
            // Generate white noise
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1
            }
            
            const source = this.audioContext.createBufferSource()
            const gainNode = this.audioContext.createGain()
            
            source.buffer = buffer
            source.connect(gainNode)
            gainNode.connect(this.masterGain)
            
            gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
            
            source.start(this.audioContext.currentTime)
        } catch (e) {
            console.warn('Error playing noise:', e)
        }
    }

    playModulatedTone(baseFreq, duration) {
        if (!this.audioContext) return

        try {
            // Main oscillator
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()
            
            // LFO for modulation (growl effect)
            const lfo = this.audioContext.createOscillator()
            const lfoGain = this.audioContext.createGain()
            
            lfo.frequency.setValueAtTime(8, this.audioContext.currentTime) // 8 Hz modulation
            lfoGain.gain.setValueAtTime(20, this.audioContext.currentTime) // Modulation depth
            
            lfo.connect(lfoGain)
            lfoGain.connect(oscillator.frequency)
            
            oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime)
            oscillator.type = 'sawtooth'
            
            oscillator.connect(gainNode)
            gainNode.connect(this.masterGain)
            
            // Envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime + 0.1)
            gainNode.gain.linearRampToValueAtTime(0.2 * this.sfxVolume, this.audioContext.currentTime + duration - 0.1)
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
            
            lfo.start(this.audioContext.currentTime)
            oscillator.start(this.audioContext.currentTime)
            
            lfo.stop(this.audioContext.currentTime + duration)
            oscillator.stop(this.audioContext.currentTime + duration)
        } catch (e) {
            console.warn('Error playing modulated tone:', e)
        }
    }

    startAmbientSound() {
        if (!window.gameState.soundEnabled || !this.audioContext || this.ambientSource) return

        try {
            // Create ambient city sound (low rumble with periodic distant roars)
            this.createAmbientLoop()
        } catch (e) {
            console.warn('Error starting ambient sound:', e)
        }
    }

    createAmbientLoop() {
        if (!this.audioContext) return

        // Low frequency rumble
        const rumbleOsc = this.audioContext.createOscillator()
        const rumbleGain = this.audioContext.createGain()
        const rumbleFilter = this.audioContext.createBiquadFilter()
        
        rumbleOsc.frequency.setValueAtTime(40, this.audioContext.currentTime)
        rumbleOsc.type = 'sawtooth'
        
        rumbleFilter.type = 'lowpass'
        rumbleFilter.frequency.setValueAtTime(80, this.audioContext.currentTime)
        
        rumbleGain.gain.setValueAtTime(0.1 * this.musicVolume, this.audioContext.currentTime)
        
        rumbleOsc.connect(rumbleFilter)
        rumbleFilter.connect(rumbleGain)
        rumbleGain.connect(this.masterGain)
        
        rumbleOsc.start()
        this.ambientSource = rumbleOsc
        
        // Schedule distant roars
        this.scheduleDistantRoar()
    }

    scheduleDistantRoar() {
        if (!this.audioContext || !window.gameState.gameRunning) return

        // Random distant roar every 10-20 seconds
        const delay = Phaser.Math.Between(10000, 20000)
        
        setTimeout(() => {
            if (window.gameState.gameRunning && window.gameState.soundEnabled) {
                this.playDistantRoar()
                this.scheduleDistantRoar() // Schedule next roar
            }
        }, delay)
    }

    playDistantRoar() {
        if (!this.audioContext) return

        try {
            const roarOsc = this.audioContext.createOscillator()
            const roarGain = this.audioContext.createGain()
            const roarFilter = this.audioContext.createBiquadFilter()
            
            roarOsc.frequency.setValueAtTime(60, this.audioContext.currentTime)
            roarOsc.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.5)
            roarOsc.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 1.5)
            
            roarOsc.type = 'sawtooth'
            
            roarFilter.type = 'lowpass'
            roarFilter.frequency.setValueAtTime(300, this.audioContext.currentTime)
            
            roarGain.gain.setValueAtTime(0, this.audioContext.currentTime)
            roarGain.gain.linearRampToValueAtTime(0.15 * this.musicVolume, this.audioContext.currentTime + 0.2)
            roarGain.gain.linearRampToValueAtTime(0.1 * this.musicVolume, this.audioContext.currentTime + 1.0)
            roarGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2.0)
            
            roarOsc.connect(roarFilter)
            roarFilter.connect(roarGain)
            roarGain.connect(this.masterGain)
            
            roarOsc.start()
            roarOsc.stop(this.audioContext.currentTime + 2.0)
        } catch (e) {
            console.warn('Error playing distant roar:', e)
        }
    }

    stopAmbientSound() {
        if (this.ambientSource) {
            try {
                this.ambientSource.stop()
                this.ambientSource = null
            } catch (e) {
                console.warn('Error stopping ambient sound:', e)
            }
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume))
        this.updateBackgroundMusicVolume()
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume))
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
        }
    }

    resumeAudioContext() {
        // Resume audio context on user interaction (required by browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume()
        }
    }

    destroy() {
        this.stopAmbientSound()
        this.stopBackgroundMusic()
        
        if (this.audioContext) {
            this.audioContext.close()
            this.audioContext = null
        }
    }
}
