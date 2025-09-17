// Scene 4 Level 3: Sistem Simulasi Tagihan Listrik Laboratorium
class Scene4Level3 {
    constructor() {
        this.devices = {
            lamp: { power: 15, time: 6, name: 'Lampu LED', icon: '💡' },
            ac: { power: 1000, time: 8, name: 'AC Kecil', icon: '❄️' },
            tv: { power: 120, time: 4, name: 'TV LCD', icon: '📺' },
            fridge: { power: 150, time: 24, name: 'Kulkas', icon: '🧊' },
            'rice-cooker': { power: 300, time: 1, name: 'Rice Cooker', icon: '🍚' },
            computer: { power: 150, time: 6, name: 'Komputer Desktop', icon: '💻' }
        };
        
        this.tariffRate = 1467; // Rp per kWh
        this.budgetLimit = 300000; // Rp
        this.currentBill = 0;
        this.totalKwh = 0;
        
        this.presets = {
            saving: {
                lamp: 4, ac: 4, tv: 2, fridge: 24, 'rice-cooker': 0.5, computer: 4
            },
            normal: {
                lamp: 6, ac: 8, tv: 4, fridge: 24, 'rice-cooker': 1, computer: 6
            },
            comfort: {
                lamp: 8, ac: 12, tv: 6, fridge: 24, 'rice-cooker': 1.5, computer: 8
            }
        };
        
        this.objectives = {
            billLimit: false,
            efficiency: false,
            calculation: false
        };
        
        this.energyKeys = [];
        this.isLevelComplete = false;
        this.chart = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.calculateBill();
        this.updateChart();
        this.showInitialHint();
        this.loadEnergyKeys();
        
        // Putar efek suara lingkungan
        this.playAmbientSound();
        
        console.log('Scene 4 Level 3 initialized');
    }
    
