class ElectricalExperimentsUI {
    constructor() {
        this.experiments = new ElectricalExperiments();
        this.educationalContent = new EducationalContent();
        this.currentExperimentIndex = 0;
        this.score = 0;
        this.isConnected = false;
        this.completedExperiments = new Set();
        
        this.initializeUI();
        this.setupEventListeners();
        this.loadExperiment(0);
        this.setupCategoryFilter();
        this.startEducationalTips();
    }

    initializeUI() {
        // Update total number
        document.getElementById('total-number').textContent = this.experiments.experiments.length;
        document.getElementById('nav-total').textContent = this.experiments.experiments.length;
        
        // Initialize progress
        this.updateProgress();
    }

    setupEventListeners() {
        // Connection controls
        document.getElementById('connect-btn').addEventListener('click', () => this.connectObjects());
        document.getElementById('test-btn').addEventListener('click', () => this.testConnection());
        document.getElementById('complete-btn').addEventListener('click', () => this.completeExperiment());
        
        // Navigation
        document.getElementById('prev-btn').addEventListener('click', () => this.previousExperiment());
        document.getElementById('next-btn').addEventListener('click', () => this.nextExperiment());
        
        // Object interactions
        document.getElementById('left-object').addEventListener('click', () => this.showObjectDetails('left'));
        document.getElementById('right-object').addEventListener('click', () => this.showObjectDetails('right'));
        document.getElementById('connector').addEventListener('click', () => this.showConnectorDetails());
    }

