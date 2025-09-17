// Global Game State Manager
// Mengelola state game secara global untuk semua mini-games

class GlobalGameState {
    constructor() {
        this.gameData = {
            // Energy Keys dari berbagai game
            energyKeys: {
                ruangTamu: false,
                dapur: false,
                laboratorium: false,
                ruangBawahTanah: false
            },
            
            // Level progression
            levels: {
                energyGame: { completed: false, score: 0 },
                puzzleGame: { completed: false, score: 0, progress: {} },
                topdownGame: { completed: false, score: 0 },
                experiments: { completed: false, score: 0 }
            },
            
            // Final Gate status
            finalGate: {
                unlocked: false,
                quizCompleted: false,
                finalScore: 0
            },
            
            // Story progress
            story: {
                scientistFound: false,
                mysteryResolved: false,
                currentChapter: 1
            },
            
            // Overall game statistics
            totalScore: 0,
            totalPlayTime: 0,
            lastPlayed: null
        };
        
        this.loadGameData();
    }
    
    // Save/Load methods
    saveGameData() {
        try {
            localStorage.setItem('globalGameState', JSON.stringify(this.gameData));
            this.gameData.lastPlayed = new Date().toISOString();
            console.log('Global game state saved successfully');
        } catch (error) {
            console.error('Failed to save global game state:', error);
        }
    }
    
    loadGameData() {
        try {
            const savedData = localStorage.getItem('globalGameState');
            if (savedData) {
                this.gameData = { ...this.gameData, ...JSON.parse(savedData) };
                console.log('Global game state loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load global game state:', error);
        }
    }
    
    // Energy Key management
    collectEnergyKey(keyName) {
        if (this.gameData.energyKeys.hasOwnProperty(keyName)) {
            this.gameData.energyKeys[keyName] = true;
            this.showNotification(`🔑 Kunci Energi ${keyName} terkumpul!`, 'success');
            this.checkFinalGateUnlock();
            return true;
        }
        return false;
    }
    
    getTotalEnergyKeys() {
        return Object.values(this.gameData.energyKeys).filter(key => key).length;
    }
    
    getAllEnergyKeysCollected() {
        return Object.values(this.gameData.energyKeys).every(key => key);
    }
    
    getEnergyKeyStatus() {
        return { ...this.gameData.energyKeys };
    }
    
    getCollectedKeysCount() {
        return Object.values(this.gameData.energyKeys).filter(key => key).length;
    }
    
    // Testing method - untuk memberikan semua kunci energi
    unlockAllEnergyKeys() {
        Object.keys(this.gameData.energyKeys).forEach(key => {
            this.gameData.energyKeys[key] = true;
        });
        this.saveGameData();
        this.showNotification('🔑 Semua Kunci Energi telah terkumpul untuk testing!', 'success');
    }
    
    // Level management
    completeLevel(gameName, score = 0) {
        if (this.gameData.levels[gameName]) {
            this.gameData.levels[gameName].completed = true;
            this.gameData.levels[gameName].score = Math.max(
                this.gameData.levels[gameName].score, 
                score
            );
            this.updateTotalScore();
            this.showNotification(`✅ ${gameName} selesai! Skor: ${score}`, 'success');
        }
    }
    
    updatePuzzleGameProgress(progressData) {
        if (this.gameData.levels.puzzleGame) {
            this.gameData.levels.puzzleGame = {
                ...this.gameData.levels.puzzleGame,
                ...progressData
            };
        }
    }
    
    // Final Gate management
    checkFinalGateUnlock() {
        const allKeysCollected = this.getAllEnergyKeysCollected();
        if (allKeysCollected && !this.gameData.finalGate.unlocked) {
            this.gameData.finalGate.unlocked = true;
            this.showNotification('🚪 Gerbang Evaluasi Akhir terbuka!', 'achievement');
        }
    }
    
    completeFinalQuiz(score) {
        this.gameData.finalGate.quizCompleted = true;
        this.gameData.finalGate.finalScore = score;
        this.updateTotalScore();
    }
    
    // Story progression
    updateStoryProgress(chapter, scientistFound = false) {
        this.gameData.story.currentChapter = Math.max(
            this.gameData.story.currentChapter, 
            chapter
        );
        if (scientistFound) {
            this.gameData.story.scientistFound = true;
            this.gameData.story.mysteryResolved = true;
        }
    }
    
    // Score management
    updateTotalScore() {
        this.gameData.totalScore = Object.values(this.gameData.levels)
            .reduce((total, level) => total + (level.score || 0), 0) +
            (this.gameData.finalGate.finalScore || 0);
    }
    
    // Utility methods
    getGameData() {
        return { ...this.gameData };
    }
    
    resetGameData() {
        this.gameData = {
            energyKeys: {
                ruangTamu: false,
                dapur: false,
                laboratorium: false,
                ruangBawahTanah: false
            },
            levels: {
                energyGame: { completed: false, score: 0 },
                puzzleGame: { completed: false, score: 0, progress: {} },
                topdownGame: { completed: false, score: 0 },
                experiments: { completed: false, score: 0 }
            },
            finalGate: {
                unlocked: false,
                quizCompleted: false,
                finalScore: 0
            },
            story: {
                scientistFound: false,
                mysteryResolved: false,
                currentChapter: 1
            },
            totalScore: 0,
            totalPlayTime: 0,
            lastPlayed: null
        };
        this.saveGameData();
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `global-notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Create global instance
window.globalGameState = new GlobalGameState();

// CSS for notifications
const notificationStyles = `
.global-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.global-notification.show {
    transform: translateX(0);
}

.global-notification.success {
    background: linear-gradient(135deg, #4CAF50, #45a049);
}

.global-notification.achievement {
    background: linear-gradient(135deg, #FF9800, #F57C00);
}

.global-notification.info {
    background: linear-gradient(135deg, #2196F3, #1976D2);
}

.global-notification.error {
    background: linear-gradient(135deg, #f44336, #d32f2f);
}
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

console.log('Global Game State Manager initialized');