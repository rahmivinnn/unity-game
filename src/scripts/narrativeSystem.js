/**
 * Narrative System for Energy Quest Game
 * Handles the missing scientist storyline and narrative progression
 */

class NarrativeSystem {
    constructor() {
        this.narratives = {
            opening: {
                id: 'opening',
                title: 'Misteri Ilmuwan Hilang',
                content: 'Dr. Elena Watt, seorang ilmuwan energi terkenal, telah menghilang secara misterius. Sebelum menghilang, dia meninggalkan 4 kunci energi tersembunyi di rumahnya. Bantulah menemukan kunci-kunci tersebut dan ungkap misteri di balik hilangnya Dr. Elena!',
                trigger: 'game_start',
                unlocked: false
            },
            
            level1_clue: {
                id: 'level1_clue',
                title: 'Petunjuk Pertama',
                content: 'Di kamar tidur, Anda menemukan catatan Dr. Elena: "Energi listrik adalah kunci kehidupan modern. Saya telah menyembunyikan rahasia penting di setiap ruangan. Mulailah dari tempat kita beristirahat..."',
                trigger: 'level1_complete',
                unlocked: false
            },
            
            level2_clue: {
                id: 'level2_clue',
                title: 'Jejak di Dapur',
                content: 'Di dapur, Anda menemukan diagram rangkaian listrik dengan tulisan: "Efisiensi energi adalah masa depan. Peralatan dapur modern dapat menghemat hingga 50% energi. Lanjutkan ke tempat eksperimen saya..."',
                trigger: 'level2_complete',
                unlocked: false
            },
            
            level3_clue: {
                id: 'level3_clue',
                title: 'Laboratorium Rahasia',
                content: 'Di laboratorium, Anda menemukan penelitian Dr. Elena tentang energi terbarukan. Ada pesan terakhir: "Teknologi masa depan sudah di depan mata. Temukan ruang bawah tanah untuk jawaban terakhir..."',
                trigger: 'level3_complete',
                unlocked: false
            },
            
            level4_clue: {
                id: 'level4_clue',
                title: 'Kebenaran Terungkap',
                content: 'Di ruang bawah tanah, Anda menemukan portal energi yang Dr. Elena ciptakan. Dia tidak hilang - dia melakukan perjalanan ke dimensi energi untuk meneliti sumber energi tak terbatas! Kunci-kunci yang Anda kumpulkan adalah kode untuk mengaktifkan portal.',
                trigger: 'level4_complete',
                unlocked: false
            },
            
            final_revelation: {
                id: 'final_revelation',
                title: 'Misi Terakhir',
                content: 'Dengan 4 kunci energi terkumpul, Anda dapat mengakses Gerbang Evaluasi Akhir. Dr. Elena meninggalkan kuis terakhir untuk memastikan pengetahuan energi Anda cukup untuk melanjutkan penelitiannya. Apakah Anda siap menghadapi tantangan terakhir?',
                trigger: 'all_keys_collected',
                unlocked: false
            }
        };
        
        this.currentNarrative = null;
        this.isNarrativeActive = false;
        
        this.init();
    }
    
    init() {
        this.createNarrativeUI();
        this.bindEvents();
        
        // Check if we should show opening narrative
        if (typeof window.globalGameState !== 'undefined') {
            const storyProgress = window.globalGameState.getStoryProgress();
            if (!storyProgress.openingWatched) {
                setTimeout(() => {
                    this.triggerNarrative('opening');
                }, 2000);
            }
        }
    }
    