    setupCategoryFilter() {
        const categories = [...new Set(this.experiments.experiments.map(obj => obj.category))];
        const filterContainer = document.getElementById('category-filter');
        
        // Clear existing buttons except "Semua"
        const allBtn = filterContainer.querySelector('[data-category="all"]');
        filterContainer.innerHTML = '';
        filterContainer.appendChild(allBtn);
        
        // Add category buttons
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category;
            btn.dataset.category = category;
            btn.addEventListener('click', () => this.filterByCategory(category));
            filterContainer.appendChild(btn);
        });
        
        // All button event listener
        allBtn.addEventListener('click', () => this.filterByCategory('all'));
    }

    filterByCategory(category) {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        if (category === 'all') {
            return;
        }
        
        // Find first experiment in category
        const categoryIndex = this.experiments.experiments.findIndex(obj => obj.category === category);
        if (categoryIndex !== -1) {
            this.loadExperiment(categoryIndex);
        }
    }

    loadExperiment(index) {
        if (index < 0 || index >= this.experiments.experiments.length) return;
        
        this.currentExperimentIndex = index;
        const experiment = this.experiments.experiments[index];
        
        // Reset connection state
        this.isConnected = false;
        this.resetConnectionUI();
        
        // Update experiment info
        document.getElementById('experiment-title').textContent = experiment.name;
        document.getElementById('experiment-category').textContent = experiment.category;
        
        // Update difficulty badge
        const difficultyBadge = document.getElementById('difficulty-badge');
        difficultyBadge.textContent = experiment.difficulty;
        difficultyBadge.className = `difficulty-badge difficulty-${experiment.difficulty.toLowerCase()}`;
        
        // Update objects
        this.updateLeftObject(experiment);
        this.updateRightObject(experiment);
        this.updateConnector(experiment);
        
        // Update info panel
        document.getElementById('experiment-description').textContent = experiment.description;
        document.getElementById('task-section').textContent = experiment.task;
        document.getElementById('explanation-section').textContent = experiment.explanation;
        
        // Update specifications
        document.getElementById('spec-voltage').textContent = experiment.voltage;
        document.getElementById('spec-resistance').textContent = experiment.resistance;
        document.getElementById('spec-type').textContent = experiment.type;
        
        // Update educational content
        this.updateEducationalContent(experiment);
        
        // Update counters
        document.getElementById('current-number').textContent = index + 1;
        document.getElementById('nav-current').textContent = index + 1;
        
        // Update navigation buttons
        document.getElementById('prev-btn').disabled = index === 0;
        document.getElementById('next-btn').disabled = index === this.experiments.experiments.length - 1;
        
        this.updateProgress();
    }

    updateLeftObject(experiment) {
        document.getElementById('left-name').textContent = experiment.leftObject.name;
        document.getElementById('left-voltage').textContent = experiment.leftObject.voltage + 'V';
        document.querySelector('#left-object .object-icon').textContent = '🔋';
    }

    updateRightObject(experiment) {
        document.getElementById('right-name').textContent = experiment.rightObject.name;
        document.getElementById('right-voltage').textContent = experiment.rightObject.voltage + 'V';
        document.querySelector('#right-object .object-icon').textContent = '⚡';
    }

    updateConnector(experiment) {
        document.getElementById('connector-name').textContent = experiment.connector.name;
    }

    connectObjects() {
        if (this.isConnected) return;
        
        this.isConnected = true;
        const connector = document.getElementById('connector');
        const connectionLine = document.getElementById('connection-line');
        
        // Visual feedback
        connector.classList.add('connected');
        connector.innerHTML = '<span>🔗 Terhubung</span>';
        connectionLine.classList.add('active');
        
        // Enable test button
        document.getElementById('test-btn').disabled = false;
        document.getElementById('connect-btn').disabled = true;
        
        this.showFeedback('Objek berhasil dihubungkan! Sekarang test rangkaian.', 'success');
    }

    testConnection() {
        if (!this.isConnected) return;
        
        const experiment = this.experiments.experiments[this.currentExperimentIndex];
        const isWorking = this.experiments.testConnection(this.currentExperimentIndex);
        
        if (isWorking) {
            // Add electrical effects
            this.addElectricalEffects();
            document.getElementById('complete-btn').disabled = false;
            document.getElementById('test-btn').disabled = true;
            
            this.showFeedback(`✅ Rangkaian berfungsi! ${experiment.successMessage}`, 'success');
        } else {
            this.showFeedback(`❌ Rangkaian tidak berfungsi. ${experiment.failureMessage}`, 'error');
        }
    }

    addElectricalEffects() {
        // Add sparkling effect to objects
        const leftObject = document.getElementById('left-object');
        const rightObject = document.getElementById('right-object');
        
        leftObject.style.boxShadow = '0 0 20px #4CAF50, 0 0 40px #8BC34A';
        rightObject.style.boxShadow = '0 0 20px #4CAF50, 0 0 40px #8BC34A';
        
        // Add voltage indicator
        const experiment = this.experiments.experiments[this.currentExperimentIndex];
        document.getElementById('left-voltage').style.color = '#4CAF50';
        document.getElementById('right-voltage').style.color = '#4CAF50';
    }

    completeExperiment() {
        if (!this.isConnected) return;
        
        this.completedExperiments.add(this.currentExperimentIndex);
        this.score += 10;
        document.getElementById('score').textContent = this.score;
        
        this.showFeedback('🎉 Eksperimen selesai! +10 poin', 'success');
        
        // Auto advance after 2 seconds
        setTimeout(() => {
            if (this.currentExperimentIndex < this.experiments.objects.length - 1) {
                this.nextExperiment();
            } else {
                this.showCompletionMessage();
            }
        }, 2000);
    }

    showCompletionMessage() {
        this.showFeedback('🏆 Selamat! Anda telah menyelesaikan semua 50 eksperimen listrik!', 'success');
    }

    resetConnectionUI() {
        const connector = document.getElementById('connector');
        const connectionLine = document.getElementById('connection-line');
        const leftObject = document.getElementById('left-object');
        const rightObject = document.getElementById('right-object');
        
        // Reset connector
        connector.classList.remove('connected');
        connector.innerHTML = '<span id="connector-name">Kabel Tembaga</span>';
        connectionLine.classList.remove('active');
        
        // Reset buttons
        document.getElementById('connect-btn').disabled = false;
        document.getElementById('test-btn').disabled = true;
        document.getElementById('complete-btn').disabled = true;
        
        // Reset visual effects
        leftObject.style.boxShadow = '';
        rightObject.style.boxShadow = '';
        document.getElementById('left-voltage').style.color = '';
        document.getElementById('right-voltage').style.color = '';
        
        // Hide feedback
        this.hideFeedback();
    }

    previousExperiment() {
        if (this.currentExperimentIndex > 0) {
            this.loadExperiment(this.currentExperimentIndex - 1);
        }
    }

    nextExperiment() {
        if (this.currentExperimentIndex < this.experiments.experiments.length - 1) {
            this.loadExperiment(this.currentExperimentIndex + 1);
        }
    }

    updateProgress() {
        const progress = ((this.currentExperimentIndex + 1) / this.experiments.experiments.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    updateEducationalContent(experiment) {
        const tipElement = document.getElementById('educational-tip');
        const formulaElement = document.getElementById('formula-display');
        
        if (tipElement) {
            const tips = this.educationalContent.getTipsByCategory(experiment.category);
            if (tips && tips.length > 0) {
                tipElement.textContent = tips[Math.floor(Math.random() * tips.length)];
            } else {
                tipElement.textContent = this.educationalContent.getRandomTip();
            }
        }
        
        if (formulaElement) {
            const formula = this.educationalContent.getFormula('ohm');
            if (formula) {
                formulaElement.innerHTML = `<strong>Hukum Ohm:</strong> ${formula.formula}<br><small>${formula.description}</small>`;
            }
        }
        
        // Update real-world applications
        const apps = this.educationalContent.getApplications(experiment.title);
        const appsContainer = document.getElementById('real-world-apps');
        if (appsContainer && apps) {
            appsContainer.innerHTML = apps.map(app => `<div>${app}</div>`).join('');
        }
    }

    startEducationalTips() {
        // Rotate educational tips every 10 seconds
        setInterval(() => {
            const randomTip = this.educationalContent.getRandomTip();
            const tipElement = document.getElementById('educational-tip');
            if (tipElement) {
                tipElement.style.opacity = '0';
                setTimeout(() => {
                    tipElement.textContent = randomTip;
                    tipElement.style.opacity = '1';
                }, 300);
            }
        }, 10000);
    }

    showObjectDetails(side) {
        const experiment = this.experiments.experiments[this.currentExperimentIndex];
        const object = side === 'left' ? experiment.leftObject : experiment.rightObject;
        
        this.showFeedback(`${object.name}: ${object.type} (${object.voltage}V)`, 'info');
    }

    showConnectorDetails() {
        const experiment = this.experiments.experiments[this.currentExperimentIndex];
        this.showFeedback(`${experiment.connector.name}: ${experiment.connector.description}`, 'info');
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback show ${type}`;
        
        if (type === 'info') {
            feedback.style.background = 'rgba(33, 150, 243, 0.3)';
            feedback.style.border = '2px solid #2196F3';
            feedback.style.color = '#2196F3';
        }
    }

    hideFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('show');
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousExperiment();
                    break;
                case 'ArrowRight':
                    this.nextExperiment();
                    break;
                case ' ':
                    e.preventDefault();
                    if (!this.isConnected) {
                        this.connectObjects();
                    } else if (!document.getElementById('test-btn').disabled) {
                        this.testConnection();
                    }
                    break;
                case 'Enter':
                    if (!document.getElementById('complete-btn').disabled) {
                        this.completeExperiment();
                    }
                    break;
            }
        });
    }

    // Random experiment selector
    loadRandomExperiment() {
        const randomIndex = Math.floor(Math.random() * this.experiments.experiments.length);
        this.loadExperiment(randomIndex);
    }

    // Search functionality
    searchExperiments(query) {
        const results = this.experiments.experiments.filter((obj, index) => 
            obj.name.toLowerCase().includes(query.toLowerCase()) ||
            obj.category.toLowerCase().includes(query.toLowerCase()) ||
            obj.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length > 0) {
            const firstResultIndex = this.experiments.experiments.indexOf(results[0]);
            this.loadExperiment(firstResultIndex);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ElectricalExperimentsUI();
    
    // Setup keyboard shortcuts
    app.setupKeyboardShortcuts();
    
    // Add search functionality (if search input exists)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            app.searchExperiments(e.target.value);
        });
    }
    
    // Add random button functionality (if random button exists)
    const randomBtn = document.getElementById('random-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            app.loadRandomExperiment();
        });
    }
    
    // Expose app to global scope for debugging
    window.electricalApp = app;
});

// Add some utility functions
function formatVoltage(voltage) {
    if (voltage >= 1000) {
        return `${voltage / 1000}kV`;
    }
    return `${voltage}V`;
}

function formatPower(power) {
    if (power >= 1000) {
        return `${power / 1000}kW`;
    }
    return `${power}W`;
}

function formatResistance(resistance) {
    if (resistance >= 1000000) {
        return `${resistance / 1000000}MΩ`;
    } else if (resistance >= 1000) {
        return `${resistance / 1000}kΩ`;
    }
    return `${resistance}Ω`;
}

// Educational content helpers
function showElectricalFormula(type) {
    const formulas = {
        ohm: "V = I × R (Hukum Ohm)",
        power: "P = V × I (Daya Listrik)",
        energy: "E = P × t (Energi Listrik)",
        resistance: "R = ρ × L / A (Resistansi)"
    };
    
    return formulas[type] || "Formula tidak ditemukan";
}

function getElectricalTip() {
    const tips = [
        "💡 Selalu matikan peralatan listrik saat tidak digunakan",
        "⚡ Gunakan peralatan berlabel hemat energi",
        "🔌 Cabut charger dari stop kontak saat tidak digunakan",
        "🏠 Gunakan lampu LED untuk menghemat listrik",
        "❄️ Atur suhu AC pada 24-26°C untuk efisiensi optimal",
        "🔋 Baterai rechargeable lebih ramah lingkungan",
        "⚠️ Jangan menyentuh kabel listrik yang rusak",
        "🌱 Energi terbarukan adalah masa depan listrik"
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
}

// Show random tip every 30 seconds
setInterval(() => {
    const tipElement = document.getElementById('electrical-tip');
    if (tipElement) {
        tipElement.textContent = getElectricalTip();
    }
}, 30000);