// Scene 5 Level 4: Evaluasi Akhir Ruang Bawah Tanah JavaScript - Quiz System

class Scene5Level4 {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.skippedQuestions = 0;
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.timeStarted = Date.now();
        this.selectedAnswer = null;
        this.gameState = 'playing'; // playing, completed
        this.energyKeys = 4; // From previous levels
        
        // Database pertanyaan kuis
        this.questions = [
            {
                id: 1,
                category: "Rangkaian Dasar",
                question: "Dalam rangkaian seri, jika satu lampu rusak, apa yang akan terjadi?",
                image: null,
                options: [
                    "Lampu lain tetap menyala normal",
                    "Semua lampu akan mati",
                    "Lampu lain akan menjadi lebih terang",
                    "Hanya lampu yang berdekatan yang akan mati"
                ],
                correct: 1,
                explanation: "Dalam rangkaian seri, arus hanya memiliki satu jalur. Jika salah satu komponen rusak, seluruh rangkaian akan terputus dan semua perangkat akan berhenti bekerja. Inilah mengapa rangkaian rumah biasanya menggunakan koneksi paralel.",
                points: 10
            },
            {
                id: 2,
                category: "Efisiensi Energi",
                question: "Manakah dari praktik berikut yang paling efektif untuk menghemat listrik rumah tangga?",
                image: null,
                options: [
                    "Menyalakan semua lampu di siang hari",
                    "Memanfaatkan cahaya alami secara maksimal, mematikan perangkat yang tidak perlu",
                    "Membiarkan perangkat dalam mode standby",
                    "Menggunakan perangkat dengan daya lebih besar"
                ],
                correct: 1,
                explanation: "Memanfaatkan cahaya alami dapat mengurangi penggunaan listrik untuk penerangan, mematikan perangkat yang tidak perlu dapat menghindari konsumsi daya standby. Kebiasaan sederhana ini dapat secara signifikan mengurangi tagihan listrik rumah tangga.",
                points: 15
            },
            {
                id: 3,
                category: "Perhitungan Tagihan Listrik",
                question: "Sebuah AC 1000W digunakan 8 jam setiap hari, dengan tarif listrik Rp2.250/kWh, berapa biaya listrik untuk satu bulan (30 hari)?",
                image: null,
                options: [
                    "Rp540.000",
                    "Rp540.000",
                    "Rp720.000",
                    "Rp900.000"
                ],
                correct: 1,
                explanation: "Proses perhitungan: 1000W × 8 jam × 30 hari = 240.000Wh = 240kWh, 240kWh × Rp2.250/kWh = Rp540.000. Memahami perhitungan tagihan listrik membantu perencanaan penggunaan listrik yang wajar.",
                points: 20
            },
            {
                id: 4,
                category: "Keamanan Listrik",
                question: "Ketika menemukan perangkat listrik mengeluarkan asap, apa cara penanganan yang benar?",
                image: null,
                options: [
                    "Segera padamkan dengan air",
                    "Terus gunakan sambil mengamati situasi",
                    "Segera putuskan aliran listrik dan menjauh, gunakan alat pemadam bubuk kering jika perlu",
                    "Buka jendela untuk ventilasi"
                ],
                correct: 2,
                explanation: "Perangkat listrik yang mengeluarkan asap mungkin merupakan tanda korsleting atau panas berlebih, sangat berbahaya. Harus segera memutus aliran listrik untuk mencegah kebakaran, jangan pernah gunakan air untuk memadamkan kebakaran listrik karena air menghantarkan listrik dan dapat menyebabkan bahaya sengatan listrik.",
                points: 25
            },
            {
                id: 5,
                category: "Energi Terbarukan",
                question: "Apa keunggulan utama dari pembangkit listrik tenaga surya?",
                image: null,
                options: [
                    "Hanya bisa digunakan di siang hari",
                    "Bersih dan terbarukan, mengurangi emisi karbon",
                    "Biayanya sangat tinggi",
                    "Efisiensinya sangat rendah"
                ],
                correct: 1,
                explanation: "Tenaga surya adalah energi terbarukan yang bersih, tidak menghasilkan polutan dan gas rumah kaca. Meskipun investasi awal cukup tinggi, dalam jangka panjang merupakan pilihan energi yang ramah lingkungan dan ekonomis.",
                points: 15
            },
            {
                id: 6,
                category: "Penggunaan Listrik Cerdas",
                question: "Apa keunggulan utama meteran listrik pintar dibandingkan meteran tradisional?",
                image: null,
                options: [
                    "Hanya tampilan yang lebih bagus",
                    "Dapat memantau penggunaan listrik secara real-time, membantu mengoptimalkan kebiasaan penggunaan listrik",
                    "Penggunaan listrik akan berkurang otomatis",
                    "Tagihan listrik akan turun otomatis"
                ],
                correct: 1,
                explanation: "Meteran listrik pintar dapat menampilkan data penggunaan listrik secara real-time, membantu pengguna memahami pola penggunaan listrik di berbagai waktu, sehingga dapat menyesuaikan kebiasaan penggunaan listrik untuk mencapai penghematan energi dan pengurangan emisi.",
                points: 15
            }
        ];
        
