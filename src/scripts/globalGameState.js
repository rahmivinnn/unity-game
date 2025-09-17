// Global Game State Manager for Energy Quest: Misteri Hemat Listrik
class GlobalGameState {
    constructor() {
        this.gameData = {
            // Player Progress
            playerName: '',
            currentLevel: 1,
            totalScore: 0,
            
            // Energy Keys System
            energyKeys: {
                ruangTamu: false,      // Level 1 - Ruang Tamu
                dapur: false,          // Level 2 - Dapur  
                laboratorium: false,   // Level 3 - Laboratorium
                ruangBawahTanah: false // Level 4 - Ruang Bawah Tanah
            },
            
            // Level Completion Status
            levelCompletion: {
                level1_ruangTamu: false,
                level2_dapur: false,
                level3_laboratorium: false,
                level4_ruangBawahTanah: false,
                Level1_Bedroom: false,
                Level2_Kitchen: false,
                Level3_Laboratory: false,
                Level4_Basement: false
            },
            
            // Level Scores
            levelScores: {
                level1_ruangTamu: 0,
                level2_dapur: 0,
                level3_laboratorium: 0,
                level4_ruangBawahTanah: 0,
                Level1_Bedroom: 0,
                Level2_Kitchen: 0,
                Level3_Laboratory: 0,
                Level4_Basement: 0
            },
            
            // Puzzle Completion per Level
            puzzleCompletion: {
                level1: {
                    rangkaianListrik: false,
                    lampuSwitch: false,
                    kabelPerbaikan: false
                },
                level2: {
                    kompor: false,
                    kulkas: false,
                    microwave: false
                },
                level3: {
                    generator: false,
                    voltmeter: false,
                    resistor: false
                },
                level4: {
                    mainPanel: false,
                    backup: false,
                    finalPuzzle: false
                }
            },
            
            // Story Progress
            storyProgress: {
                openingWatched: false,
                scientistCluesFound: [],
                finalRevelationUnlocked: false
            },
            
            // Gerbang Evaluasi Akhir
            finalGate: {
                unlocked: false,
                quizCompleted: false,
                finalScore: 0
            },
            
            // Game Settings
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                difficulty: 'normal'
            },
            
            // Timestamps
            gameStartTime: null,
            lastPlayTime: null,
            totalPlayTime: 0
        };
        
