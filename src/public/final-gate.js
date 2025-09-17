// Final Gate JavaScript
class FinalGate {
    constructor() {
        this.gameState = null;
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.quizStarted = false;
        this.quizCompleted = false;
        
        // Quiz questions about electrical energy and efficiency
        this.questions = [
            {
                question: "Apa yang dimaksud dengan efisiensi energi listrik?",
                answers: [
                    "Menggunakan listrik sebanyak-banyaknya",
                    "Menggunakan listrik sesuai kebutuhan tanpa pemborosan",
                    "Mematikan semua peralatan listrik",
                    "Menggunakan listrik hanya di malam hari"
                ],
                correct: 1,
                explanation: "Efisiensi energi listrik adalah menggunakan listrik sesuai kebutuhan tanpa pemborosan untuk menghemat energi dan biaya."
            },
            {
                question: "Manakah peralatan rumah tangga yang paling boros listrik?",
                answers: [
                    "Lampu LED 10 watt",
                    "Kipas angin 50 watt",
                    "AC 1000 watt",
                    "Charger HP 5 watt"
                ],
                correct: 2,
                explanation: "AC (Air Conditioner) menggunakan daya listrik paling besar dibanding peralatan lainnya, sekitar 1000 watt atau lebih."
            },
            {
                question: "Apa keuntungan menggunakan lampu LED dibanding lampu pijar?",
                answers: [
                    "Lebih terang saja",
                    "Lebih murah harganya",
                    "Lebih hemat energi dan tahan lama",
                    "Tidak ada perbedaan"
                ],
                correct: 2,
                explanation: "Lampu LED menggunakan energi 80% lebih sedikit dan bertahan 25 kali lebih lama dibanding lampu pijar."
            },
            {
                question: "Mengapa kita perlu mencabut charger dari stop kontak setelah selesai mengisi daya?",
                answers: [
                    "Supaya charger tidak rusak",
                    "Charger tetap mengonsumsi listrik meski tidak digunakan",
                    "Untuk mencegah kebakaran",
                    "Tidak perlu dicabut"
                ],
                correct: 1,
                explanation: "Charger yang tetap terpasang di stop kontak mengonsumsi listrik sekitar 0.1-0.5 watt meski tidak mengisi daya (phantom load)."
            },
            {
                question: "Apa yang dimaksud dengan 'phantom load' atau beban hantu?",
                answers: [
                    "Listrik yang hilang karena hantu",
                    "Konsumsi listrik peralatan dalam mode standby",
                    "Listrik yang bocor dari kabel",
                    "Listrik yang tidak terukur meteran"
                ],
                correct: 1,
                explanation: "Phantom load adalah konsumsi listrik oleh peralatan elektronik yang dalam kondisi standby atau mati tapi masih terhubung ke listrik."
            },
            {
                question: "Berapa persen energi listrik yang bisa dihemat dengan mematikan peralatan yang tidak digunakan?",
                answers: [
                    "5-10%",
                    "10-15%",
                    "15-25%",
                    "30-40%"
                ],
                correct: 2,
                explanation: "Mematikan peralatan yang tidak digunakan dapat menghemat 15-25% konsumsi listrik rumah tangga."
            },
            {
                question: "Manakah cara terbaik menggunakan AC agar hemat listrik?",
                answers: [
                    "Set suhu 16°C agar cepat dingin",
                    "Set suhu 24-26°C dan gunakan timer",
                    "Nyalakan AC 24 jam non-stop",
                    "Set suhu 30°C"
                ],
                correct: 1,
                explanation: "Suhu 24-26°C adalah suhu optimal yang nyaman dan hemat energi. Setiap penurunan 1°C meningkatkan konsumsi listrik 6-8%."
            },
            {
                question: "Apa dampak positif penghematan energi listrik terhadap lingkungan?",
                answers: [
                    "Tidak ada dampak",
                    "Mengurangi emisi gas rumah kaca",
                    "Membuat listrik lebih mahal",
                    "Mengurangi kualitas udara"
                ],
                correct: 1,
                explanation: "Penghematan listrik mengurangi kebutuhan pembangkit listrik, sehingga mengurangi emisi CO2 dan gas rumah kaca lainnya."
            }
        ];
        
        this.totalQuestions = this.questions.length;
        this.init();
    }
    