        this.totalQuestions = this.questions.length;
        
        // Knowledge base untuk konten edukasi
        this.knowledgeBase = {
            circuits: {
                title: "Pengetahuan Dasar Rangkaian",
                content: `
                    <p><strong>Rangkaian Seri:</strong> Arus hanya memiliki satu jalur, komponen terhubung berurutan.</p>
                    <ul>
                        <li>Arus sama di semua titik</li>
                        <li>Tegangan terbagi ke setiap komponen</li>
                        <li>Jika satu komponen rusak, seluruh rangkaian terputus</li>
                    </ul>
                    <p><strong>Rangkaian Paralel:</strong> Arus memiliki beberapa jalur, setiap komponen bekerja independen.</p>
                    <ul>
                        <li>Tegangan sama di semua titik</li>
                        <li>Arus terbagi ke setiap cabang</li>
                        <li>Jika satu komponen rusak, komponen lain tetap bekerja normal</li>
                    </ul>
                `
            },
            efficiency: {
                title: "Efisiensi Energi",
                content: `
                    <p><strong>Tips Hemat Energi:</strong></p>
                    <ul>
                        <li>Manfaatkan cahaya alami secara maksimal, kurangi penerangan buatan</li>
                        <li>Matikan peralatan listrik yang tidak digunakan</li>
                        <li>Pilih peralatan listrik hemat energi</li>
                        <li>Atur suhu AC secara wajar</li>
                        <li>Bersihkan peralatan listrik secara rutin, jaga sirkulasi udara yang baik</li>
                    </ul>
                    <p><strong>Konsumsi Daya Standby:</strong> Banyak peralatan listrik masih mengonsumsi daya saat dalam mode standby, yang jika diakumulasi tidak dapat diabaikan.</p>
                `
            },
            calculation: {
                title: "Perhitungan Tagihan Listrik",
                content: `
                    <p><strong>Rumus Dasar:</strong></p>
                    <p>Konsumsi Listrik (kWh) = Daya (kW) × Waktu (jam)</p>
                    <p>Tagihan Listrik = Konsumsi Listrik (kWh) × Tarif Listrik (Rp/kWh)</p>
                    <p><strong>Contoh:</strong></p>
                    <p>Lampu 100W digunakan selama 10 jam:</p>
                    <p>Konsumsi Listrik = 0,1kW × 10jam = 1kWh</p>
                    <p>Tagihan Listrik = 1kWh × Rp1.500/kWh = Rp1.500</p>
                `
            },
            safety: {
                title: "Keamanan Penggunaan Listrik",
                content: `
                    <p><strong>Prinsip Dasar:</strong></p>
                    <ul>
                        <li>Jangan menyentuh saklar listrik dengan tangan basah</li>
                        <li>Jangan menggunakan stopkontak melebihi kapasitas</li>
                        <li>Periksa kabel listrik secara rutin apakah sudah usang</li>
                        <li>Gunakan produk listrik yang berkualitas</li>
                    </ul>
                    <p><strong>Penanganan Situasi Darurat:</strong></p>
                    <ul>
                        <li>Jika terjadi kebocoran listrik: segera matikan aliran listrik</li>
                        <li>Jika peralatan listrik terbakar: matikan listrik lalu gunakan alat pemadam api kering</li>
                        <li>Jika terjadi kecelakaan tersengat listrik: matikan listrik terlebih dahulu baru lakukan pertolongan</li>
                    </ul>
                `
            }
        };
        
        // Audio elements
        this.audio = {
            background: null,
            correct: null,
            wrong: null,
            complete: null,
            click: null
        };
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupEventListeners();
        this.updateHUD();
        this.loadQuestion();
        this.startTimer();
        
