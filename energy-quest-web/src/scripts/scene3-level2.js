// Scene 3 Level 2: Manajemen Efisiensi Energi Dapur

class Scene3Level2 {
    constructor() {
        this.container = document.getElementById('scene3-level2-container');
        this.gameState = {
            powerLevel: 150, // Daya awal (konsumsi dasar kulkas)
            efficiencyScore: 0,
            naturalLightActive: false,
            targetEfficiency: 60, // Ambang batas daya target
            levelCompleted: false,
            energyKeys: 0
        };
        
        this.devices = {
            window: { power: 0, status: 'closed', lightReduction: 8 },
            'main-light': { power: 15, status: 'off' },
            fridge: { power: 150, status: 'on', doorTimer: 0 },
            'rice-cooker': { power: 0, status: 'off', mode: 'normal', normalPower: 300, ecoPower: 210 },
            fan: { power: 0, status: 'off', normalPower: 45 },
            iron: { power: 0, status: 'off', normalPower: 1200, idleTimer: 0 }
        };
        
        this.timers = {
            fridgeWarning: null,
            ironIdle: null,
            efficiencyCheck: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.setupKitchenGuide();
        this.startEfficiencyMonitoring();
        this.updatePowerMeter();
        this.updateDeviceStatus();
        this.showHelperTooltip('Coba buka jendela untuk mengganti penerangan listrik', 3000);
    }

    setupEventListeners() {
        // Event interaksi perangkat
        document.getElementById('window-obj').addEventListener('click', () => {
            this.toggleWindow();
        });

        document.getElementById('main-light-obj').addEventListener('click', () => {
            this.toggleMainLight();
        });

        document.getElementById('fridge-obj').addEventListener('click', () => {
            this.toggleFridge();
        });

        document.getElementById('rice-cooker-obj').addEventListener('click', () => {
            this.toggleRiceCooker();
        });

        document.getElementById('fan-obj').addEventListener('click', () => {
            this.toggleFan();
        });

        document.getElementById('iron-obj').addEventListener('click', () => {
            this.toggleIron();
        });

        // Tombol mode rice cooker
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setRiceCookerMode(btn.dataset.mode);
            });
        });

        // Event kontrol UI
        document.getElementById('hint-close').addEventListener('click', () => {
            this.hideHint();
        });

        document.getElementById('success-continue').addEventListener('click', () => {
            this.hideSuccessMessage();
            this.proceedToNextLevel();
        });

        document.getElementById('edu-close').addEventListener('click', () => {
            this.hideEducationalPopup();
        });

        document.getElementById('edu-expand-btn').addEventListener('click', () => {
            this.expandEducationalContent();
        });

        document.getElementById('helper-close').addEventListener('click', () => {
            this.hideHelperTooltip();
        });

        // Interaksi karakter Chef Eco
        document.getElementById('kitchen-guide').addEventListener('click', () => {
            this.interactWithChefEco();
        });
    }

    setupAudio() {
        this.sounds = {
            ding: document.getElementById('sfx-ding'),
            buzz: document.getElementById('sfx-buzz'),
            click: document.getElementById('sfx-click'),
            ambient: document.getElementById('ambient-kitchen')
        };
        
        // Setup background music
        this.setupBackgroundMusic();
        
        // Putar efek suara lingkungan
        this.playAmbientSound();
    }

    setupBackgroundMusic() {
        // Create background music element
        this.backgroundMusic = new Audio('public/audio/background_music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        // Create dramatic sound element
        this.dramaticSound = new Audio('public/audio/dramatic_sound.mp3');
        this.dramaticSound.volume = 0.5;
        
        // Start background music
        this.backgroundMusic.play().catch(e => {
            console.log('Background music autoplay prevented:', e);
            // Play on first user interaction
            document.addEventListener('click', () => {
                this.backgroundMusic.play();
            }, { once: true });
        });
    }

    playDramaticSound() {
        if (this.dramaticSound) {
            this.dramaticSound.currentTime = 0;
            this.dramaticSound.play().catch(e => {
                console.log('Dramatic sound play failed:', e);
            });
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

    // Tampilkan scene
    show() {
        this.container.classList.remove('hidden');
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 100);
    }

    // Sembunyikan scene
    hide() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.classList.add('hidden');
        }, 500);
    }

    // Metode interaksi perangkat
    toggleWindow() {
        const windowObj = document.getElementById('window-obj');
        const windowPanels = document.getElementById('window-panels');
        const device = this.devices.window;
        
        if (device.status === 'closed') {
            // Buka jendela
            device.status = 'open';
            windowPanels.classList.add('open');
            windowObj.classList.add('active');
            
            // Efek cahaya alami
            this.gameState.naturalLightActive = true;
            this.adjustPowerForNaturalLight();
            
            this.playSound('click');
            this.addEfficiencyScore(10);
            this.showHint('Cahaya alami telah diaktifkan! Konsumsi pencahayaan berkurang', 3000);
            this.updateObjectiveStatus('obj-natural-light', true);
            this.triggerChefEcoReaction('window_opened');
            
            // Tampilkan informasi edukasi
            setTimeout(() => {
                this.showEducationalPopup(
                    'Keunggulan Cahaya Alami',
                    'Memanfaatkan cahaya alami dapat secara signifikan mengurangi konsumsi energi pencahayaan, sekaligus memberikan kualitas pencahayaan yang lebih baik.',
                    'Cahaya alami tidak hanya gratis, tetapi juga memberikan pencahayaan yang lebih merata dan mengurangi kelelahan mata. Dengan memanfaatkan orientasi jendela dan kontrol tirai dengan baik, efisiensi penggunaan cahaya alami dapat dimaksimalkan. Memanfaatkan cahaya alami di siang hari dapat mengurangi 30-50% penggunaan listrik untuk pencahayaan.'
                );
            }, 1000);
        } else {
            // Tutup jendela
            device.status = 'closed';
            windowPanels.classList.remove('open');
            windowObj.classList.remove('active');
            
            this.gameState.naturalLightActive = false;
            this.adjustPowerForNaturalLight();
            
            this.playSound('click');
            this.showHint('Jendela telah ditutup, efek cahaya alami hilang');
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleMainLight() {
        const lightObj = document.getElementById('main-light-obj');
        const device = this.devices['main-light'];
        
        if (device.status === 'off') {
            device.status = 'on';
            lightObj.classList.add('on');
            this.gameState.powerLevel += device.power;
            
            this.playSound('click');
            
            // Jika cahaya alami sudah aktif, beri tahu pengguna
            if (this.gameState.naturalLightActive) {
                this.showHint('Saat cahaya alami cukup, lampu listrik bisa dimatikan untuk hemat energi', 4000);
            }
        } else {
            device.status = 'off';
            lightObj.classList.remove('on');
            this.gameState.powerLevel -= device.power;
            
            this.playSound('click');
            this.addEfficiencyScore(5);
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleFridge() {
        const fridgeObj = document.getElementById('fridge-obj');
        const fridgeDoor = document.getElementById('fridge-door');
        const device = this.devices.fridge;
        
        if (fridgeDoor.classList.contains('closed')) {
            // Buka pintu kulkas
            fridgeDoor.classList.remove('closed');
            fridgeDoor.classList.add('open');
            
            this.playSound('click');
            
            // Mulai timer
            this.startFridgeTimer();
        } else {
            // Tutup pintu kulkas
            fridgeDoor.classList.remove('open');
            fridgeDoor.classList.add('closed');
            
            this.playSound('click');
            
            // Periksa kecepatan menutup
            if (device.doorTimer < 2) {
                this.addEfficiencyScore(5);
                this.playSound('ding');
                this.showHint('Pintu kulkas ditutup dengan cepat, hemat energi +5 poin!', 2000);
            }
            
            this.stopFridgeTimer();
        }
    }

    startFridgeTimer() {
        const device = this.devices.fridge;
        device.doorTimer = 0;
        
        const timerInterval = setInterval(() => {
            device.doorTimer++;
            
            if (device.doorTimer >= 5) {
                // Tampilkan peringatan
                this.showFridgeWarning();
                this.gameState.powerLevel += 15; // Tambah konsumsi energi
                this.updatePowerMeter();
                this.triggerChefEcoReaction('fridge_opened_long');
                
                if (device.doorTimer >= 10) {
                    // Tutup otomatis dan kurangi poin
                    document.getElementById('fridge-door').classList.remove('open');
                    document.getElementById('fridge-door').classList.add('closed');
                    this.hideFridgeWarning();
                    this.addEfficiencyScore(-10);
                    this.showHint('Pintu kulkas terbuka terlalu lama, efisiensi energi menurun!', 3000);
                    clearInterval(timerInterval);
                }
            }
        }, 1000);
        
        this.timers.fridgeWarning = timerInterval;
    }

    stopFridgeTimer() {
        if (this.timers.fridgeWarning) {
            clearInterval(this.timers.fridgeWarning);
            this.timers.fridgeWarning = null;
        }
        
        this.hideFridgeWarning();
        
        // Kembalikan konsumsi daya normal
        if (this.devices.fridge.doorTimer >= 5) {
            this.gameState.powerLevel -= 15;
            this.updatePowerMeter();
        }
        
        this.devices.fridge.doorTimer = 0;
    }

    toggleRiceCooker() {
        const cookerObj = document.getElementById('rice-cooker-obj');
        const device = this.devices['rice-cooker'];
        
        if (device.status === 'off') {
            device.status = 'on';
            cookerObj.classList.add('on');
            
            const power = device.mode === 'eco' ? device.ecoPower : device.normalPower;
            device.power = power;
            this.gameState.powerLevel += power;
            
            this.playSound('click');
            this.showHint('Rice cooker telah dinyalakan. Coba beralih ke mode hemat energi!', 4000);
        } else {
            device.status = 'off';
            cookerObj.classList.remove('on');
            
            this.gameState.powerLevel -= device.power;
            device.power = 0;
            
            this.playSound('click');
            this.addEfficiencyScore(3);
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    setRiceCookerMode(mode) {
        const device = this.devices['rice-cooker'];
        const modeDisplay = document.getElementById('cooker-mode');
        const buttons = document.querySelectorAll('.mode-btn');
        
        // Perbarui status tombol
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // Perbarui mode
        const oldPower = device.power;
        device.mode = mode;
        
        if (device.status === 'on') {
            const newPower = mode === 'eco' ? device.ecoPower : device.normalPower;
            this.gameState.powerLevel = this.gameState.powerLevel - oldPower + newPower;
            device.power = newPower;
            
            if (mode === 'eco') {
                this.addEfficiencyScore(8);
                this.playSound('ding');
                this.showHint('Mode hemat energi telah diaktifkan, konsumsi daya turun 30%!', 3000);
                this.triggerChefEcoReaction('eco_mode_activated');
            }
        }
        
        modeDisplay.textContent = mode === 'eco' ? 'Hemat' : 'Normal';
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleFan() {
        const fanObj = document.getElementById('fan-obj');
        const device = this.devices.fan;
        
        if (device.status === 'off') {
            device.status = 'on';
            fanObj.classList.add('on');
            device.power = device.normalPower;
            this.gameState.powerLevel += device.power;
            
            this.playSound('click');
        } else {
            device.status = 'off';
            fanObj.classList.remove('on');
            this.gameState.powerLevel -= device.power;
            device.power = 0;
            
            this.playSound('click');
            this.addEfficiencyScore(2);
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleIron() {
        const ironObj = document.getElementById('iron-obj');
        const device = this.devices.iron;
        
        if (device.status === 'off') {
            device.status = 'on';
            ironObj.classList.add('on');
            device.power = device.normalPower;
            this.gameState.powerLevel += device.power;
            
            this.playSound('click');
            this.showHint('Setrika memiliki daya tinggi, matikan segera jika tidak digunakan', 4000);
            
            // Mulai timer idle
            this.startIronIdleTimer();
        } else {
            device.status = 'off';
            ironObj.classList.remove('on');
            this.gameState.powerLevel -= device.power;
            device.power = 0;
            
            this.playSound('click');
            this.addEfficiencyScore(5);
            
            this.stopIronIdleTimer();
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    startIronIdleTimer() {
        const device = this.devices.iron;
        device.idleTimer = 0;
        
        this.timers.ironIdle = setInterval(() => {
            device.idleTimer++;
            
            if (device.idleTimer >= 30) { // Pengingat 30 detik
                this.showHint('Setrika menganggur terlalu lama, disarankan untuk dimatikan demi hemat energi', 3000);
                clearInterval(this.timers.ironIdle);
            }
        }, 1000);
    }

    stopIronIdleTimer() {
        if (this.timers.ironIdle) {
            clearInterval(this.timers.ironIdle);
            this.timers.ironIdle = null;
        }
        this.devices.iron.idleTimer = 0;
    }

    // Penyesuaian daya cahaya alami
    adjustPowerForNaturalLight() {
        const lightDevice = this.devices['main-light'];
        
        if (this.gameState.naturalLightActive && lightDevice.status === 'on') {
            // Jika cahaya alami aktif dan lampu listrik juga menyala, sarankan matikan lampu
            setTimeout(() => {
                this.showHint('Cahaya alami cukup, lampu listrik bisa dimatikan untuk hemat energi', 4000);
            }, 2000);
        }
    }

    // Pembaruan meteran daya
    updatePowerMeter() {
        const powerLevel = document.getElementById('power-level');
        const currentPower = document.getElementById('current-power');
        
        // Batasi rentang daya
        const clampedPower = Math.max(0, Math.min(100, this.gameState.powerLevel));
        const percentage = clampedPower;
        
        // Perbarui tampilan
        currentPower.textContent = Math.round(this.gameState.powerLevel);
        powerLevel.style.height = `${percentage}%`;
        
        // Perbarui area warna
        if (percentage <= 60) {
            powerLevel.setAttribute('data-level', 'green');
            if (this.gameState.efficiencyScore > 50) {
                this.triggerChefEcoReaction('efficiency_achieved');
            }
        } else if (percentage <= 80) {
            powerLevel.setAttribute('data-level', 'yellow');
        } else {
            powerLevel.setAttribute('data-level', 'red');
            this.triggerChefEcoReaction('high_power_warning');
        }
        
        // Periksa pencapaian target
        this.checkEfficiencyTarget();
    }

    // Pembaruan status perangkat
    updateDeviceStatus() {
        Object.keys(this.devices).forEach(deviceName => {
            const device = this.devices[deviceName];
            const deviceItem = document.querySelector(`[data-device="${deviceName}"]`);
            
            if (deviceItem) {
                const statusElement = deviceItem.querySelector('.device-status');
                const powerElement = deviceItem.querySelector('.device-power');
                
                // Tambah pengecekan null untuk mencegah error
                if (statusElement && powerElement) {
                    // Perbarui tampilan status
                    let statusText = device.status;
                    if (deviceName === 'window') {
                        statusText = device.status === 'open' ? 'Terbuka' : 'Tertutup';
                    } else if (deviceName === 'rice-cooker' && device.status === 'on') {
                        statusText = `Berjalan(${device.mode === 'eco' ? 'Hemat' : 'Normal'})`;
                    } else {
                        statusText = device.status === 'on' ? 'Berjalan' : 'Mati';
                    }
                    
                    statusElement.textContent = statusText;
                    statusElement.className = `device-status ${device.status === 'on' || device.status === 'open' ? '' : 'off'}`;
                    
                    // Perbarui tampilan daya
                    powerElement.textContent = `${device.power}W`;
                }
            }
        });
    }

    // Monitoring efisiensi
    startEfficiencyMonitoring() {
        this.timers.efficiencyCheck = setInterval(() => {
            this.checkEfficiencyTarget();
        }, 2000);
    }

    checkEfficiencyTarget() {
        if (this.gameState.powerLevel <= this.gameState.targetEfficiency) {
            this.updateObjectiveStatus('obj-power-meter', true);
            
            if (this.gameState.naturalLightActive) {
                this.addEfficiencyScore(2); // Bonus berkelanjutan
            }
            
            // Periksa apakah semua tujuan telah selesai
            if (this.gameState.efficiencyScore >= 50 && !this.gameState.levelCompleted) {
                this.completeLevel();
            }
        } else {
            this.updateObjectiveStatus('obj-power-meter', false);
        }
    }

    addEfficiencyScore(points) {
        this.gameState.efficiencyScore += points;
        this.gameState.efficiencyScore = Math.max(0, this.gameState.efficiencyScore);
        
        const scoreDisplay = document.getElementById('efficiency-points');
        scoreDisplay.textContent = this.gameState.efficiencyScore;
        
        // Efek animasi
        scoreDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreDisplay.style.transform = 'scale(1)';
        }, 300);
        
        if (this.gameState.efficiencyScore >= 30) {
            this.updateObjectiveStatus('obj-efficiency', true);
        }
    }

    completeLevel() {
        this.gameState.levelCompleted = true;
        
        // Hentikan semua timer
        Object.values(this.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        
        // Putar efek suara sukses dan dramatic sound
        this.playSound('ding');
        this.playDramaticSound();
        
        // Berikan kunci energi sebagai hadiah
        this.awardEnergyKey();
        
        // Tampilkan pesan sukses
        this.showSuccessMessage(
            'Manajemen Efisiensi Dapur Selesai!',
            `Anda berhasil mengelola penggunaan energi dapur dan mendapat ${this.gameState.efficiencyScore} poin efisiensi. Sekarang bisa menuju laboratorium untuk belajar lebih banyak tentang energi!`
        );
        
        // Tampilkan informasi edukasi
        setTimeout(() => {
            this.showEducationalPopup(
                'Ringkasan Manajemen Efisiensi Energi',
                'Dengan menggunakan perangkat secara bijak dan memanfaatkan sumber daya alam, konsumsi energi dapat dikurangi secara signifikan.',
                'Kunci manajemen efisiensi energi: 1) Manfaatkan cahaya alami secara maksimal; 2) Pilih perangkat dengan mode hemat energi; 3) Matikan peralatan listrik yang tidak perlu; 4) Hindari pemborosan akibat perangkat yang menganggur. Kebiasaan ini juga berlaku dalam kehidupan sehari-hari untuk menghemat tagihan listrik dan melindungi lingkungan.'
            );
        }, 3000);
    }

    // Metode pembaruan UI
    updateObjectiveStatus(objectiveId, completed) {
        const objective = document.getElementById(objectiveId);
        const status = objective.querySelector('.obj-status');
        
        if (completed) {
            objective.classList.add('completed');
            status.textContent = '✅';
        } else {
            objective.classList.remove('completed');
            status.textContent = '⏳';
        }
    }

    awardEnergyKey() {
        this.gameState.energyKeys++;
        
        const keyContainer = document.getElementById('energy-keys-container');
        const keyElement = document.createElement('div');
        keyElement.className = 'energy-key';
        keyElement.innerHTML = '🔑';
        
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

    showFridgeWarning() {
        const warning = document.getElementById('fridge-warning');
        const timer = document.getElementById('fridge-timer');
        
        warning.classList.remove('hidden');
        
        const updateTimer = () => {
            const remaining = Math.max(0, 10 - this.devices.fridge.doorTimer);
            timer.textContent = remaining;
        };
        
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        
        setTimeout(() => {
            clearInterval(timerInterval);
        }, 5000);
    }

    hideFridgeWarning() {
        document.getElementById('fridge-warning').classList.add('hidden');
    }

    showHelperTooltip(message, duration = 0) {
        const tooltip = document.getElementById('helper-tooltip');
        const text = document.getElementById('helper-text');
        
        text.textContent = message;
        tooltip.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                this.hideHelperTooltip();
            }, duration);
        }
    }

    hideHelperTooltip() {
        document.getElementById('helper-tooltip').classList.add('hidden');
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

    playAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.volume = 0.3;
            this.sounds.ambient.play().catch(e => {
                console.log('Ambient audio play failed:', e);
            });
        }
    }

    stopAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.pause();
        }
    }

    // Transisi level
    proceedToNextLevel() {
        console.log('Bersiap memasuki Scene 4 - Level 3: Laboratorium');
        
        if (window.gameManager) {
            window.gameManager.loadScene('scene4-level3');
        }
    }

    // Bersihkan sumber daya
    cleanup() {
        // Hentikan semua timer
        Object.values(this.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        
        // Hentikan efek suara lingkungan
        this.stopAmbientSound();
    }

    // Dapatkan status game
    getGameState() {
        return { 
            ...this.gameState,
            devices: { ...this.devices }
        };
    }

    // Atur status game
    setGameState(state) {
        this.gameState = { ...this.gameState, ...state };
        if (state.devices) {
            this.devices = { ...this.devices, ...state.devices };
        }
        this.updatePowerMeter();
        this.updateDeviceStatus();
    }
    // === CHEF ECO CHARACTER METHODS ===
    setupKitchenGuide() {
        this.chefEco = {
            element: document.getElementById('kitchen-guide'),
            speechBubble: document.getElementById('guide-speech'),
            speechText: document.getElementById('guide-speech-text'),
            currentTipIndex: 0,
            isActive: false,
            tips: [
                "Halo! Saya Chef Eco, ahli hemat energi dapur!",
                "Coba buka jendela untuk menggunakan cahaya alami dan hemat listrik!",
                "Kulkas yang sering dibuka akan boros energi. Tutup dengan cepat!",
                "Rice cooker mode eco bisa menghemat hingga 30% energi!",
                "Matikan peralatan yang tidak digunakan untuk efisiensi maksimal!",
                "Kipas angin lebih hemat daripada AC untuk sirkulasi udara!",
                "Setrika yang dibiarkan menyala tanpa digunakan sangat boros!",
                "Kombinasi cahaya alami dan peralatan hemat energi = dapur eco-friendly!"
            ],
            contextualTips: {
                windowOpen: "Bagus! Cahaya alami menghemat 8W listrik!",
                fridgeOpen: "Hati-hati! Kulkas terbuka terlalu lama akan boros energi!",
                ecoMode: "Excellent! Mode eco menghemat energi tanpa mengurangi kualitas!",
                highPower: "Wah! Konsumsi listrik tinggi. Coba matikan beberapa peralatan!",
                efficient: "Perfect! Dapur Anda sudah sangat hemat energi!"
            }
        };
        
        // Perkenalan otomatis setelah 2 detik
        setTimeout(() => {
            this.showChefEcoTip(this.chefEco.tips[0]);
        }, 2000);
        
        // Tips berkala setiap 15 detik
        setInterval(() => {
            if (!this.chefEco.isActive && Math.random() < 0.3) {
                this.showRandomTip();
            }
        }, 15000);
    }
    
    interactWithChefEco() {
        if (this.chefEco.isActive) {
            this.hideChefEcoSpeech();
            return;
        }
        
        // Berikan tip berdasarkan kondisi saat ini
        let tip = this.getContextualTip();
        this.showChefEcoTip(tip);
        
        // Add excited animation
        this.chefEco.element.classList.add('excited');
        setTimeout(() => {
            this.chefEco.element.classList.remove('excited');
        }, 1200);
        
        // Play sound effect
        this.playSound('click');
    }
    
    showChefEcoTip(message) {
        this.chefEco.speechText.textContent = message;
        this.chefEco.speechBubble.classList.remove('hidden');
        this.chefEco.element.classList.add('speaking');
        this.chefEco.isActive = true;
        
        // Sembunyikan otomatis setelah 5 detik
        setTimeout(() => {
            this.hideChefEcoSpeech();
        }, 5000);
    }
    
    hideChefEcoSpeech() {
        this.chefEco.speechBubble.classList.add('hidden');
        this.chefEco.element.classList.remove('speaking');
        this.chefEco.isActive = false;
    }
    
    getContextualTip() {
        const { contextualTips } = this.chefEco;
        
        // Periksa kondisi saat ini dan berikan tip yang relevan
        if (this.gameState.powerLevel > 400) {
            return contextualTips.highPower;
        } else if (this.gameState.efficiencyScore > 80) {
            return contextualTips.efficient;
        } else if (this.devices.window.status === 'open') {
            return contextualTips.windowOpen;
        } else if (this.devices.fridge.doorTimer > 0) {
            return contextualTips.fridgeOpen;
        } else if (this.devices['rice-cooker'].mode === 'eco') {
            return contextualTips.ecoMode;
        } else {
            // Berikan tip umum berikutnya
            this.chefEco.currentTipIndex = (this.chefEco.currentTipIndex + 1) % this.chefEco.tips.length;
            return this.chefEco.tips[this.chefEco.currentTipIndex];
        }
    }
    
    showRandomTip() {
        const randomIndex = Math.floor(Math.random() * this.chefEco.tips.length);
        this.showChefEcoTip(this.chefEco.tips[randomIndex]);
    }
    
    // Picu tips berdasarkan aksi pemain
    triggerChefEcoReaction(action) {
        if (this.chefEco.isActive) return;
        
        const { contextualTips } = this.chefEco;
        let tip = null;
        
        switch(action) {
            case 'window_opened':
                tip = contextualTips.windowOpen;
                break;
            case 'fridge_opened_long':
                tip = contextualTips.fridgeOpen;
                break;
            case 'eco_mode_activated':
                tip = contextualTips.ecoMode;
                break;
            case 'high_power_warning':
                tip = contextualTips.highPower;
                break;
            case 'efficiency_achieved':
                tip = contextualTips.efficient;
                break;
        }
        
        if (tip) {
            setTimeout(() => {
                this.showChefEcoTip(tip);
            }, 1000);
        }
    }
}

// Ekspor kelas
window.Scene3Level2 = Scene3Level2;

// Inisialisasi ketika DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    if (!window.scene3Level2) {
        window.scene3Level2 = new Scene3Level2();
    }
});