    createNarrativeUI() {
        // Create narrative overlay
        const overlay = document.createElement('div');
        overlay.id = 'narrative-overlay';
        overlay.className = 'narrative-overlay hidden';
        overlay.innerHTML = `
            <div class="narrative-container">
                <div class="narrative-header">
                    <h2 id="narrative-title">Narrative Title</h2>
                    <button id="narrative-close" class="narrative-close-btn">×</button>
                </div>
                <div class="narrative-content">
                    <p id="narrative-text">Narrative content goes here...</p>
                </div>
                <div class="narrative-footer">
                    <button id="narrative-continue" class="narrative-btn">Lanjutkan</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add CSS styles
        this.addNarrativeStyles();
    }
    
    addNarrativeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .narrative-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .narrative-overlay:not(.hidden) {
                opacity: 1;
            }
            
            .narrative-container {
                background: linear-gradient(135deg, #1e3c72, #2a5298);
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                border: 2px solid #4a90e2;
                animation: narrativeSlideIn 0.5s ease-out;
            }
            
            @keyframes narrativeSlideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .narrative-header {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .narrative-header h2 {
                color: #fff;
                margin: 0;
                font-size: 1.5em;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .narrative-close-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .narrative-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .narrative-content {
                padding: 30px;
                color: #fff;
                line-height: 1.6;
                font-size: 1.1em;
            }
            
            .narrative-footer {
                padding: 20px;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .narrative-btn {
                background: linear-gradient(45deg, #4a90e2, #357abd);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
            }
            
            .narrative-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
            }
            
            .hidden {
                display: none !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'narrative-close' || e.target.id === 'narrative-continue') {
                this.hideNarrative();
            }
            
            if (e.target.id === 'narrative-overlay') {
                this.hideNarrative();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isNarrativeActive) {
                this.hideNarrative();
            }
        });
    }
    
    triggerNarrative(narrativeId) {
        const narrative = this.narratives[narrativeId];
        if (!narrative) {
            console.warn(`Narrative ${narrativeId} not found`);
            return;
        }
        
        this.currentNarrative = narrative;
        this.showNarrative(narrative);
        
        // Mark as unlocked and update global state
        narrative.unlocked = true;
        this.updateGlobalStoryProgress(narrativeId);
    }
    
    showNarrative(narrative) {
        const overlay = document.getElementById('narrative-overlay');
        const title = document.getElementById('narrative-title');
        const text = document.getElementById('narrative-text');
        
        title.textContent = narrative.title;
        text.textContent = narrative.content;
        
        overlay.classList.remove('hidden');
        this.isNarrativeActive = true;
        
        // Pause game if needed
        this.pauseGameplay();
    }
    
    hideNarrative() {
        const overlay = document.getElementById('narrative-overlay');
        overlay.classList.add('hidden');
        this.isNarrativeActive = false;
        this.currentNarrative = null;
        
        // Resume game
        this.resumeGameplay();
    }
    
    updateGlobalStoryProgress(narrativeId) {
        if (typeof window.globalGameState !== 'undefined') {
            const updates = {};
            
            switch(narrativeId) {
                case 'opening':
                    updates.openingWatched = true;
                    break;
                case 'level1_clue':
                case 'level2_clue':
                case 'level3_clue':
                case 'level4_clue':
                    if (!window.globalGameState.gameData.storyProgress.scientistCluesFound.includes(narrativeId)) {
                        window.globalGameState.gameData.storyProgress.scientistCluesFound.push(narrativeId);
                    }
                    break;
                case 'final_revelation':
                    updates.finalRevelationUnlocked = true;
                    break;
            }
            
            window.globalGameState.updateStoryProgress(updates);
        }
    }
    
    pauseGameplay() {
        // Pause any running timers or animations
        if (typeof window.currentGame !== 'undefined' && window.currentGame.pause) {
            window.currentGame.pause();
        }
    }
    
    resumeGameplay() {
        // Resume any paused timers or animations
        if (typeof window.currentGame !== 'undefined' && window.currentGame.resume) {
            window.currentGame.resume();
        }
    }
    
    // Public methods for triggering narratives from game events
    onLevelComplete(levelId) {
        const triggerMap = {
            'Level1_Bedroom': 'level1_clue',
            'Level2_Kitchen': 'level2_clue',
            'Level3_Laboratory': 'level3_clue',
            'Level4_Basement': 'level4_clue'
        };
        
        const narrativeId = triggerMap[levelId];
        if (narrativeId) {
            setTimeout(() => {
                this.triggerNarrative(narrativeId);
            }, 2000); // Show after level completion celebration
        }
    }
    
    onAllKeysCollected() {
        setTimeout(() => {
            this.triggerNarrative('final_revelation');
        }, 1000);
    }
    
    // Get narrative history for save/load
    getNarrativeProgress() {
        const progress = {};
        Object.keys(this.narratives).forEach(id => {
            progress[id] = this.narratives[id].unlocked;
        });
        return progress;
    }
    
    // Load narrative progress
    loadNarrativeProgress(progress) {
        Object.keys(progress).forEach(id => {
            if (this.narratives[id]) {
                this.narratives[id].unlocked = progress[id];
            }
        });
    }
}

// Make NarrativeSystem available globally
window.NarrativeSystem = NarrativeSystem;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.narrativeSystem = new NarrativeSystem();
    });
} else {
    window.narrativeSystem = new NarrativeSystem();
}