        // Show welcome message
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 500);
    }
    
    setupAudio() {
        try {
            // Use correct path for background music
            this.audio.background = new Audio('public/audio/background_music.mp3');
            this.audio.background.loop = true;
            this.audio.background.volume = 0.3;
            
            // Setup dramatic sound
            this.audio.dramatic = new Audio('public/audio/dramatic_sound.mp3');
            this.audio.dramatic.volume = 0.5;
            
            this.audio.correct = new Audio('public/audio/sfx_correct.wav');
            this.audio.wrong = new Audio('public/audio/sfx_wrong.wav');
            this.audio.complete = new Audio('public/audio/level_complete.mp3');
            this.audio.click = new Audio('public/audio/sfx_click.wav');
            
            // Start background music
            this.audio.background.play().catch(e => {
                console.log('Audio autoplay prevented:', e);
                // Play on first user interaction
                document.addEventListener('click', () => {
                    this.audio.background.play();
                }, { once: true });
            });
        } catch (error) {
            console.log('Audio setup failed:', error);
        }
    }

    playDramaticSound() {
        if (this.audio.dramatic) {
            this.audio.dramatic.currentTime = 0;
            this.audio.dramatic.play().catch(e => {
                console.log('Dramatic sound play failed:', e);
            });
        }
    }
    
    setupEventListeners() {
        // Answer option clicks
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            option.addEventListener('click', () => this.selectAnswer(index));
        });
        
        // Control buttons
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('skip-question').addEventListener('click', () => this.skipQuestion());
        document.getElementById('use-hint').addEventListener('click', () => this.showHintPopup());
        
        // Knowledge items
        document.querySelectorAll('.knowledge-item').forEach(item => {
            item.addEventListener('click', () => {
                const topic = item.dataset.topic;
                this.showKnowledgePopup(topic);
            });
        });
        
        // Popup close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('knowledge-close')) {
                this.closeKnowledgePopup();
            }
            if (e.target.classList.contains('next-btn')) {
                this.nextQuestion();
            }
            if (e.target.classList.contains('use-hint-btn')) {
                this.useHint();
            }
            if (e.target.classList.contains('cancel-hint-btn')) {
                this.closeHintPopup();
            }
        });
        
        // Final result buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('restart-quiz')) {
                this.restartQuiz();
            }
            if (e.target.classList.contains('return-menu')) {
                this.returnToMenu();
            }
        });
    }
    
    updateHUD() {
        // Update progress
        const progressPercent = (this.currentQuestionIndex / this.totalQuestions) * 100;
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
        document.querySelector('.progress-fill').textContent = `${Math.round(progressPercent)}%`;
        document.querySelector('.progress-text').textContent = 
            `Soal ${this.currentQuestionIndex + 1} / ${this.totalQuestions}`;
        
        // Update score
        document.querySelector('.score-display span:first-child').textContent = this.score;
        
        // Update score breakdown
        document.querySelector('.score-item:nth-child(1) span:last-child').textContent = this.correctAnswers;
        document.querySelector('.score-item:nth-child(2) span:last-child').textContent = this.wrongAnswers;
        document.querySelector('.score-item:nth-child(3) span:last-child').textContent = this.skippedQuestions;
        
        // Update energy keys
        const keyElements = document.querySelectorAll('.energy-key');
        keyElements.forEach((key, index) => {
            if (index < this.energyKeys) {
                key.style.opacity = '1';
                key.innerHTML = '🔑';
            } else {
                key.style.opacity = '0.3';
                key.innerHTML = '🔒';
            }
        });
        
        // Update hint button
        const hintBtn = document.getElementById('use-hint');
        const hintsLeft = this.maxHints - this.hintsUsed;
        hintBtn.querySelector('.hint-text').textContent = `Petunjuk (${hintsLeft})`;
        hintBtn.disabled = hintsLeft <= 0;
        
        // Update timer
        const elapsed = Math.floor((Date.now() - this.timeStarted) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.querySelector('.timer-display span:last-child').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    loadQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.completeQuiz();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question header
        document.querySelector('.question-number').textContent = 
            `Soal ${this.currentQuestionIndex + 1}`;
        document.querySelector('.question-category').textContent = question.category;
        
        // Update question content
        document.querySelector('.question-text').textContent = question.question;
        
        // Handle question image
        const imageContainer = document.querySelector('.question-image');
        if (question.image) {
            imageContainer.innerHTML = `<img src="${question.image}" alt="Question illustration">`;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.style.display = 'none';
        }
        
        // Update answer options
        const optionElements = document.querySelectorAll('.answer-option');
        optionElements.forEach((option, index) => {
            if (index < question.options.length) {
                option.style.display = 'block';
                option.querySelector('.option-letter').textContent = String.fromCharCode(65 + index);
                option.querySelector('.option-text').textContent = question.options[index];
                option.classList.remove('selected', 'correct', 'wrong');
            } else {
                option.style.display = 'none';
            }
        });
        
        // Reset selection
        this.selectedAnswer = null;
        document.getElementById('submit-answer').disabled = true;
        
        // Hide feedback
        document.querySelector('.answer-feedback').style.display = 'none';
        
        // Play question load sound
        if (this.audio.click) {
            this.audio.click.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    selectAnswer(index) {
        // Clear previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select new answer
        const selectedOption = document.querySelectorAll('.answer-option')[index];
        selectedOption.classList.add('selected');
        this.selectedAnswer = index;
        
        // Enable submit button
        document.getElementById('submit-answer').disabled = false;
        
        // Play click sound
        if (this.audio.click) {
            this.audio.click.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // Update statistics
        if (isCorrect) {
            this.correctAnswers++;
            this.score += question.points;
        } else {
            this.wrongAnswers++;
        }
        
        // Show visual feedback
        this.showAnswerFeedback(isCorrect, question);
        
        // Play audio feedback
        if (isCorrect && this.audio.correct) {
            this.audio.correct.play().catch(e => console.log('Audio play failed'));
        } else if (!isCorrect && this.audio.wrong) {
            this.audio.wrong.play().catch(e => console.log('Audio play failed'));
        }
        
        // Update HUD
        this.updateHUD();
    }
    
    skipQuestion() {
        this.skippedQuestions++;
        this.updateHUD();
        this.nextQuestion();
        
        // Play click sound
        if (this.audio.click) {
            this.audio.click.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    showAnswerFeedback(isCorrect, question) {
        const feedback = document.querySelector('.answer-feedback');
        const feedbackContent = feedback.querySelector('.feedback-content');
        
        // Update feedback content
        const resultIcon = feedbackContent.querySelector('.feedback-icon');
        const resultTitle = feedbackContent.querySelector('.feedback-title');
        const explanation = feedbackContent.querySelector('.feedback-explanation p');
        
        if (isCorrect) {
            resultIcon.textContent = '✅';
            resultIcon.style.color = '#00ff00';
            resultTitle.textContent = 'Jawaban Benar!';
            resultTitle.style.color = '#00ff00';
        } else {
            resultIcon.textContent = '❌';
            resultIcon.style.color = '#ff4444';
            resultTitle.textContent = 'Jawaban Salah';
            resultTitle.style.color = '#ff4444';
        }
        
        explanation.textContent = question.explanation;
        
        // Show correct answer
        const optionElements = document.querySelectorAll('.answer-option');
        optionElements.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        // Show feedback overlay
        feedback.style.display = 'flex';
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
        
        // Hide feedback
        document.querySelector('.answer-feedback').style.display = 'none';
    }
    
    showHintPopup() {
        if (this.hintsUsed >= this.maxHints) return;
        
        const popup = document.querySelector('.hint-popup');
        const question = this.questions[this.currentQuestionIndex];
        
        // Generate hint based on question
        let hintText = this.generateHint(question);
        
        popup.querySelector('.hint-popup-content p').textContent = hintText;
        popup.querySelector('.hint-cost').textContent = `Menggunakan petunjuk akan mengurangi ${Math.floor(question.points * 0.3)} poin`;
        
        popup.style.display = 'flex';
    }
    
    generateHint(question) {
        const hints = {
            1: "Pikirkan karakteristik rangkaian seri: arus hanya memiliki satu jalur...",
            2: "Pertimbangkan perilaku mana yang benar-benar dapat mengurangi konsumsi listrik...",
            3: "Ingat rumus: Daya (kW) × Waktu (jam) × Tarif Listrik = Tagihan Listrik",
            4: "Kebakaran peralatan listrik tidak boleh dipadamkan dengan air, pertimbangkan keamanan terlebih dahulu...",
            5: "Pikirkan apa keunggulan utama energi terbarukan...",
            6: "Nilai inti perangkat pintar adalah menyediakan informasi dan data..."
        };
        
        return hints[question.id] || "Pikirkan dengan cermat informasi kunci dalam soal...";
    }
    
    useHint() {
        const question = this.questions[this.currentQuestionIndex];
        const penalty = Math.floor(question.points * 0.3);
        
        this.hintsUsed++;
        this.score = Math.max(0, this.score - penalty);
        
        // Show hint in question area
        const hintDisplay = document.querySelector('.hint-display');
        hintDisplay.querySelector('p').textContent = this.generateHint(question);
        hintDisplay.style.display = 'block';
        
        this.updateHUD();
        this.closeHintPopup();
        
        // Auto-hide hint after 10 seconds
        setTimeout(() => {
            hintDisplay.style.display = 'none';
        }, 10000);
    }
    
    closeHintPopup() {
        document.querySelector('.hint-popup').style.display = 'none';
    }
    
    showKnowledgePopup(topic) {
        const popup = document.querySelector('.knowledge-popup');
        const knowledge = this.knowledgeBase[topic];
        
        if (knowledge) {
            popup.querySelector('h3').textContent = knowledge.title;
            popup.querySelector('.knowledge-content').innerHTML = knowledge.content;
            popup.style.display = 'flex';
        }
    }
    
    closeKnowledgePopup() {
        document.querySelector('.knowledge-popup').style.display = 'none';
    }
    
    completeQuiz() {
        this.gameState = 'completed';
        
        // Stop background music
        if (this.audio.background) {
            this.audio.background.pause();
        }
        
        // Play completion sound and dramatic sound
        if (this.audio.complete) {
            this.audio.complete.play().catch(e => console.log('Audio play failed'));
        }
        this.playDramaticSound();
        
        // Calculate final results
        const totalTime = Math.floor((Date.now() - this.timeStarted) / 1000);
        const accuracy = this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
        const efficiency = this.hintsUsed === 0 ? 100 : Math.max(0, 100 - (this.hintsUsed * 20));
        
        // Determine performance rating
        let rating = 1;
        if (accuracy >= 90 && efficiency >= 80) rating = 5;
        else if (accuracy >= 80 && efficiency >= 60) rating = 4;
        else if (accuracy >= 70 && efficiency >= 40) rating = 3;
        else if (accuracy >= 60) rating = 2;
        
        // Show final results
        this.showFinalResults({
            totalTime,
            accuracy,
            efficiency,
            rating
        });
        
        // Award final energy key if performance is good
        if (rating >= 4) {
            this.energyKeys++;
        }
    }
    
    showFinalResults(results) {
        const resultsScreen = document.querySelector('.final-results');
        
        // Update final score
        resultsScreen.querySelector('.score-value').textContent = this.score;
        
        // Update breakdown
        const breakdownItems = resultsScreen.querySelectorAll('.breakdown-item');
        breakdownItems[0].querySelector('.breakdown-value').textContent = this.correctAnswers;
        breakdownItems[1].querySelector('.breakdown-value').textContent = this.wrongAnswers;
        breakdownItems[2].querySelector('.breakdown-value').textContent = this.skippedQuestions;
        breakdownItems[3].querySelector('.breakdown-value').textContent = this.hintsUsed;
        
        // Update performance rating
        const stars = resultsScreen.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < results.rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Update rating text
        const ratingTexts = [
            "Perlu terus berusaha",
            "Penguasaan dasar baik",
            "Performa bagus",
            "Performa sangat baik",
            "Penguasaan sempurna!"
        ];
        resultsScreen.querySelector('.rating-text').textContent = ratingTexts[results.rating - 1];
        
        // Show achievement if earned
        const achievementSection = resultsScreen.querySelector('.achievement-unlock');
        if (results.rating >= 4) {
            achievementSection.style.display = 'block';
            achievementSection.querySelector('.achievement-info h4').textContent = 
                results.rating === 5 ? "Master Energi" : "Ahli Hemat Energi";
            achievementSection.querySelector('.achievement-info p').textContent = 
                results.rating === 5 ? "Menguasai semua pengetahuan energi dengan sempurna!" : "Kemampuan manajemen energi yang sangat baik!";
        } else {
            achievementSection.style.display = 'none';
        }
        
        // Update final message
        const finalMessage = resultsScreen.querySelector('.final-message p');
        if (results.rating >= 4) {
            finalMessage.textContent = "Selamat! Anda telah menguasai pengetahuan energi yang penting dan dapat menerapkan keterampilan ini dalam kehidupan sehari-hari untuk berkontribusi pada upaya pelestarian lingkungan. Terus pertahankan semangat belajar ini!";
        } else {
            finalMessage.textContent = "Meskipun masih ada ruang untuk perbaikan, Anda telah mengambil langkah penting pertama. Disarankan untuk meninjau kembali poin-poin pengetahuan terkait dan terus belajar serta memperbaiki diri dalam praktik.";
        }
        
        // Show results screen
        resultsScreen.style.display = 'flex';
    }
    
    restartQuiz() {
        // Reset all variables
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.skippedQuestions = 0;
        this.hintsUsed = 0;
        this.timeStarted = Date.now();
        this.selectedAnswer = null;
        this.gameState = 'playing';
        
        // Hide results screen
        document.querySelector('.final-results').style.display = 'none';
        
        // Restart background music
        if (this.audio.background) {
            this.audio.background.currentTime = 0;
            this.audio.background.play().catch(e => console.log('Audio autoplay prevented'));
        }
        
        // Reload first question
        this.updateHUD();
        this.loadQuestion();
    }
    
    returnToMenu() {
        // Stop all audio
        Object.values(this.audio).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        
        // Hide scene
        document.getElementById('scene5-level4-container').style.display = 'none';
        
        // Show main menu (assuming it exists)
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        } else {
            // Fallback: reload page
            window.location.reload();
        }
    }
    
    startTimer() {
        setInterval(() => {
            if (this.gameState === 'playing') {
                this.updateHUD();
            }
        }, 1000);
    }
    
    showWelcomeMessage() {
        // Create welcome overlay
        const welcomeOverlay = document.createElement('div');
        welcomeOverlay.className = 'welcome-overlay';
        welcomeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2500;
        `;
        
        welcomeOverlay.innerHTML = `
            <div class="welcome-content" style="
                background: linear-gradient(135deg, rgba(10, 25, 50, 0.95), rgba(0, 40, 80, 0.9));
                border: 3px solid #00d4ff;
                border-radius: 25px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                text-align: center;
                box-shadow: 0 0 60px rgba(0, 212, 255, 0.6);
                backdrop-filter: blur(20px);
            ">
                <h2 style="color: #00d4ff; font-size: 2.2em; margin: 0 0 20px 0; text-shadow: 0 0 25px rgba(0, 212, 255, 0.8);">🎓 Evaluasi Akhir</h2>
                <p style="color: #ffffff; font-size: 1.2em; line-height: 1.6; margin: 0 0 25px 0;">
                    Selamat datang di ruang bawah tanah! Ini adalah ujian akhir pengetahuan energi Anda.
                </p>
                <div style="background: rgba(0, 40, 80, 0.5); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <p style="color: #a0c4ff; margin: 0 0 15px 0;">📋 <strong>Aturan Tes:</strong></p>
                    <ul style="color: #ffffff; text-align: left; margin: 0; padding-left: 20px;">
                        <li>Total ${this.totalQuestions} soal, mencakup semua pengetahuan yang telah dipelajari</li>
                        <li>Setiap soal memiliki nilai berbeda, jawaban benar mendapat poin, jawaban salah tidak mengurangi poin</li>
                        <li>Dapat menggunakan ${this.maxHints} kali petunjuk, tetapi akan mengurangi sebagian poin</li>
                        <li>Dapat melewati soal sulit, tetapi tidak akan mendapat poin</li>
                        <li>Mendapat rating sesuai dengan performa akhir</li>
                    </ul>
                </div>
                <p style="color: #ffaa00; font-size: 1.1em; font-style: italic; margin: 20px 0;">💡 Gunakan pengetahuan yang telah Anda pelajari, tunjukkan kecerdasan energi Anda!</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(45deg, #00ff00, #00aa00);
                    border: none;
                    border-radius: 12px;
                    padding: 15px 30px;
                    color: #ffffff;
                    font-size: 1.2em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🚀 Mulai Tes</button>
            </div>
        `;
        
        document.body.appendChild(welcomeOverlay);
    }
}

// Inisialisasi Scene 5 Level 4 ketika DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Periksa apakah berada di halaman scene 5 level 4
    if (document.getElementById('scene5-level4-container')) {
        window.scene5Level4 = new Scene5Level4();
    }
});

// Ekspor untuk digunakan modul lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene5Level4;
}