    async init() {
        try {
            // Load global game state
            if (typeof GlobalGameState !== 'undefined') {
                this.gameState = new GlobalGameState();
                await this.gameState.loadGameData();
            }
            
            this.setupEventListeners();
            this.displayEnergyKeys();
            this.checkGateStatus();
            this.setupAudio();
            
        } catch (error) {
            console.error('Error initializing Final Gate:', error);
            this.showFallbackMode();
        }
    }

    show() {
        // Show the final gate scene
        const finalGateElement = document.querySelector('.final-gate-container');
        if (finalGateElement) {
            finalGateElement.style.display = 'block';
            finalGateElement.style.opacity = '1';
        }

        // Initialize narrative system if available
        if (window.narrativeSystem) {
            window.narrativeSystem.triggerNarrative('final_gate');
        }
    }

    hide() {
        // Hide the final gate scene
        const finalGateElement = document.querySelector('.final-gate-container');
        if (finalGateElement) {
            finalGateElement.style.opacity = '0';
            setTimeout(() => {
                finalGateElement.style.display = 'none';
            }, 500);
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('back-to-menu')?.addEventListener('click', () => {
            this.goToMainMenu();
        });
        
        document.getElementById('show-progress')?.addEventListener('click', () => {
            this.showProgressModal();
        });
        
        // Quiz controls
        document.getElementById('start-quiz')?.addEventListener('click', () => {
            this.startQuiz();
        });
        
        document.getElementById('next-question')?.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        document.getElementById('submit-answer')?.addEventListener('click', () => {
            this.submitAnswer();
        });
        
        document.getElementById('restart-quiz')?.addEventListener('click', () => {
            this.restartQuiz();
        });
        
        document.getElementById('complete-game')?.addEventListener('click', () => {
            this.completeGame();
        });
        
        // Modal controls
        document.getElementById('close-progress')?.addEventListener('click', () => {
            this.closeProgressModal();
        });
        
        // Answer selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-option')) {
                this.selectAnswer(e.target);
            }
        });
    }
    
    displayEnergyKeys() {
        const keysGrid = document.querySelector('.keys-grid');
        if (!keysGrid) return;
        
        const keyTypes = [
            { id: 'living-room', name: 'Ruang Tamu', icon: 'fas fa-lightbulb' },
            { id: 'kitchen', name: 'Dapur', icon: 'fas fa-fire' },
            { id: 'laboratory', name: 'Laboratorium', icon: 'fas fa-flask' },
            { id: 'basement', name: 'Ruang Bawah Tanah', icon: 'fas fa-cog' }
        ];
        
        keysGrid.innerHTML = '';
        
        keyTypes.forEach(keyType => {
            const keySlot = document.createElement('div');
            keySlot.className = 'key-slot';
            keySlot.id = `key-${keyType.id}`;
            
            // Check if key is collected
            const isCollected = this.gameState ? 
                this.gameState.hasEnergyKey(keyType.id) : 
                this.checkKeyFromStorage(keyType.id);
            
            if (isCollected) {
                keySlot.classList.add('collected');
            }
            
            keySlot.innerHTML = `
                <i class="${keyType.icon}"></i>
                <span>${keyType.name}</span>
            `;
            
            keysGrid.appendChild(keySlot);
        });
    }
    
    checkKeyFromStorage(keyId) {
        // Fallback method to check keys from localStorage
        try {
            const gameData = JSON.parse(localStorage.getItem('energyQuestGameData') || '{}');
            return gameData.energyKeys && gameData.energyKeys.includes(keyId);
        } catch {
            return false;
        }
    }
    
    checkGateStatus() {
        const collectedKeys = this.getCollectedKeysCount();
        const requiredKeys = 4;
        
        const gateMessage = document.querySelector('.gate-message');
        const gateDoor = document.querySelector('.gate-door');
        const gateLock = document.querySelector('.gate-lock');
        const energyBeam = document.querySelector('.energy-beam');
        const startQuizBtn = document.getElementById('start-quiz');
        
        if (collectedKeys >= requiredKeys) {
            // Gate is unlocked
            if (gateMessage) {
                gateMessage.innerHTML = `
                    <h2>Gerbang Terbuka!</h2>
                    <p>Selamat! Anda telah mengumpulkan semua ${requiredKeys} Kunci Energi.</p>
                    <p>Sekarang Anda dapat memasuki Evaluasi Akhir untuk mengungkap misteri ilmuwan yang hilang.</p>
                `;
            }
            
            if (gateDoor) gateDoor.classList.add('unlocked');
            if (gateLock) {
                gateLock.classList.add('unlocked');
                gateLock.innerHTML = '<i class="fas fa-unlock"></i>';
            }
            if (energyBeam) energyBeam.classList.add('active');
            if (startQuizBtn) startQuizBtn.style.display = 'block';
            
            this.playUnlockSound();
            
        } else {
            // Gate is locked
            if (gateMessage) {
                gateMessage.innerHTML = `
                    <h2>Gerbang Terkunci</h2>
                    <p>Anda memerlukan ${requiredKeys} Kunci Energi untuk membuka gerbang ini.</p>
                    <p>Kunci terkumpul: <span style="color: #00ff88">${collectedKeys}</span> / ${requiredKeys}</p>
                    <p>Selesaikan puzzle di semua ruangan untuk mendapatkan kunci yang tersisa.</p>
                `;
            }
            
            if (startQuizBtn) startQuizBtn.style.display = 'none';
        }
    }
    
    getCollectedKeysCount() {
        if (this.gameState) {
            return this.gameState.getCollectedKeysCount();
        }
        
        // Fallback method
        const keySlots = document.querySelectorAll('.key-slot.collected');
        return keySlots.length;
    }
    
    startQuiz() {
        this.quizStarted = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedAnswer = null;
        
        // Hide gate status and show quiz
        document.querySelector('.gate-status').style.display = 'none';
        document.querySelector('.quiz-section').style.display = 'block';
        
        this.displayQuestion();
        this.updateQuizProgress();
        
        this.playQuizStartSound();
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;
        
        // Update question text
        document.getElementById('question-text').textContent = question.question;
        
        // Update answers
        const answersGrid = document.querySelector('.answers-grid');
        answersGrid.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.dataset.index = index;
            answerDiv.textContent = answer;
            answersGrid.appendChild(answerDiv);
        });
        
        // Reset selected answer
        this.selectedAnswer = null;
        document.getElementById('submit-answer').disabled = true;
        document.getElementById('next-question').style.display = 'none';
    }
    
    selectAnswer(answerElement) {
        // Remove previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select new answer
        answerElement.classList.add('selected');
        this.selectedAnswer = parseInt(answerElement.dataset.index);
        
        // Enable submit button
        document.getElementById('submit-answer').disabled = false;
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // Show correct/incorrect feedback
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
        });
        
        // Update score
        if (isCorrect) {
            this.correctAnswers++;
            this.score += 100;
            this.playCorrectSound();
        } else {
            this.playIncorrectSound();
        }
        
        // Show explanation
        this.showQuestionExplanation(question.explanation, isCorrect);
        
        // Hide submit button, show next button
        document.getElementById('submit-answer').style.display = 'none';
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            document.getElementById('next-question').style.display = 'block';
        } else {
            // Quiz completed
            setTimeout(() => {
                this.completeQuiz();
            }, 3000);
        }
        
        this.updateQuizProgress();
    }
    
    showQuestionExplanation(explanation, isCorrect) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'question-explanation';
        explanationDiv.style.cssText = `
            background: ${isCorrect ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)'};
            border: 2px solid ${isCorrect ? '#00ff88' : '#ff4444'};
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            color: #fff;
        `;
        explanationDiv.innerHTML = `
            <strong>${isCorrect ? 'Benar!' : 'Salah!'}</strong><br>
            ${explanation}
        `;
        
        document.querySelector('.question-container').appendChild(explanationDiv);
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        // Remove explanation
        const explanation = document.querySelector('.question-explanation');
        if (explanation) explanation.remove();
        
        // Reset answer options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
            option.style.pointerEvents = 'auto';
        });
        
        // Show submit button, hide next button
        document.getElementById('submit-answer').style.display = 'block';
        document.getElementById('next-question').style.display = 'none';
        
        this.displayQuestion();
        this.updateQuizProgress();
    }
    
    updateQuizProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.getElementById('question-counter').textContent = 
            `Pertanyaan ${this.currentQuestionIndex + 1} dari ${this.totalQuestions}`;
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('correct-count').textContent = this.correctAnswers;
    }
    
    completeQuiz() {
        this.quizCompleted = true;
        
        // Hide quiz section, show results
        document.querySelector('.quiz-section').style.display = 'none';
        document.querySelector('.results-section').style.display = 'block';
        
        // Calculate final score percentage
        const percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        
        // Display results
        document.getElementById('final-score').textContent = percentage;
        document.getElementById('correct-answers').textContent = this.correctAnswers;
        document.getElementById('total-questions').textContent = this.totalQuestions;
        document.getElementById('final-points').textContent = this.score;
        
        // Show mystery revelation based on score
        this.showMysteryRevelation(percentage);
        
        // Save completion to game state
        if (this.gameState) {
            this.gameState.completeGame(this.score, percentage);
            this.gameState.saveGameData();
        }
        
        this.playCompletionSound();
    }
    
    showMysteryRevelation(percentage) {
        const revelationDiv = document.querySelector('.mystery-revelation');
        let revelationContent = '';
        
        if (percentage >= 80) {
            revelationContent = `
                <h3>Misteri Terpecahkan!</h3>
                <p>Selamat! Dengan pemahaman yang luar biasa tentang efisiensi energi, Anda berhasil mengungkap kebenaran di balik hilangnya Dr. Elektron.</p>
                <div class="scientist-message">
                    <p><strong>Pesan Dr. Elektron:</strong></p>
                    <p>"Terima kasih telah menyelamatkan saya! Saya sengaja menyembunyikan diri untuk menguji apakah ada yang benar-benar memahami pentingnya efisiensi energi. Anda telah membuktikan bahwa generasi muda peduli dengan masa depan energi bumi."</p>
                </div>
                <p>Dr. Elektron muncul dari ruang rahasia di basement, tersenyum bangga melihat dedikasi Anda dalam mempelajari efisiensi energi listrik.</p>
            `;
        } else if (percentage >= 60) {
            revelationContent = `
                <h3>Misteri Hampir Terpecahkan</h3>
                <p>Anda telah menunjukkan pemahaman yang baik tentang efisiensi energi. Dr. Elektron mulai muncul dari persembunyiannya.</p>
                <div class="scientist-message">
                    <p><strong>Dr. Elektron:</strong></p>
                    <p>"Bagus! Anda sudah memahami dasar-dasar efisiensi energi. Namun, masih ada yang perlu dipelajari. Teruslah belajar tentang penghematan energi untuk masa depan yang lebih baik."</p>
                </div>
                <p>Meskipun belum sempurna, usaha Anda telah membuka jalan untuk menemukan Dr. Elektron.</p>
            `;
        } else {
            revelationContent = `
                <h3>Misteri Belum Terpecahkan</h3>
                <p>Pemahaman Anda tentang efisiensi energi masih perlu ditingkatkan. Dr. Elektron masih bersembunyi, menunggu seseorang yang benar-benar memahami pentingnya penghematan energi.</p>
                <div class="scientist-message">
                    <p><strong>Suara Dr. Elektron dari kejauhan:</strong></p>
                    <p>"Belajarlah lebih dalam tentang efisiensi energi. Masa depan bumi bergantung pada pemahaman kita tentang penghematan listrik. Coba lagi setelah Anda mempelajari lebih banyak!"</p>
                </div>
                <p>Jangan menyerah! Pelajari lebih lanjut tentang efisiensi energi dan coba lagi.</p>
            `;
        }
        
        revelationDiv.innerHTML = `
            <div class="revelation-content">
                ${revelationContent}
            </div>
        `;
    }
    
    restartQuiz() {
        // Reset quiz state
        this.quizStarted = false;
        this.quizCompleted = false;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedAnswer = null;
        
        // Show gate status, hide quiz and results
        document.querySelector('.gate-status').style.display = 'block';
        document.querySelector('.quiz-section').style.display = 'none';
        document.querySelector('.results-section').style.display = 'none';
        
        // Reset quiz controls
        document.getElementById('submit-answer').style.display = 'block';
        document.getElementById('next-question').style.display = 'none';
    }
    
    completeGame() {
        if (this.gameState) {
            this.gameState.showNotification('Game Completed!', 'success');
        }
        
        // Return to main menu with completion flag
        setTimeout(() => {
            this.goToMainMenu();
        }, 2000);
    }
    
    goToMainMenu() {
        window.location.href = 'main-menu.html';
    }
    
    showProgressModal() {
        const modal = document.getElementById('progress-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.updateProgressDetails();
        }
    }
    
    closeProgressModal() {
        const modal = document.getElementById('progress-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    updateProgressDetails() {
        const progressDetails = document.querySelector('.progress-details');
        if (!progressDetails) return;
        
        const gameData = this.gameState ? this.gameState.getGameData() : this.getFallbackGameData();
        
        progressDetails.innerHTML = `
            <div class="progress-item">
                <span>Kunci Energi Terkumpul:</span>
                <span>${gameData.energyKeys.length}/4</span>
            </div>
            <div class="progress-item">
                <span>Level Diselesaikan:</span>
                <span>${gameData.completedLevels.length}/4</span>
            </div>
            <div class="progress-item">
                <span>Puzzle Diselesaikan:</span>
                <span>${gameData.completedPuzzles.length}</span>
            </div>
            <div class="progress-item">
                <span>Total Skor:</span>
                <span>${gameData.totalScore}</span>
            </div>
            <div class="progress-item">
                <span>Waktu Bermain:</span>
                <span>${this.formatPlayTime(gameData.playTime)}</span>
            </div>
        `;
    }
    
    getFallbackGameData() {
        try {
            return JSON.parse(localStorage.getItem('energyQuestGameData') || '{}');
        } catch {
            return {
                energyKeys: [],
                completedLevels: [],
                completedPuzzles: [],
                totalScore: 0,
                playTime: 0
            };
        }
    }
    
    formatPlayTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}j ${minutes}m ${secs}d`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}d`;
        } else {
            return `${secs}d`;
        }
    }
    
    setupAudio() {
        // Setup audio elements
        this.backgroundMusic = document.getElementById('background-music');
        this.unlockSound = document.getElementById('unlock-sound');
        this.quizStartSound = document.getElementById('quiz-start-sound');
        this.correctSound = document.getElementById('correct-sound');
        this.incorrectSound = document.getElementById('incorrect-sound');
        this.completionSound = document.getElementById('completion-sound');
        
        // Start background music
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
            this.backgroundMusic.play().catch(e => console.log('Audio autoplay prevented'));
        }
    }
    
    playUnlockSound() {
        if (this.unlockSound) {
            this.unlockSound.currentTime = 0;
            this.unlockSound.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    playQuizStartSound() {
        if (this.quizStartSound) {
            this.quizStartSound.currentTime = 0;
            this.quizStartSound.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    playCorrectSound() {
        if (this.correctSound) {
            this.correctSound.currentTime = 0;
            this.correctSound.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    playIncorrectSound() {
        if (this.incorrectSound) {
            this.incorrectSound.currentTime = 0;
            this.incorrectSound.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    playCompletionSound() {
        if (this.completionSound) {
            this.completionSound.currentTime = 0;
            this.completionSound.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    showFallbackMode() {
        // Show basic functionality even if GlobalGameState is not available
        console.log('Running in fallback mode');
        
        // Simulate some collected keys for demo
        const demoKeys = ['living-room', 'kitchen'];
        demoKeys.forEach(keyId => {
            const keySlot = document.getElementById(`key-${keyId}`);
            if (keySlot) keySlot.classList.add('collected');
        });
        
        this.checkGateStatus();
    }
}

// Initialize Final Gate when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.finalGate = new FinalGate();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (window.finalGate && window.finalGate.backgroundMusic) {
        if (document.hidden) {
            window.finalGate.backgroundMusic.pause();
        } else {
            window.finalGate.backgroundMusic.play().catch(e => console.log('Audio resume failed'));
        }
    }
});