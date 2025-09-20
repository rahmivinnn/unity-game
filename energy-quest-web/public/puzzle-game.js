// Puzzle Game - Inventory Style JavaScript

class PuzzleGame {
    constructor() {
        this.currentZone = 'puzzle';
        this.puzzlePieces = [];
        this.puzzleSlots = [];
        this.gridSize = { rows: 3, cols: 4 };
        this.totalPieces = 12;
        this.placedPieces = 0;
        this.gameCompleted = false;
        this.aiCursorActive = false;
        
        // Initialize puzzle assets
        this.assets = new PuzzleAssets();
        
        // Get realistic puzzle images
        this.puzzleImages = this.assets.puzzleImages;
        this.targetImage = this.assets.getTargetImage();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createPuzzlePieces();
        this.createPuzzleGrid();
        this.updateHUD();
        this.setTargetImage();
        this.createAICursor();
        this.startBackgroundAnimations();
    }
    
    setupEventListeners() {
        // Zone navigation
        document.querySelectorAll('.map-zone').forEach(zone => {
            zone.addEventListener('click', (e) => {
                const zoneId = e.currentTarget.dataset.zone;
                this.navigateToZone(zoneId);
            });
        });
        
        // Drag and drop events will be set up in createPuzzlePieces
    }
    
    navigateToZone(zoneId) {
        if (zoneId === this.currentZone) return;
        
        // Hide current zone
        document.querySelector(`.game-zone[data-zone="${this.currentZone}"]`)?.classList.remove('active');
        document.querySelector(`.map-zone[data-zone="${this.currentZone}"]`)?.classList.remove('active');
        
        // Show new zone
        this.currentZone = zoneId;
        document.querySelector(`.game-zone[data-zone="${zoneId}"]`)?.classList.add('active');
        document.querySelector(`.map-zone[data-zone="${zoneId}"]`)?.classList.add('active');
        
        // Update character speech
        this.showCharacterSpeech(zoneId);
        
        // Play zone transition sound
        this.playSound('zone-transition');
        
        // Show zone-specific feedback
        this.showFeedback(`Memasuki ${this.getZoneName(zoneId)}`, 'info');
    }
    
    showCharacterSpeech(zoneId) {
        const speeches = {
            puzzle: "Halo! Aku butuh bantuanmu untuk menyusun puzzle ini. Seret kepingan puzzle dari inventory ke area puzzle untuk menyelesaikannya!",
            energy: "Sekarang kita bisa masuk ke game energi setelah menyelesaikan puzzle! Klik tombol di bawah untuk masuk."
        };
        
        const speechElement = document.querySelector('.character-speech p');
        if (speechElement) {
            speechElement.textContent = speeches[zoneId] || speeches.puzzle;
            
            // Animate speech bubble
            speechElement.parentElement.style.transform = 'scale(0.8)';
            speechElement.parentElement.style.opacity = '0';
            
            setTimeout(() => {
                speechElement.parentElement.style.transform = 'scale(1)';
                speechElement.parentElement.style.opacity = '1';
            }, 100);
        }
    }
    
    createPuzzlePieces() {
        const container = document.getElementById('puzzle-pieces-container');
        container.innerHTML = '';
        
        for (let i = 0; i < this.totalPieces; i++) {
            // Get realistic puzzle piece data
            const pieceData = this.assets.getPuzzlePiece(i);
            
            // Create realistic puzzle piece
            const piece = this.assets.createInventoryStylePiece(pieceData);
            
            // Add drag event listeners
            piece.addEventListener('dragstart', (e) => this.handleDragStart(e));
            piece.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Add click event for AI cursor
            piece.addEventListener('click', (e) => {
                this.showAICursor(e.currentTarget);
                setTimeout(() => {
                    this.hideAICursor();
                }, 1000);
            });
            
            container.appendChild(piece);
            this.puzzlePieces.push(piece);
        }
    }
    
