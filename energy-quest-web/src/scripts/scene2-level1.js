// Scene 2 Level 1: Rangkaian Dasar Ruang Tamu

class Scene2Level1 {
    constructor() {
        this.container = document.getElementById('scene2-level1-container');
        this.gameState = {
            livingRoomPower: false,
            cablePuzzleCompleted: false,
            tvPuzzleCompleted: false,
            energyKeys: 0,
            currentStep: 1
        };
        
        this.circuitComponents = new Map();
        this.connections = [];
        this.draggedComponent = null;
        this.tvSequence = ['cable', 'switch', 'power', 'channel'];
        this.currentTvStep = 0;
        
        this.init();
    }

    init() {
        // Pastikan container ditampilkan
        if (this.container) {
            this.container.style.display = 'block';
            this.container.style.opacity = '1';
        }
        
        // Pastikan puzzle-game-container disembunyikan di scene ini
        const puzzleContainer = document.getElementById('puzzle-game-container');
        if (puzzleContainer) {
            puzzleContainer.style.display = 'none';
        }
        
        // Pastikan left panel dan inventory panel selalu visible
        this.ensurePanelsVisible();
        
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupAudio();
        this.setupBackgroundMusic();
        this.setupCharacterGuide();
        this.showHint('Klik meja kabel untuk mulai memperbaiki rangkaian');
    }

    ensurePanelsVisible() {
        // Pastikan left panel selalu terlihat
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) {
            leftPanel.style.display = 'block';
            leftPanel.style.opacity = '1';
            leftPanel.style.visibility = 'visible';
        }
        
        // Pastikan inventory panel selalu terlihat
        const inventoryPanel = document.querySelector('.inventory-panel');
        if (inventoryPanel) {
            inventoryPanel.style.display = 'block';
            inventoryPanel.style.opacity = '1';
            inventoryPanel.style.visibility = 'visible';
        }
        