        this.init();
    }
    
    init() {
        this.loadGameData();
        this.setupEventListeners();
        console.log('Global Game State initialized');
    }
    
    // Save/Load System
    saveGameData() {
        try {
            localStorage.setItem('energyQuest_gameData', JSON.stringify(this.gameData));
            localStorage.setItem('energyQuest_lastSave', new Date().toISOString());
            console.log('Game data saved successfully');
        } catch (error) {
            console.error('Failed to save game data:', error);
        }
    }
    
    loadGameData() {
        try {
            const savedData = localStorage.getItem('energyQuest_gameData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.gameData = { ...this.gameData, ...parsed };
                console.log('Game data loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load game data:', error);
            this.resetGameData();
        }
    }
    
    resetGameData() {
        localStorage.removeItem('energyQuest_gameData');
        localStorage.removeItem('energyQuest_lastSave');
        this.gameData = {
            ...this.gameData,
            energyKeys: {
                ruangTamu: false,
                dapur: false,
                laboratorium: false,
                ruangBawahTanah: false
            },
            levelCompletion: {
                level1_ruangTamu: false,
                level2_dapur: false,
                level3_laboratorium: false,
                level4_ruangBawahTanah: false
            },
            finalGate: {
                unlocked: false,
                quizCompleted: false,
                finalScore: 0
            }
        };
        this.saveGameData();
    }
    
    // Energy Keys Management
    collectEnergyKey(levelName) {
        if (this.gameData.energyKeys.hasOwnProperty(levelName)) {
            this.gameData.energyKeys[levelName] = true;
            this.saveGameData();
            this.checkFinalGateUnlock();
            
            // Trigger event for UI updates
            this.triggerEvent('energyKeyCollected', { levelName, totalKeys: this.getTotalEnergyKeys() });
            
            return true;
        }
        return false;
    }
    
    getTotalEnergyKeys() {
        return Object.values(this.gameData.energyKeys).filter(key => key === true).length;
    }
    
    getAllEnergyKeysCollected() {
        return this.getTotalEnergyKeys() === 4;
    }
    
    // Level Management
    completeLevel(levelId, score = 100) {
        if (this.gameData.levelCompletion.hasOwnProperty(levelId)) {
            this.gameData.levelCompletion[levelId] = true;
            this.gameData.levelScores[levelId] = score;
            this.saveGameData();
            
            // Auto-collect energy key for completed level
            const levelMap = {
                'level1_ruangTamu': 'ruangTamu',
                'level2_dapur': 'dapur',
                'level3_laboratorium': 'laboratorium',
                'level4_ruangBawahTanah': 'ruangBawahTanah',
                'Level1_Bedroom': 'Kamar Tidur',
                'Level2_Kitchen': 'Dapur',
                'Level3_Laboratory': 'Laboratorium',
                'Level4_Basement': 'Ruang Bawah Tanah'
            };
            
            if (levelMap[levelId]) {
                this.collectEnergyKey(levelMap[levelId]);
            }
            
            // Trigger narrative system if available
            if (typeof window.narrativeSystem !== 'undefined') {
                window.narrativeSystem.onLevelComplete(levelId);
            }
            
            // Check if all keys collected for final revelation
            if (this.getAllEnergyKeysCollected() && typeof window.narrativeSystem !== 'undefined') {
                window.narrativeSystem.onAllKeysCollected();
            }
            
            this.triggerEvent('levelCompleted', { levelId, score });
            return true;
        }
        return false;
    }
    
    isLevelCompleted(levelId) {
        return this.gameData.levelCompletion[levelId] || false;
    }
    
    // Puzzle Management
    completePuzzle(level, puzzleName) {
        if (this.gameData.puzzleCompletion[level] && 
            this.gameData.puzzleCompletion[level].hasOwnProperty(puzzleName)) {
            
            this.gameData.puzzleCompletion[level][puzzleName] = true;
            this.saveGameData();
            
            // Check if all puzzles in level are completed
            const levelPuzzles = this.gameData.puzzleCompletion[level];
            const allCompleted = Object.values(levelPuzzles).every(completed => completed === true);
            
            if (allCompleted) {
                const levelId = `${level}_${this.getLevelName(level)}`;
                this.completeLevel(levelId);
            }
            
            this.triggerEvent('puzzleCompleted', { level, puzzleName });
            return true;
        }
        return false;
    }
    
    getLevelName(level) {
        const levelNames = {
            'level1': 'ruangTamu',
            'level2': 'dapur', 
            'level3': 'laboratorium',
            'level4': 'ruangBawahTanah'
        };
        return levelNames[level] || '';
    }
    
    // Final Gate System
    checkFinalGateUnlock() {
        const allKeysCollected = this.getAllEnergyKeysCollected();
        const allLevelsCompleted = Object.values(this.gameData.levelCompletion).every(completed => completed === true);
        
        if (allKeysCollected && allLevelsCompleted && !this.gameData.finalGate.unlocked) {
            this.unlockFinalGate();
        }
    }
    
    unlockFinalGate() {
        this.gameData.finalGate.unlocked = true;
        this.saveGameData();
        
        this.triggerEvent('finalGateUnlocked', {
            message: 'Gerbang Evaluasi Akhir telah terbuka! Semua Kunci Energi terkumpul!'
        });
        
        // Show notification to player
        this.showNotification(
            'Gerbang Evaluasi Akhir Terbuka!', 
            'Semua Kunci Energi telah terkumpul. Saatnya menghadapi evaluasi akhir untuk menemukan ilmuwan yang hilang!',
            'success'
        );
        
        return true;
    }
    
    isFinalGateUnlocked() {
        return this.gameData.finalGate.unlocked;
    }
    
    completeFinalQuiz(score) {
        this.gameData.finalGate.quizCompleted = true;
        this.gameData.finalGate.finalScore = score;
        this.gameData.totalScore += score;
        this.saveGameData();
        
        this.triggerEvent('gameCompleted', { finalScore: score });
    }
    
    // Story Progress
    markStoryProgress(progressKey, value = true) {
        if (this.gameData.storyProgress.hasOwnProperty(progressKey)) {
            this.gameData.storyProgress[progressKey] = value;
            this.saveGameData();
        }
    }
    
    addScientistClue(clueId) {
        if (!this.gameData.storyProgress.scientistCluesFound.includes(clueId)) {
            this.gameData.storyProgress.scientistCluesFound.push(clueId);
            this.saveGameData();
            
            this.triggerEvent('clueFound', { clueId, totalClues: this.gameData.storyProgress.scientistCluesFound.length });
        }
    }
    
    // Score Management
    addScore(points) {
        this.gameData.totalScore += points;
        this.saveGameData();
        this.triggerEvent('scoreUpdated', { newScore: this.gameData.totalScore, pointsAdded: points });
    }
    
    // Utility Methods
    getGameProgress() {
        const totalLevels = 4;
        const completedLevels = Object.values(this.gameData.levelCompletion).filter(completed => completed === true).length;
        const progressPercentage = Math.round((completedLevels / totalLevels) * 100);
        
        return {
            completedLevels,
            totalLevels,
            progressPercentage,
            energyKeysCollected: this.getTotalEnergyKeys(),
            totalEnergyKeys: 4,
            finalGateUnlocked: this.isFinalGateUnlocked()
        };
    }
    
    // Event System
    setupEventListeners() {
        this.eventListeners = {};
    }
    
    addEventListener(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback);
    }
    
    triggerEvent(eventType, data = {}) {
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${eventType}:`, error);
                }
            });
        }
    }
    
    // UI Notifications
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            max-width: 300px;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Debug Methods
    debugInfo() {
        console.log('=== Energy Quest Game State Debug ===');
        console.log('Energy Keys:', this.gameData.energyKeys);
        console.log('Level Completion:', this.gameData.levelCompletion);
        console.log('Final Gate:', this.gameData.finalGate);
        console.log('Progress:', this.getGameProgress());
        console.log('=====================================');
    }
    
    // Cheat Methods (for testing)
    unlockAllLevels() {
        Object.keys(this.gameData.levelCompletion).forEach(level => {
            this.gameData.levelCompletion[level] = true;
        });
        Object.keys(this.gameData.energyKeys).forEach(key => {
            this.gameData.energyKeys[key] = true;
        });
        this.checkFinalGateUnlock();
        this.saveGameData();
    }
}

// Global instance
window.globalGameState = new GlobalGameState();

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .game-notification {
        font-family: 'Orbitron', monospace;
    }
    
    // Story Progress Methods
    getStoryProgress() {
        return this.gameData.storyProgress;
    }
    
    updateStoryProgress(updates) {
        Object.assign(this.gameData.storyProgress, updates);
        this.saveGameData();
        console.log('Story progress updated:', updates);
    }
    
    addScientistClue(clueId) {
        if (!this.gameData.storyProgress.scientistCluesFound.includes(clueId)) {
            this.gameData.storyProgress.scientistCluesFound.push(clueId);
            this.saveGameData();
            console.log('Scientist clue added:', clueId);
        }
    }
    
    isStoryComplete() {
        const progress = this.gameData.storyProgress;
        return progress.openingWatched && 
               progress.scientistCluesFound.length >= 4 && 
               progress.finalRevelationUnlocked;
    }
    
    .notification-content h3 {
        margin: 0 0 10px 0;
        font-size: 1.2em;
    }
    
    .notification-content p {
        margin: 0 0 10px 0;
        font-size: 0.9em;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5em;
        cursor: pointer;
        float: right;
        margin-top: -5px;
    }
`;
document.head.appendChild(notificationStyles);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalGameState;
}