    createPuzzleGrid() {
        const grid = document.getElementById('puzzle-grid');
        grid.innerHTML = '';
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const slot = document.createElement('div');
                slot.className = 'puzzle-slot';
                slot.dataset.row = row;
                slot.dataset.col = col;
                slot.dataset.slotId = `${row}-${col}`;
                
                // Add drop event listeners
                slot.addEventListener('dragover', (e) => this.handleDragOver(e));
                slot.addEventListener('drop', (e) => this.handleDrop(e));
                slot.addEventListener('dragenter', (e) => this.handleDragEnter(e));
                slot.addEventListener('dragleave', (e) => this.handleDragLeave(e));
                
                grid.appendChild(slot);
                this.puzzleSlots.push(slot);
            }
        }
    }
    
    setTargetImage() {
        const targetImg = document.getElementById('target-image');
        if (targetImg) {
            targetImg.src = this.targetImage;
            targetImg.alt = 'Target Puzzle Image';
        }
    }
    
    handleDragStart(e) {
        const piece = e.target;
        piece.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', piece.outerHTML);
        e.dataTransfer.setData('text/plain', piece.dataset.pieceId);
        
        this.showFeedback(`Mengambil kepingan puzzle ${parseInt(piece.dataset.pieceId) + 1}`, 'info');
        this.playSound('piece-pickup');
    }
    
    handleDragEnd(e) {
        const piece = e.target;
        piece.classList.remove('dragging');
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        const slot = e.target;
        if (!slot.classList.contains('occupied')) {
            slot.classList.add('highlight');
        }
    }
    
    handleDragLeave(e) {
        const slot = e.target;
        slot.classList.remove('highlight');
    }
    
    handleDrop(e) {
        e.preventDefault();
        const slot = e.target;
        const pieceId = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`[data-piece-id="${pieceId}"]`);
        
        if (!slot.classList.contains('occupied') && piece && !piece.classList.contains('used')) {
            // Place piece in slot
            this.placePieceInSlot(piece, slot);
            this.showFeedback(`Kepingan puzzle ${parseInt(pieceId) + 1} ditempatkan!`, 'success');
            this.playSound('piece-place');
            
            // Add sparkle effect
            this.addSparkleEffect(slot);
            
            // Check if puzzle is completed
            this.checkPuzzleCompletion();
        } else {
            this.showFeedback('Tidak bisa menempatkan kepingan puzzle di sini!', 'error');
            this.playSound('piece-error');
        }
        
        slot.classList.remove('highlight');
    }
    
    placePieceInSlot(piece, slot) {
        // Mark piece as used
        piece.classList.add('used');
        piece.draggable = false;
        
        // Mark slot as occupied
        slot.classList.add('occupied');
        slot.classList.remove('highlight');
        
        // Create a copy of the piece in the slot
        const pieceCopy = piece.cloneNode(true);
        pieceCopy.classList.remove('used', 'dragging');
        pieceCopy.draggable = false;
        slot.appendChild(pieceCopy);
        
        // Store placement data
        slot.dataset.pieceId = piece.dataset.pieceId;
        
        this.placedPieces++;
        this.updateProgress();
    }
    
    checkPuzzleCompletion() {
        if (this.placedPieces >= this.totalPieces) {
            this.completePuzzle();
        } else {
            const remaining = this.totalPieces - this.placedPieces;
            this.showFeedback(`Masih ada ${remaining} kepingan puzzle lagi!`, 'info');
        }
    }
    
    completePuzzle() {
        this.gameCompleted = true;
        
        // Show completion message
        this.showFeedback('Selamat! Puzzle berhasil diselesaikan!', 'success');
        
        // Show zone reward
        this.showZoneReward('puzzle');
        
        // Play completion sound
        this.playSound('puzzle-complete');
        
        // Add delay before showing success popup
        setTimeout(() => {
            this.showVictoryAnimation();
        }, 2000);
        
        // Unlock energy game
        this.unlockEnergyGame();
    }
    
    showZoneReward(zoneId) {
        const reward = document.querySelector(`#${zoneId}-reward`);
        if (reward) {
            reward.classList.remove('hidden');
            
            // Add sparkle animation
            this.addSparkleEffect(reward);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                reward.classList.add('hidden');
            }, 3000);
        }
    }
    
    unlockEnergyGame() {
        const energyZone = document.querySelector('.map-zone[data-zone="energy"]');
        if (energyZone) {
            energyZone.classList.add('completed');
            energyZone.classList.remove('locked');
        }
    }
    
    showVictoryAnimation() {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-animation';
        victoryDiv.innerHTML = `
            <div class="victory-glow"></div>
            <div class="victory-text">
                <h2>🎉 Puzzle Selesai! 🎉</h2>
                <p>Kamu telah berhasil menyelesaikan puzzle!<br>
                Sekarang kamu bisa masuk ke Energy Game!</p>
            </div>
        `;
        
        document.body.appendChild(victoryDiv);
        
        // Animate victory screen
        setTimeout(() => {
            victoryDiv.style.opacity = '1';
            victoryDiv.style.visibility = 'visible';
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            victoryDiv.style.opacity = '0';
            setTimeout(() => {
                victoryDiv.remove();
            }, 500);
        }, 5000);
    }
    
    updateProgress() {
        const progress = (this.placedPieces / this.totalPieces) * 100;
        
        // Update progress bar
        const meterFill = document.querySelector('.meter-fill');
        const meterValue = document.querySelector('.meter-value');
        
        if (meterFill && meterValue) {
            meterFill.style.width = `${progress}%`;
            meterValue.textContent = `${Math.round(progress)}%`;
        }
    }
    
    updateHUD() {
        // Update progress
        this.updateProgress();
    }
    
    showAICursor(targetElement) {
        if (!targetElement) return;
        
        this.aiCursorActive = true;
        let cursor = document.querySelector('.ai-cursor');
        
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'ai-cursor';
            cursor.innerHTML = `
                <div class="cursor-glow"></div>
                <div class="cursor-pointer">👆</div>
            `;
            document.body.appendChild(cursor);
        }
        
        cursor.classList.remove('hidden');
        
        const rect = targetElement.getBoundingClientRect();
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
    }
    
    hideAICursor() {
        this.aiCursorActive = false;
        const cursor = document.querySelector('.ai-cursor');
        if (cursor) {
            cursor.classList.add('hidden');
        }
    }
    
    createAICursor() {
        const cursor = document.createElement('div');
        cursor.className = 'ai-cursor hidden';
        cursor.innerHTML = `
            <div class="cursor-glow"></div>
            <div class="cursor-pointer">👆</div>
        `;
        document.body.appendChild(cursor);
    }
    
    addSparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '2em';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = `${rect.left + rect.width / 2}px`;
        sparkle.style.top = `${rect.top}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
    
    showFeedback(message, type = 'info') {
        const container = document.getElementById('feedback-container');
        if (!container) {
            const feedbackContainer = document.createElement('div');
            feedbackContainer.id = 'feedback-container';
            document.body.appendChild(feedbackContainer);
        }
        
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        document.getElementById('feedback-container').appendChild(feedback);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => {
                feedback.remove();
            }, 500);
        }, 3000);
    }
    
    playSound(soundType) {
        // Sound effects would be implemented here
        // For now, we'll use console.log to indicate sound events
        console.log(`🔊 Playing sound: ${soundType}`);
        
        // You can add actual audio implementation here:
        // const audio = new Audio(`sounds/${soundType}.mp3`);
        // audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    getZoneName(zoneId) {
        const names = {
            puzzle: 'Puzzle Zone',
            energy: 'Energy Game'
        };
        return names[zoneId] || zoneId;
    }
    
    startBackgroundAnimations() {
        // Add CSS animation for sparkle float
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PuzzleGame();
    
    // Make game instance globally available for debugging
    window.puzzleGame = game;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PuzzleGame;
}