    setupEventListeners() {
        // Event slider perangkat
        Object.keys(this.devices).forEach(deviceId => {
            const slider = document.getElementById(`${deviceId}-slider`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.updateDeviceTime(deviceId, parseFloat(e.target.value));
                });
                
                slider.addEventListener('change', () => {
                    this.playClickSound();
                });
            }
        });
        
        // Event klik detail perangkat
        document.querySelectorAll('.device-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('time-slider')) {
                    const deviceId = item.dataset.device;
                    this.showDeviceDetail(deviceId);
                }
            });
        });
        
        // Event tombol preset
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = btn.dataset.preset;
                this.applyPreset(preset);
                this.playClickSound();
            });
        });
        
        // Event tutup popup
        document.getElementById('detail-close')?.addEventListener('click', () => {
            this.hideDeviceDetail();
        });
        
        document.getElementById('edu-close')?.addEventListener('click', () => {
            this.hideEducationalPopup();
        });
        
        document.getElementById('edu-expand-btn')?.addEventListener('click', () => {
            this.toggleEducationalDetail();
        });
        
        document.getElementById('hint-close')?.addEventListener('click', () => {
            this.hideHint();
        });
        
        document.getElementById('warning-close')?.addEventListener('click', () => {
            this.hideWarning();
        });
        
        document.getElementById('success-continue')?.addEventListener('click', () => {
            this.continueToNextLevel();
        });
        
        // Event klik tampilan rumus
        document.querySelector('.formula-display')?.addEventListener('click', () => {
            this.showEducationalPopup();
        });
    }
    
    setupAudio() {
        this.sounds = {
            ding: document.getElementById('sfx-ding'),
            buzz: document.getElementById('sfx-buzz'),
            click: document.getElementById('sfx-click'),
            ambient: document.getElementById('ambient-lab')
        };
        
        // Atur volume
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = 0.3;
        });
        
        if (this.sounds.ambient) {
            this.sounds.ambient.volume = 0.1;
        }
        
        // Setup background music
        this.setupBackgroundMusic();
        
        // Play ambient sound
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

    playAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.play().catch(e => {
                console.log('Ambient sound play failed:', e);
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
    
    updateDeviceTime(deviceId, time) {
        if (this.devices[deviceId]) {
            this.devices[deviceId].time = time;
            
            // Perbarui tampilan
            const timeDisplay = document.getElementById(`${deviceId}-time`);
            const energyDisplay = document.getElementById(`${deviceId}-energy`);
            
            if (timeDisplay) {
                timeDisplay.textContent = time.toFixed(1);
            }
            
            if (energyDisplay) {
                const monthlyEnergy = this.calculateDeviceMonthlyEnergy(deviceId);
                energyDisplay.textContent = monthlyEnergy.toFixed(1);
            }
            
            // Hitung ulang total tagihan listrik
            this.calculateBill();
            this.updateChart();
            this.checkObjectives();
        }
    }
    
    calculateDeviceMonthlyEnergy(deviceId) {
        const device = this.devices[deviceId];
        if (!device) return 0;
        
        // Konsumsi energi(kWh) = (Daya W × Waktu h × 30 hari) ÷ 1000
        return (device.power * device.time * 30) / 1000;
    }
    
    calculateBill() {
        this.totalKwh = 0;
        
        // Hitung total konsumsi energi
        Object.keys(this.devices).forEach(deviceId => {
            this.totalKwh += this.calculateDeviceMonthlyEnergy(deviceId);
        });
        
        // Hitung total tagihan listrik
        this.currentBill = this.totalKwh * this.tariffRate;
        
        // Perbarui tampilan
        this.updateBillDisplay();
    }
    
    updateBillDisplay() {
        const totalKwhElement = document.getElementById('total-kwh');
        const billAmountElement = document.getElementById('monthly-bill-amount');
        const billStatusElement = document.getElementById('bill-status');
        
        if (totalKwhElement) {
            totalKwhElement.textContent = this.totalKwh.toFixed(1);
        }
        
        if (billAmountElement) {
            billAmountElement.textContent = `Rp ${this.currentBill.toLocaleString('id-ID')}`;
            
            // Ubah warna berdasarkan status tagihan listrik
            if (this.currentBill <= this.budgetLimit) {
                billAmountElement.className = 'bill-value success';
            } else if (this.currentBill <= this.budgetLimit * 1.2) {
                billAmountElement.className = 'bill-value warning';
            } else {
                billAmountElement.className = 'bill-value error';
            }
        }
        
        if (billStatusElement) {
            const statusIcon = billStatusElement.querySelector('.status-icon');
            const statusText = billStatusElement.querySelector('.status-text');
            
            if (this.currentBill <= this.budgetLimit) {
                statusIcon.textContent = '✅';
                statusText.textContent = 'Anggaran Tercapai';
                statusText.className = 'status-text success';
            } else {
                statusIcon.textContent = '⚠️';
                statusText.textContent = 'Melebihi Anggaran';
                statusText.className = 'status-text error';
            }
        }
    }
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;
        
        // Hapus status aktif sebelumnya
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Tambahkan status aktif saat ini
        document.querySelector(`[data-preset="${presetName}"]`)?.classList.add('active');
        
        // Terapkan nilai preset
        Object.keys(preset).forEach(deviceId => {
            const slider = document.getElementById(`${deviceId}-slider`);
            if (slider) {
                slider.value = preset[deviceId];
                this.updateDeviceTime(deviceId, preset[deviceId]);
            }
        });
        
        // Tampilkan petunjuk
        this.showHint(`Telah menerapkan konfigurasi ${this.getPresetName(presetName)}`);
    }
    
    getPresetName(presetName) {
        const names = {
            saving: 'Mode Hemat Energi',
            normal: 'Mode Standar',
            comfort: 'Mode Nyaman'
        };
        return names[presetName] || presetName;
    }
    
    showDeviceDetail(deviceId) {
        const device = this.devices[deviceId];
        if (!device) return;
        
        const popup = document.getElementById('device-detail-popup');
        const deviceName = document.getElementById('detail-device-name');
        const devicePower = document.getElementById('detail-power');
        const deviceHours = document.getElementById('detail-hours');
        const deviceMonthly = document.getElementById('detail-monthly');
        const deviceCost = document.getElementById('detail-cost');
        const calculationDetail = document.getElementById('calculation-detail');
        
        if (popup && deviceName && devicePower && deviceHours && deviceMonthly && deviceCost && calculationDetail) {
            const monthlyEnergy = this.calculateDeviceMonthlyEnergy(deviceId);
            const monthlyCost = monthlyEnergy * this.tariffRate;
            
            deviceName.textContent = `${device.icon} ${device.name}`;
            devicePower.textContent = `${device.power}W`;
            deviceHours.textContent = `${device.time} jam/hari`;
            deviceMonthly.textContent = `${monthlyEnergy.toFixed(1)} kWh/bulan`;
            deviceCost.textContent = `Rp ${monthlyCost.toLocaleString('id-ID')}`;
            
            // Buat langkah perhitungan
            const steps = [
                `1. Konsumsi harian = ${device.power}W × ${device.time}j = ${(device.power * device.time).toFixed(1)}Wh`,
                `2. Konsumsi harian (kWh) = ${(device.power * device.time).toFixed(1)}Wh ÷ 1000 = ${((device.power * device.time) / 1000).toFixed(3)}kWh`,
                `3. Konsumsi bulanan = ${((device.power * device.time) / 1000).toFixed(3)}kWh × 30 hari = ${monthlyEnergy.toFixed(1)}kWh`,
                `4. Biaya bulanan = ${monthlyEnergy.toFixed(1)}kWh × Rp${this.tariffRate} = Rp${monthlyCost.toLocaleString('id-ID')}`
            ];
            
            calculationDetail.innerHTML = steps.join('<br>');
            
            popup.classList.remove('hidden');
            this.playClickSound();
        }
    }
    
    hideDeviceDetail() {
        const popup = document.getElementById('device-detail-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }
    
    updateChart() {
        const canvas = document.getElementById('energy-chart');
        const legend = document.getElementById('chart-legend');
        
        if (!canvas || !legend) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Bersihkan canvas
        ctx.clearRect(0, 0, width, height);
        
        // Hitung data konsumsi energi perangkat
        const deviceData = [];
        let totalEnergy = 0;
        
        Object.keys(this.devices).forEach(deviceId => {
            const energy = this.calculateDeviceMonthlyEnergy(deviceId);
            deviceData.push({
                id: deviceId,
                name: this.devices[deviceId].name,
                icon: this.devices[deviceId].icon,
                energy: energy,
                percentage: 0 // Akan dihitung kemudian
            });
            totalEnergy += energy;
        });
        
        // Hitung persentase
        deviceData.forEach(item => {
            item.percentage = totalEnergy > 0 ? (item.energy / totalEnergy) * 100 : 0;
        });
        
        // Gambar diagram lingkaran
        this.drawPieChart(ctx, deviceData, width, height);
        
        // Perbarui legenda
        this.updateChartLegend(legend, deviceData);
    }
    
    drawPieChart(ctx, data, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        const colors = [
            '#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
            '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'
        ];
        
        let currentAngle = -Math.PI / 2; // Mulai dari atas
        
        data.forEach((item, index) => {
            if (item.energy > 0) {
                const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
                
                // Gambar sektor
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                
                ctx.fillStyle = colors[index % colors.length];
                ctx.fill();
                
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Gambar label
                if (item.percentage > 5) { // Hanya tampilkan label yang lebih dari 5%
                    const labelAngle = currentAngle + sliceAngle / 2;
                    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${item.percentage.toFixed(1)}%`, labelX, labelY);
                }
                
                currentAngle += sliceAngle;
            }
        });
    }
    
    updateChartLegend(legend, data) {
        const colors = [
            '#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
            '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'
        ];
        
        legend.innerHTML = '';
        
        data.forEach((item, index) => {
            if (item.energy > 0) {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                
                legendItem.innerHTML = `
                    <div class="legend-color" style="background-color: ${colors[index % colors.length]}"></div>
                    <span>${item.icon} ${item.name}: ${item.energy.toFixed(1)}kWh</span>
                `;
                
                legend.appendChild(legendItem);
            }
        });
    }
    
    checkObjectives() {
        const prevObjectives = { ...this.objectives };
        
        // Periksa target tagihan listrik
        this.objectives.billLimit = this.currentBill <= this.budgetLimit;
        
        // Periksa target efisiensi (setidaknya menggunakan satu preset atau optimasi manual)
        this.objectives.efficiency = this.hasOptimizedUsage();
        
        // Periksa target pemahaman perhitungan (telah melihat detail perangkat atau popup edukasi)
        this.objectives.calculation = this.hasViewedCalculations();
        
        // Perbarui tampilan target
        this.updateObjectiveDisplay();
        
        // Periksa apakah semua target telah selesai
        if (this.objectives.billLimit && this.objectives.efficiency && this.objectives.calculation) {
            if (!this.isLevelComplete) {
                this.completeLevel();
            }
        } else if (this.currentBill > this.budgetLimit && prevObjectives.billLimit) {
            // Jika sebelumnya memenuhi target tapi sekarang melebihi, tampilkan peringatan
            this.showWarning();
        }
    }
    
    hasOptimizedUsage() {
        // Periksa apakah ada waktu penggunaan perangkat yang dioptimalkan (bukan nilai default)
        const defaultTimes = { lamp: 6, ac: 8, tv: 4, fridge: 24, 'rice-cooker': 1, computer: 6 };
        
        return Object.keys(this.devices).some(deviceId => {
            return Math.abs(this.devices[deviceId].time - defaultTimes[deviceId]) > 0.1;
        });
    }
    
    hasViewedCalculations() {
        // Ini akan diatur saat menampilkan detail perangkat atau popup edukasi
        return this.objectives.calculation;
    }
    
    updateObjectiveDisplay() {
        const objectives = {
            'obj-bill-limit': this.objectives.billLimit,
            'obj-efficiency': this.objectives.efficiency,
            'obj-calculation': this.objectives.calculation
        };
        
        Object.keys(objectives).forEach(objId => {
            const element = document.getElementById(objId);
            if (element) {
                const statusSpan = element.querySelector('.obj-status');
                if (statusSpan) {
                    statusSpan.textContent = objectives[objId] ? '✅' : '⏳';
                }
                
                element.className = objectives[objId] ? 'objective completed' : 'objective';
            }
        });
    }
    
    completeLevel() {
        this.isLevelComplete = true;
        
        // Putar efek suara sukses dan suara dramatis
        this.playSuccessSound();
        this.playDramaticSound();
        
        // Tambahkan kunci energi
        this.addEnergyKey(3);
        
        // Tampilkan pesan sukses
        setTimeout(() => {
            this.showSuccessMessage();
        }, 1000);
        
        console.log('Scene 4 Level 3 completed!');
    }
    
    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.remove('hidden');
        }
    }
    
    showWarning() {
        const warningMessage = document.getElementById('warning-message');
        const warningText = document.getElementById('warning-text');
        const suggestionsList = document.getElementById('warning-suggestions-list');
        
        if (warningMessage && warningText && suggestionsList) {
            const overBudget = this.currentBill - this.budgetLimit;
            warningText.textContent = `Tagihan listrik bulan ini adalah Rp${this.currentBill.toLocaleString('id-ID')}, melebihi anggaran Rp${overBudget.toLocaleString('id-ID')}. Silakan sesuaikan waktu penggunaan perangkat.`;
            
            // Buat saran
            const suggestions = this.generateSuggestions();
            suggestionsList.innerHTML = '';
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
            
            warningMessage.classList.remove('hidden');
            this.playBuzzSound();
        }
    }
    
    generateSuggestions() {
        const suggestions = [];
        
        // Analisis perangkat dengan konsumsi energi tinggi
        const deviceConsumption = Object.keys(this.devices).map(deviceId => ({
            id: deviceId,
            name: this.devices[deviceId].name,
            consumption: this.calculateDeviceMonthlyEnergy(deviceId),
            cost: this.calculateDeviceMonthlyEnergy(deviceId) * this.tariffRate
        })).sort((a, b) => b.consumption - a.consumption);
        
        // Berikan saran untuk 3 perangkat dengan konsumsi energi tertinggi
        deviceConsumption.slice(0, 3).forEach(device => {
            if (device.id === 'ac' && this.devices.ac.time > 6) {
                suggestions.push('Kurangi waktu penggunaan AC, atau atur timer untuk mematikan otomatis');
            } else if (device.id === 'computer' && this.devices.computer.time > 8) {
                suggestions.push('Matikan komputer saat tidak digunakan, hindari standby terlalu lama');
            } else if (device.id === 'tv' && this.devices.tv.time > 4) {
                suggestions.push('Kurangi waktu menonton TV, pilih mode hemat energi');
            } else if (device.id === 'lamp' && this.devices.lamp.time > 6) {
                suggestions.push('Manfaatkan cahaya alami, kurangi waktu penggunaan lampu');
            }
        });
        
        if (suggestions.length === 0) {
            suggestions.push('Coba gunakan konfigurasi preset mode hemat energi');
            suggestions.push('Matikan perangkat elektronik yang tidak perlu');
        }
        
        return suggestions;
    }
    
    hideWarning() {
        const warningMessage = document.getElementById('warning-message');
        if (warningMessage) {
            warningMessage.classList.add('hidden');
        }
    }
    
    showEducationalPopup() {
        const popup = document.getElementById('educational-popup');
        if (popup) {
            popup.classList.remove('hidden');
            this.objectives.calculation = true;
            this.checkObjectives();
        }
    }
    
    hideEducationalPopup() {
        const popup = document.getElementById('educational-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }
    
    toggleEducationalDetail() {
        const detail = document.getElementById('edu-detail');
        const btn = document.getElementById('edu-expand-btn');
        
        if (detail && btn) {
            if (detail.classList.contains('expanded')) {
                detail.classList.remove('expanded');
                btn.textContent = 'Pelajari Lebih Lanjut';
            } else {
                detail.classList.add('expanded');
                btn.textContent = 'Tutup';
            }
        }
    }
    
    showHint(message) {
        const hintBubble = document.getElementById('hint-bubble');
        const hintText = document.getElementById('hint-text');
        
        if (hintBubble && hintText) {
            hintText.textContent = message;
            hintBubble.classList.remove('hidden');
            
            // Sembunyikan otomatis setelah 3 detik
            setTimeout(() => {
                this.hideHint();
            }, 3000);
        }
    }
    
    showInitialHint() {
        setTimeout(() => {
            this.showHint('Sesuaikan waktu penggunaan perangkat, kontrol tagihan listrik bulanan dalam Rp300,000');
        }, 1000);
    }
    
    hideHint() {
        const hintBubble = document.getElementById('hint-bubble');
        if (hintBubble) {
            hintBubble.classList.add('hidden');
        }
    }
    
    addEnergyKey(keyNumber) {
        if (!this.energyKeys.includes(keyNumber)) {
            this.energyKeys.push(keyNumber);
            this.updateEnergyKeysDisplay();
            this.saveEnergyKeys();
        }
    }
    
    updateEnergyKeysDisplay() {
        const container = document.getElementById('energy-keys-container');
        if (container) {
            container.innerHTML = '';
            this.energyKeys.forEach(keyNumber => {
                const keyElement = document.createElement('div');
                keyElement.className = 'energy-key';
                keyElement.textContent = `🔑${keyNumber}`;
                keyElement.title = `Kunci Energi ${keyNumber}`;
                container.appendChild(keyElement);
            });
        }
    }
    
    loadEnergyKeys() {
        const saved = localStorage.getItem('energyKeys');
        if (saved) {
            this.energyKeys = JSON.parse(saved);
            this.updateEnergyKeysDisplay();
        }
    }
    
    saveEnergyKeys() {
        localStorage.setItem('energyKeys', JSON.stringify(this.energyKeys));
    }
    
    continueToNextLevel() {
        // Sembunyikan pesan sukses
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.add('hidden');
        }
        
        // Hentikan efek suara lingkungan
        this.stopAmbientSound();
        
        // Pindah ke scene berikutnya
        this.transitionToNextScene();
    }
    
    transitionToNextScene() {
        // Sembunyikan scene saat ini
        const currentScene = document.getElementById('scene4-level3-container');
        if (currentScene) {
            currentScene.classList.add('hidden');
        }
        
        // Di sini seharusnya memuat Scene 5 Level 4
        // Sementara tampilkan informasi petunjuk
        console.log('Transitioning to Scene 5 Level 4...');
        
        // Dapat menambahkan logika transisi scene di sini
        // Contoh: loadScene5Level4();
    }
    
    // Metode efek suara
    playSuccessSound() {
        if (this.sounds.ding) {
            this.sounds.ding.currentTime = 0;
            this.sounds.ding.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playBuzzSound() {
        if (this.sounds.buzz) {
            this.sounds.buzz.currentTime = 0;
            this.sounds.buzz.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playClickSound() {
        if (this.sounds.click) {
            this.sounds.click.currentTime = 0;
            this.sounds.click.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    stopAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.pause();
            this.sounds.ambient.currentTime = 0;
        }
    }
}

// Inisialisasi Scene 4 Level 3
document.addEventListener('DOMContentLoaded', () => {
    // Periksa apakah berada di halaman yang benar
    if (document.getElementById('scene4-level3-container')) {
        window.scene4Level3 = new Scene4Level3();
    }
});

// Ekspor kelas untuk digunakan modul lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene4Level3;
}