        // Set interval untuk memastikan panel tetap visible
        setInterval(() => {
            if (leftPanel) {
                leftPanel.style.display = 'block';
                leftPanel.style.opacity = '1';
                leftPanel.style.visibility = 'visible';
            }
            if (inventoryPanel) {
                inventoryPanel.style.display = 'block';
                inventoryPanel.style.opacity = '1';
                inventoryPanel.style.visibility = 'visible';
            }
        }, 1000);
    }

    setupEventListeners() {
        // Event klik objek interaktif
        document.getElementById('cable-table-obj').addEventListener('click', () => {
            this.openCablePuzzle();
        });

        document.getElementById('tv-obj').addEventListener('click', () => {
            if (this.gameState.cablePuzzleCompleted) {
                this.openTvPuzzle();
            } else {
                this.showHint('Perbaiki koneksi rangkaian terlebih dahulu');
                this.triggerCharacterReaction('energy_tip');
            }
        });
        
        // Lampu click untuk tips hemat energi
        document.getElementById('lamp-obj').addEventListener('click', () => {
            if (this.gameState.livingRoomPower) {
                this.triggerCharacterReaction('energy_tip');
            } else {
                this.showHint('Lampu belum bisa dinyalakan. Perbaiki sirkuit dulu!');
            }
        });
        
        // Switch click untuk interaksi
        document.getElementById('switch-obj').addEventListener('click', () => {
            const switchObj = document.getElementById('switch-obj');
            if (this.gameState.cablePuzzleCompleted) {
                switchObj.classList.toggle('active');
                this.triggerCharacterReaction('energy_tip');
            } else {
                this.showHint('Perbaiki sirkuit terlebih dahulu!');
            }
        });

        // Tombol tutup puzzle
        document.getElementById('cable-puzzle-close').addEventListener('click', () => {
            this.closeCablePuzzle();
        });

        document.getElementById('tv-puzzle-close').addEventListener('click', () => {
            this.closeTvPuzzle();
        });

        // Tombol tes rangkaian
        document.getElementById('test-circuit').addEventListener('click', () => {
            this.testCircuit();
        });

        document.getElementById('reset-circuit').addEventListener('click', () => {
            this.resetCircuit();
        });

        // Langkah kontrol TV
        document.querySelectorAll('.control-step').forEach((step, index) => {
            step.addEventListener('click', () => {
                this.handleTvStep(index + 1);
            });
        });

        // Tutup petunjuk
        document.getElementById('hint-close').addEventListener('click', () => {
            this.hideHint();
        });

        // Event klik karakter pemandu
        document.getElementById('character-guide').addEventListener('click', () => {
            this.showCharacterTip();
        });
        
        // Battery click untuk tips
        document.getElementById('battery-obj').addEventListener('click', () => {
            this.triggerCharacterReaction('energy_tip');
        });

        // Lanjutkan pesan sukses
        document.getElementById('success-continue').addEventListener('click', () => {
            this.hideSuccessMessage();
        });

        // Popup edukasi
        document.getElementById('edu-close').addEventListener('click', () => {
            this.hideEducationalPopup();
        });

        document.getElementById('edu-expand-btn').addEventListener('click', () => {
            this.expandEducationalContent();
        });
    }

    setupDragAndDrop() {
        const components = document.querySelectorAll('.component');
        const slots = document.querySelectorAll('.grid-slot');

        components.forEach(component => {
            component.addEventListener('dragstart', (e) => {
                this.handleDragStart(e);
            });

            component.addEventListener('dragend', (e) => {
                this.handleDragEnd(e);
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                this.handleDragOver(e);
            });

            slot.addEventListener('drop', (e) => {
                this.handleDrop(e);
            });

            slot.addEventListener('dragleave', (e) => {
                this.handleDragLeave(e);
            });
        });
    }

    setupAudio() {
        this.sounds = {
            success: document.getElementById('sfx-click-success'),
            buzz: document.getElementById('sfx-buzz'),
            ding: document.getElementById('sfx-ding')
        };
    }

    setupBackgroundMusic() {
        // Setup background music dari HTML audio element
        this.backgroundMusic = document.getElementById('background-music');
        this.dramaticSound = document.getElementById('dramatic-sound');
        
        // Set volume untuk background music
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3; // Set volume to 30%
            
            // Start background music
            this.backgroundMusic.play().catch(e => {
                console.log('Background music autoplay prevented:', e);
                // Jika autoplay diblokir, play saat user pertama kali berinteraksi
                document.addEventListener('click', () => {
                    this.backgroundMusic.play();
                }, { once: true });
            });
        }
        
        // Set volume untuk dramatic sound
        if (this.dramaticSound) {
            this.dramaticSound.volume = 0.5; // Set volume to 50%
        }
    }

    playDramaticSound() {
        if (this.dramaticSound) {
            this.dramaticSound.volume = 0.7;
            this.dramaticSound.currentTime = 0;
            this.dramaticSound.play();
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.play();
        }
    }

    toggleBackgroundMusic() {
        if (this.backgroundMusic) {
            if (this.backgroundMusic.paused) {
                this.backgroundMusic.play();
            } else {
                this.backgroundMusic.pause();
            }
        }
    }

    setMusicVolume(volume) {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
        }
    }

    setDramaticSoundVolume(volume) {
        if (this.dramaticSound) {
            this.dramaticSound.volume = Math.max(0, Math.min(1, volume));
        }
    }

    // Tampilkan scene
    show() {
        this.container.style.display = 'block';
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 100);
    }

    // Sembunyikan scene
    hide() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 500);
    }

    // Metode terkait Puzzle Kabel
    openCablePuzzle() {
        document.getElementById('cable-puzzle-overlay').classList.remove('hidden');
        this.triggerCharacterReaction('puzzle_start');
        this.hideHint();
        
        // Ensure all puzzle elements are visible
        this.ensurePuzzleElementsVisible();
    }

    ensurePuzzleElementsVisible() {
        const overlay = document.getElementById('cable-puzzle-overlay');
        const circuitGrid = document.getElementById('circuit-grid');
        const componentsArea = document.querySelector('.components-area');
        const draggableComponents = document.querySelector('.draggable-components');
        const gridSlots = document.querySelectorAll('.grid-slot');
        const components = document.querySelectorAll('.component');
        
        // Force visibility for all puzzle elements
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
        }
        
        if (circuitGrid) {
            circuitGrid.style.display = 'grid';
            circuitGrid.style.opacity = '1';
            circuitGrid.style.visibility = 'visible';
        }
        
        if (componentsArea) {
            componentsArea.style.display = 'block';
            componentsArea.style.opacity = '1';
            componentsArea.style.visibility = 'visible';
        }
        
        if (draggableComponents) {
            draggableComponents.style.display = 'flex';
            draggableComponents.style.opacity = '1';
            draggableComponents.style.visibility = 'visible';
        }
        
        gridSlots.forEach(slot => {
            slot.style.display = 'flex';
            slot.style.opacity = '1';
            slot.style.visibility = 'visible';
        });
        
        components.forEach(component => {
            component.style.display = 'flex';
            component.style.opacity = '1';
            component.style.visibility = 'visible';
        });
        
        // Set interval to keep elements visible
        const puzzleInterval = setInterval(() => {
            if (overlay && !overlay.classList.contains('hidden')) {
                if (circuitGrid) {
                    circuitGrid.style.display = 'grid';
                    circuitGrid.style.opacity = '1';
                    circuitGrid.style.visibility = 'visible';
                }
                
                gridSlots.forEach(slot => {
                    slot.style.display = 'flex';
                    slot.style.opacity = '1';
                    slot.style.visibility = 'visible';
                });
                
                components.forEach(component => {
                    component.style.display = 'flex';
                    component.style.opacity = '1';
                    component.style.visibility = 'visible';
                });
            } else {
                clearInterval(puzzleInterval);
            }
        }, 500);
    }

    closeCablePuzzle() {
        document.getElementById('cable-puzzle-overlay').classList.add('hidden');
    }

    handleDragStart(e) {
        this.draggedComponent = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedComponent = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');

        if (!this.draggedComponent) return;

        const componentType = this.draggedComponent.dataset.component;
        const slotType = e.target.dataset.type;

        // Periksa apakah jenis komponen benar
        if (componentType === slotType) {
            // Penempatan benar
            this.placeComponent(e.target, this.draggedComponent);
            this.playSound('ding');
        } else {
            // Penempatan salah
            e.target.classList.add('error');
            this.playSound('buzz');
            setTimeout(() => {
                e.target.classList.remove('error');
            }, 500);
            this.showHint('Jenis komponen tidak cocok, periksa koneksi');
        }
    }

    placeComponent(slot, component) {
        // Kosongkan slot
        slot.innerHTML = slot.querySelector('.slot-label').outerHTML;
        
        // Buat komponen yang ditempatkan
        const placedComponent = document.createElement('div');
        placedComponent.className = 'placed-component';
        placedComponent.innerHTML = component.querySelector('.component-icon').outerHTML;
        placedComponent.dataset.type = component.dataset.component;
        
        slot.appendChild(placedComponent);
        slot.classList.add('filled');
        
        // Catat posisi komponen
        this.circuitComponents.set(slot.dataset.slot, component.dataset.component);
        
        // Sembunyikan komponen asli
        component.style.display = 'none';
        
        // Perbarui garis koneksi
        this.updateConnections();
    }

    updateConnections() {
        const svg = document.getElementById('connection-svg');
        svg.innerHTML = ''; // Kosongkan koneksi yang ada
        
        const slots = document.querySelectorAll('.grid-slot.filled');
        if (slots.length < 2) return;
        
        // Gambar garis koneksi
        for (let i = 0; i < slots.length - 1; i++) {
            const startSlot = slots[i];
            const endSlot = slots[i + 1];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const startRect = startSlot.getBoundingClientRect();
            const endRect = endSlot.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            
            line.setAttribute('x1', startRect.left + startRect.width / 2 - svgRect.left);
            line.setAttribute('y1', startRect.top + startRect.height / 2 - svgRect.top);
            line.setAttribute('x2', endRect.left + endRect.width / 2 - svgRect.left);
            line.setAttribute('y2', endRect.top + endRect.height / 2 - svgRect.top);
            line.setAttribute('class', 'connection-line');
            
            svg.appendChild(line);
        }
    }

    testCircuit() {
        const requiredSequence = ['battery-positive', 'switch', 'lamp', 'battery-negative'];
        const currentSequence = [];
        
        // Dapatkan urutan komponen saat ini
        document.querySelectorAll('.grid-slot').forEach(slot => {
            if (this.circuitComponents.has(slot.dataset.slot)) {
                currentSequence.push(this.circuitComponents.get(slot.dataset.slot));
            }
        });
        
        // Periksa apakah urutan benar
        const isCorrect = requiredSequence.length === currentSequence.length &&
                         requiredSequence.every((component, index) => component === currentSequence[index]);
        
        if (isCorrect) {
            this.completeCablePuzzle();
        } else {
            this.showCircuitError();
        }
    }

    completeCablePuzzle() {
        this.gameState.cablePuzzleCompleted = true;
        this.gameState.livingRoomPower = true;
        
        // Perbarui UI
        this.updatePowerStatus();
        this.updateTaskStatus('task-cable', true);
        this.unlockTask('task-tv');
        
        // Nyalakan lampu
        this.activateLamp();
        
        // Picu reaksi karakter
        this.triggerCharacterReaction('puzzle_success');
        
        // Putar dramatic sound untuk penyelesaian puzzle
        this.playDramaticSound();
        
        // Putar efek suara sukses
        this.playSound('success');
        
        // Tampilkan informasi edukasi
        this.showEducationalPopup(
            'Pengetahuan Dasar Rangkaian',
            'Arus listrik mengalir dalam rangkaian tertutup. Baterai menyediakan tegangan, saklar mengontrol aliran arus, lampu mengonsumsi energi listrik untuk menghasilkan cahaya.',
            'Dalam rangkaian DC, arus mengalir dari kutub positif baterai, melalui kabel, saklar, perangkat listrik, dan kembali ke kutub negatif baterai, membentuk rangkaian lengkap. Fungsi saklar adalah mengontrol sambungan rangkaian, ketika saklar tertutup rangkaian terhubung, ketika terbuka rangkaian terputus.'
        );
        
        // Berikan kunci energi sebagai hadiah
        this.awardEnergyKey();
        
        // Tutup puzzle
        setTimeout(() => {
            this.closeCablePuzzle();
            this.showHint('Rangkaian berhasil diperbaiki! Sekarang bisa memeriksa TV');
        }, 3000);
    }

    showCircuitError() {
        // Tampilkan efek error
        document.querySelectorAll('.connection-line').forEach(line => {
            line.classList.add('error');
        });
        
        this.playSound('buzz');
        this.showHint('Koneksi rangkaian salah. Urutan yang benar: Baterai(+) → Saklar → Lampu → Baterai(-)');
        
        setTimeout(() => {
            document.querySelectorAll('.connection-line').forEach(line => {
                line.classList.remove('error');
            });
        }, 1000);
    }

    resetCircuit() {
        // Reset semua komponen
        this.circuitComponents.clear();
        
        // Kosongkan slot
        document.querySelectorAll('.grid-slot').forEach(slot => {
            slot.classList.remove('filled', 'error');
            const label = slot.querySelector('.slot-label');
            slot.innerHTML = '';
            slot.appendChild(label);
        });
        
        // Tampilkan semua komponen
        document.querySelectorAll('.component').forEach(component => {
            component.style.display = 'flex';
        });
        
        // Kosongkan garis koneksi
        document.getElementById('connection-svg').innerHTML = '';
    }

    // Metode terkait Puzzle TV
    openTvPuzzle() {
        document.getElementById('tv-puzzle-overlay').classList.remove('hidden');
        this.updateTvSteps();
    }

    closeTvPuzzle() {
        document.getElementById('tv-puzzle-overlay').classList.add('hidden');
    }

    handleTvStep(stepNumber) {
        const expectedStep = this.currentTvStep + 1;
        
        if (stepNumber === expectedStep) {
            // Langkah benar
            this.completeTvStep(stepNumber);
        } else if (stepNumber > expectedStep) {
            // Melewati langkah
            this.showHint('Silakan selesaikan setiap langkah secara berurutan');
        }
        // Jika langkah sudah selesai, tidak melakukan apa-apa
    }

    completeTvStep(stepNumber) {
        const stepElement = document.getElementById(`step-${this.tvSequence[stepNumber - 1]}`);
        stepElement.classList.add('completed');
        stepElement.querySelector('.step-status').textContent = '✅';
        
        this.currentTvStep = stepNumber;
        this.playSound('ding');
        
        // Perbarui konten layar
        this.updateTvScreen(stepNumber);
        
        // Aktifkan langkah berikutnya
        if (stepNumber < this.tvSequence.length) {
            const nextStep = document.getElementById(`step-${this.tvSequence[stepNumber]}`);
            nextStep.classList.remove('disabled');
            nextStep.querySelector('.step-status').textContent = '⏳';
        } else {
            // Semua langkah selesai
            this.completeTvPuzzle();
        }
    }

    updateTvScreen(step) {
        const screenContent = document.getElementById('screen-content');
        const screenStatic = document.getElementById('screen-static');
        
        switch (step) {
            case 1:
                screenContent.textContent = 'Daya telah terhubung...';
                break;
            case 2:
                screenContent.textContent = 'Daya utama menyala...';
                break;
            case 3:
                screenStatic.style.display = 'none';
                screenContent.textContent = 'TV sedang menyala...';
                screenContent.classList.add('active');
                break;
            case 4:
                screenContent.innerHTML = `
                    <div style="color: #00ff00; font-family: monospace;">
                        <h3>Catatan Ilmuwan</h3>
                        <p>"Jika kamu melihat pesan ini, berarti kamu berhasil memperbaiki rangkaian ruang tamu..."</p>
                        <p>"Efisiensi energi adalah kunci, ingat hal ini..."</p>
                        <p>"Di dapur ada tantangan yang lebih menunggu..."</p>
                    </div>
                `;
                break;
        }
    }

    updateTvSteps() {
        // Reset status semua langkah
        document.querySelectorAll('.control-step').forEach((step, index) => {
            if (index === 0) {
                step.classList.remove('disabled');
                step.querySelector('.step-status').textContent = '⏳';
            } else {
                step.classList.add('disabled');
                step.querySelector('.step-status').textContent = '🔒';
            }
        });
    }

    completeTvPuzzle() {
        this.gameState.tvPuzzleCompleted = true;
        
        // Perbarui status tugas
        this.updateTaskStatus('task-tv', true);
        
        // Picu reaksi karakter
        this.triggerCharacterReaction('tv_success');
        
        // Putar dramatic sound untuk kemenangan
        this.playDramaticSound();
        
        // Putar efek suara sukses
        this.playSound('success');
        
        // Tampilkan pesan sukses
        this.showSuccessMessage(
            'Level Selesai!',
            'Anda berhasil memperbaiki sistem rangkaian ruang tamu dan mendapatkan informasi penting dari ilmuwan. Sekarang Anda dapat pergi ke dapur untuk melanjutkan perjalanan eksplorasi energi!'
        );
        
        // Berikan kunci energi sebagai hadiah (jika belum mendapat)
        if (this.gameState.energyKeys === 0) {
            this.awardEnergyKey();
        }
        
        // Aktifkan TV
        this.activateTV();
        
        // Tutup TV puzzle
        setTimeout(() => {
            this.closeTvPuzzle();
        }, 2000);
        
        // Picu reaksi penyelesaian level
        this.triggerCharacterReaction('level_complete');
        
        // Buka level berikutnya
        setTimeout(() => {
            this.unlockNextLevel();
        }, 5000);
    }

    // Metode pembaruan UI
    updatePowerStatus() {
        const statusElement = document.getElementById('living-room-power-status');
        if (this.gameState.livingRoomPower) {
            statusElement.textContent = '✅ Ruang tamu berlistrik normal';
            statusElement.classList.add('powered');
        } else {
            statusElement.textContent = '❌ Ruang tamu mati listrik';
            statusElement.classList.remove('powered');
        }
    }

    updateTaskStatus(taskId, completed) {
        const taskElement = document.getElementById(taskId);
        if (completed) {
            taskElement.classList.add('completed');
            taskElement.querySelector('.task-status').textContent = '✅';
        }
    }

    unlockTask(taskId) {
        const taskElement = document.getElementById(taskId);
        taskElement.querySelector('.task-status').textContent = '⏳';
    }

    awardEnergyKey() {
        this.gameState.energyKeys++;
        
        const keyContainer = document.getElementById('energy-keys-container');
        const keyElement = document.createElement('div');
        keyElement.className = 'energy-key';
        keyElement.innerHTML = '🔑';
        keyElement.style.animation = 'keyFloat 2s ease-in-out infinite';
        
        keyContainer.appendChild(keyElement);
        
        // Putar animasi mendapat kunci
        keyElement.style.transform = 'scale(0)';
        setTimeout(() => {
            keyElement.style.transform = 'scale(1)';
            keyElement.style.transition = 'transform 0.5s ease';
        }, 100);
    }

    // Metode pesan dan petunjuk
    showHint(message, duration = 5000) {
        const hintBubble = document.getElementById('hint-bubble');
        const hintText = document.getElementById('hint-text');
        
        hintText.textContent = message;
        hintBubble.classList.remove('hidden');
        
        // Sembunyikan otomatis
        if (duration > 0) {
            setTimeout(() => {
                this.hideHint();
            }, duration);
        }
    }

    hideHint() {
        document.getElementById('hint-bubble').classList.add('hidden');
    }

    showSuccessMessage(title, text) {
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-text').textContent = text;
        document.getElementById('success-message').classList.remove('hidden');
    }

    hideSuccessMessage() {
        document.getElementById('success-message').classList.add('hidden');
    }

    showEducationalPopup(title, content, detail) {
        document.getElementById('edu-title').textContent = title;
        document.getElementById('edu-content').textContent = content;
        document.getElementById('edu-detail').textContent = detail;
        document.getElementById('educational-popup').classList.remove('hidden');
    }

    hideEducationalPopup() {
        document.getElementById('educational-popup').classList.add('hidden');
    }

    expandEducationalContent() {
        const detail = document.getElementById('edu-detail');
        const btn = document.getElementById('edu-expand-btn');
        
        if (detail.classList.contains('expanded')) {
            detail.classList.remove('expanded');
            btn.textContent = 'Pelajari Lebih Lanjut';
        } else {
            detail.classList.add('expanded');
            btn.textContent = 'Tutup';
        }
    }

    // Metode audio
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }

    // Penyelesaian level dan transisi
    unlockNextLevel() {
        // Di sini dapat ditambahkan logika transisi ke level berikutnya
        console.log('Bersiap memasuki Scene 3 - Level 2: Dapur');
        
        // Dapat memicu scene manager untuk beralih ke level berikutnya
        if (window.gameManager) {
            window.gameManager.loadScene('scene3-level2');
        }
    }

    // Sistem karakter pemandu
    setupCharacterGuide() {
        this.characterTips = [
            "Halo! Saya akan membantu kamu belajar hemat energi!",
            "Klik pada meja kabel untuk mulai memperbaiki sirkuit listrik.",
            "Ingat, hemat energi dimulai dari hal-hal kecil!",
            "Matikan peralatan yang tidak digunakan untuk menghemat listrik.",
            "Setelah memperbaiki kabel, coba nyalakan TV!",
            "Bagus! Kamu sudah belajar dasar-dasar penghematan energi."
        ];
        this.currentTipIndex = 0;
        
        // Tampilkan tip pertama setelah 2 detik
        setTimeout(() => {
            this.showCharacterTip();
        }, 2000);
        
        // Auto-hide speech bubble setelah 5 detik
        this.speechTimeout = null;
    }
    
    showCharacterTip() {
        const speechBubble = document.getElementById('character-speech');
        const speechText = document.getElementById('speech-text');
        const characterGuide = document.getElementById('character-guide');
        
        if (this.currentTipIndex < this.characterTips.length) {
            speechText.textContent = this.characterTips[this.currentTipIndex];
            speechBubble.classList.remove('hidden');
            characterGuide.classList.add('talking');
            
            // Clear previous timeout
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
            }
            
            // Auto-hide after 5 seconds
            this.speechTimeout = setTimeout(() => {
                this.hideCharacterSpeech();
            }, 5000);
            
            this.currentTipIndex++;
        } else {
            // Cycle back to encouraging messages
            const encouragingTips = [
                "Kamu hebat! Terus belajar hemat energi ya!",
                "Setiap langkah kecil membuat perbedaan besar!",
                "Ingat, bumi ini milik kita bersama!"
            ];
            const randomTip = encouragingTips[Math.floor(Math.random() * encouragingTips.length)];
            speechText.textContent = randomTip;
            speechBubble.classList.remove('hidden');
            characterGuide.classList.add('talking');
            
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
            }
            
            this.speechTimeout = setTimeout(() => {
                this.hideCharacterSpeech();
            }, 4000);
        }
    }
    
    hideCharacterSpeech() {
        const speechBubble = document.getElementById('character-speech');
        const characterGuide = document.getElementById('character-guide');
        
        speechBubble.classList.add('hidden');
        characterGuide.classList.remove('talking');
        
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
    }
    
    triggerCharacterReaction(type) {
        const characterGuide = document.getElementById('character-guide');
        const speechBubble = document.getElementById('character-speech');
        const speechText = document.getElementById('speech-text');
        
        let message = "";
        
        switch(type) {
            case 'puzzle_start':
                message = "Bagus! Mari kita perbaiki sirkuit ini bersama-sama!";
                characterGuide.classList.add('excited');
                break;
            case 'puzzle_success':
                message = "Hebat! Kamu berhasil memperbaiki sirkuitnya!";
                characterGuide.classList.add('excited');
                break;
            case 'tv_success':
                message = "Luar biasa! TV sudah menyala. Jangan lupa matikan saat tidak digunakan ya!";
                characterGuide.classList.add('excited');
                break;
            case 'lamp_on':
                message = "Wah, lampunya menyala! Tapi ingat, gunakan lampu LED untuk hemat energi!";
                characterGuide.classList.add('excited');
                break;
            case 'level_complete':
                message = "Selamat! Kamu telah menyelesaikan Level 1. Siap ke level berikutnya?";
                characterGuide.classList.add('excited');
                break;
            case 'energy_tip':
                const energyTips = [
                    "Tahukah kamu? Mematikan peralatan elektronik saat tidak digunakan bisa menghemat 10% listrik!",
                    "Gunakan lampu LED karena lebih hemat energi dibanding lampu biasa!",
                    "Cabut charger dari stop kontak saat tidak digunakan untuk menghindari vampire power!"
                ];
                message = energyTips[Math.floor(Math.random() * energyTips.length)];
                break;
            default:
                return;
        }
        
        speechText.textContent = message;
        speechBubble.classList.remove('hidden');
        characterGuide.classList.add('talking');
        
        // Remove excited state after animation
        setTimeout(() => {
            characterGuide.classList.remove('excited');
        }, 2000);
        
        // Auto-hide after 4 seconds
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        
        this.speechTimeout = setTimeout(() => {
            this.hideCharacterSpeech();
        }, 4000);
    }

    activateLamp() {
        const lamp = document.getElementById('lamp-obj');
        const lampGlow = document.getElementById('lamp-glow');
        
        lamp.classList.add('powered');
        lamp.classList.add('energy-efficient');
        if (lampGlow) {
            lampGlow.style.opacity = '1';
            lampGlow.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        }
        
        // Trigger power-on animation
        lamp.style.animation = 'powerOn 0.5s ease-out';
        
        // Show character tip about energy efficiency
        setTimeout(() => {
            this.triggerCharacterReaction('lamp_on');
        }, 1000);
    }

    activateTV() {
        // Aktifkan layar TV
        const tvScreen = document.getElementById('tv-screen');
        const tvObj = document.getElementById('tv-obj');
        
        if (tvObj) {
            tvObj.classList.add('powered');
            tvObj.style.animation = 'powerOn 0.5s ease-out';
        }
        
        if (tvScreen) {
            tvScreen.style.background = 'linear-gradient(45deg, #4A90E2, #87CEEB)';
            tvScreen.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.6)';
            
            // Tambahkan konten TV
            tvScreen.innerHTML = `
                <div style="color: white; text-align: center; padding: 10px; font-size: 12px;">
                    📺 Berita Energi<br>
                    <small>Hemat energi, mulai dari diri sendiri</small>
                </div>
            `;
        }
    }

    // Dapatkan status game
    getGameState() {
        return { ...this.gameState };
    }

    // Atur status game
    setGameState(state) {
        this.gameState = { ...this.gameState, ...state };
        this.updatePowerStatus();
    }
}

// Ekspor kelas
window.Scene2Level1 = Scene2Level1;

// Inisialisasi ketika DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    if (!window.scene2Level1) {
        window.scene2Level1 = new Scene2Level1();
    }
});