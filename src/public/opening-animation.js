// Opening Animation Controller
class OpeningAnimation {
    constructor() {
        this.currentScene = 0;
        this.scenes = [
            { id: 'scene1', duration: 8000 }, // 8 seconds
            { id: 'scene2', duration: 7000 }, // 7 seconds  
            { id: 'scene3', duration: 6000 }, // 6 seconds
            { id: 'scene4', duration: 5000 }  // 5 seconds
        ];
        this.isPlaying = false;
        this.audioElements = {};
        this.init();
    }

    init() {
        this.setupAudio();
        this.setupProgressIndicator();
        this.setupContinueButton();
        this.setupInteractiveElements();
        this.startAnimation();
    }

    setupInteractiveElements() {
        // Setup interactive elements for real object interactions
        this.setupTVInteraction();
        this.setupLightInteraction();
        this.setupElectricalEquipmentInteraction();
        this.setupCharacterInteraction();
    }

    setupTVInteraction() {
        // TV interaction in scene 1
        const tvScreen = document.querySelector('.tv-screen');
        const tvStatic = document.querySelector('.tv-static');
        
        if (tvScreen) {
            // TV channel switching effect
            setInterval(() => {
                if (this.currentScene === 0) {
                    tvScreen.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                    
                    // Random static interference
                    if (Math.random() < 0.1) {
                        if (tvStatic) {
                            tvStatic.style.opacity = Math.random() * 0.3;
                            setTimeout(() => {
                                tvStatic.style.opacity = '0';
                            }, 100);
                        }
                    }
                }
            }, 2000);

            // TV brightness fluctuation
            setInterval(() => {
                if (this.currentScene === 0) {
                    const brightness = 0.8 + Math.random() * 0.4;
                    tvScreen.style.filter = `brightness(${brightness})`;
                }
            }, 500);
        }
    }

    setupLightInteraction() {
        // House window lights interaction
        const windows = document.querySelectorAll('.window');
        const windowLights = document.querySelectorAll('.window-light');
        
        windows.forEach((window, index) => {
            if (window) {
                // Random light flickering
                setInterval(() => {
                    if (this.currentScene === 0 || this.currentScene === 1) {
                        const intensity = 0.3 + Math.random() * 0.7;
                        window.style.boxShadow = `inset 0 0 20px rgba(255, 255, 150, ${intensity})`;
                        
                        // Simulate someone moving inside
                        if (Math.random() < 0.05) {
                            window.style.background = `rgba(255, 255, 150, ${0.1 + Math.random() * 0.3})`;
                            setTimeout(() => {
                                window.style.background = `rgba(255, 255, 150, ${0.4 + Math.random() * 0.2})`;
                            }, 1000 + Math.random() * 2000);
                        }
                    }
                }, 1000 + index * 500);
            }
        });

        // Laboratory equipment lights
        const equipmentLights = document.querySelectorAll('.equipment-light, .power-indicator');
        equipmentLights.forEach((light, index) => {
            if (light) {
                setInterval(() => {
                    if (this.currentScene === 1) {
                        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
                        light.style.background = colors[Math.floor(Math.random() * colors.length)];
                        light.style.boxShadow = `0 0 10px ${light.style.background}`;
                    }
                }, 800 + index * 200);
            }
        });
    }

    setupElectricalEquipmentInteraction() {
        // Oscilloscope screen simulation
        const oscilloscope = document.querySelector('.oscilloscope-screen');
        if (oscilloscope) {
            this.animateOscilloscope(oscilloscope);
        }

        // Multimeter display simulation
        const multimeterDisplay = document.querySelector('.multimeter-display');
        if (multimeterDisplay) {
            this.animateMultimeter(multimeterDisplay);
        }

        // Generator coils rotation with varying speed
        const coils = document.querySelectorAll('.coils');
        coils.forEach(coil => {
            if (coil) {
                setInterval(() => {
                    if (this.currentScene === 1) {
                        const speed = 1 + Math.random() * 2;
                        coil.style.animationDuration = `${3 / speed}s`;
                    }
                }, 2000);
            }
        });

        // Circuit board LED simulation
        const circuitBoard = document.querySelector('.circuit-board');
        if (circuitBoard) {
            this.animateCircuitBoard(circuitBoard);
        }
    }

    animateOscilloscope(screen) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        screen.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let time = 0;
        
        const drawWaveform = () => {
            if (this.currentScene !== 1) return;
            
            ctx.fillStyle = '#001100';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x < canvas.width; x++) {
                const frequency = 0.05 + Math.random() * 0.02;
                const amplitude = 20 + Math.random() * 10;
                const y = canvas.height / 2 + Math.sin((x + time) * frequency) * amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            time += 2;
            
            requestAnimationFrame(drawWaveform);
        };
        
        drawWaveform();
    }

    animateMultimeter(display) {
        setInterval(() => {
            if (this.currentScene === 1) {
                const voltage = (220 + Math.random() * 20 - 10).toFixed(1);
                const current = (Math.random() * 5).toFixed(2);
                const power = (voltage * current).toFixed(0);
                
                display.innerHTML = `
                    <div style="color: #ff0000; font-size: 0.8em;">V: ${voltage}V</div>
                    <div style="color: #00ff00; font-size: 0.8em;">I: ${current}A</div>
                    <div style="color: #0000ff; font-size: 0.8em;">P: ${power}W</div>
                `;
            }
        }, 1000);
    }

    animateCircuitBoard(board) {
        // Create LED indicators
        for (let i = 0; i < 8; i++) {
            const led = document.createElement('div');
            led.className = 'circuit-led';
            led.style.position = 'absolute';
            led.style.width = '4px';
            led.style.height = '4px';
            led.style.borderRadius = '50%';
            led.style.left = `${20 + (i % 4) * 20}%`;
            led.style.top = `${30 + Math.floor(i / 4) * 40}%`;
            board.appendChild(led);
            
            // Animate each LED
            setInterval(() => {
                if (this.currentScene === 1) {
                    const isOn = Math.random() < 0.7;
                    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
                    led.style.background = isOn ? colors[i % colors.length] : '#333';
                    led.style.boxShadow = isOn ? `0 0 5px ${led.style.background}` : 'none';
                }
            }, 500 + i * 100);
        }
    }

    setupCharacterInteraction() {
        // Player avatar eye blinking and movement
        const avatarEyes = document.querySelectorAll('.eye');
        avatarEyes.forEach(eye => {
            if (eye) {
                // Random blinking
                setInterval(() => {
                    if (this.currentScene === 2) {
                        eye.style.transform = 'scaleY(0.1)';
                        setTimeout(() => {
                            eye.style.transform = 'scaleY(1)';
                        }, 150);
                    }
                }, 2000 + Math.random() * 3000);
            }
        });

        // Detective badge shine effect
        const detectiveBadge = document.querySelector('.detective-badge');
        if (detectiveBadge) {
            setInterval(() => {
                if (this.currentScene === 2) {
                    detectiveBadge.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                }
            }, 1000);
        }

        // Mission briefing text typing effect
        const briefingContent = document.querySelector('.briefing-content');
        if (briefingContent) {
            const originalText = briefingContent.textContent;
            let currentText = '';
            let charIndex = 0;
            
            const typeText = () => {
                if (this.currentScene === 2 && charIndex < originalText.length) {
                    currentText += originalText[charIndex];
                    briefingContent.textContent = currentText;
                    charIndex++;
                    setTimeout(typeText, 50 + Math.random() * 50);
                }
            };
            
            // Start typing when scene 3 begins
            setTimeout(() => {
                if (this.currentScene === 2) {
                    briefingContent.textContent = '';
                    currentText = '';
                    charIndex = 0;
                    typeText();
                }
            }, 1000);
        }
    }

    setupAudio() {
        // Setup audio elements
        this.audioElements = {
            backgroundMusic: document.getElementById('background-music'),
            newsReport: document.getElementById('news-report-audio'),
            scientistMessage: document.getElementById('scientist-message-audio'),
            windEffect: document.getElementById('wind-effect-audio'),
            electricEffect: document.getElementById('electric-effect-audio')
        };

        // Set audio properties
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.volume = 0.3;
            this.audioElements.backgroundMusic.loop = true;
        }

        if (this.audioElements.newsReport) {
            this.audioElements.newsReport.volume = 0.7;
        }

        if (this.audioElements.scientistMessage) {
            this.audioElements.scientistMessage.volume = 0.8;
        }

        if (this.audioElements.windEffect) {
            this.audioElements.windEffect.volume = 0.4;
        }

        if (this.audioElements.electricEffect) {
            this.audioElements.electricEffect.volume = 0.5;
        }
    }

    setupProgressIndicator() {
        const progressContainer = document.querySelector('.progress-dots');
        if (progressContainer) {
            progressContainer.innerHTML = '';
            
            for (let i = 0; i < this.scenes.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.setAttribute('data-scene', i);
                progressContainer.appendChild(dot);
            }
        }
    }

    setupContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.nextScene();
            });
        }
    }

    startAnimation() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        
        // Start background music
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.play().catch(e => console.log('Audio autoplay prevented'));
        }

        // Show first scene
        this.showScene(0);
    }

    showScene(sceneIndex) {
        if (sceneIndex >= this.scenes.length) {
            this.endAnimation();
            return;
        }

        // Hide all scenes
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });

        // Show current scene
        const currentSceneElement = document.getElementById(this.scenes[sceneIndex].id);
        if (currentSceneElement) {
            currentSceneElement.classList.add('active');
        }

        // Update progress indicator
        this.updateProgressIndicator(sceneIndex);

        // Play scene-specific audio and effects
        this.playSceneAudio(sceneIndex);

        // Auto advance to next scene after duration
        setTimeout(() => {
            if (this.isPlaying && sceneIndex === this.currentScene) {
                this.nextScene();
            }
        }, this.scenes[sceneIndex].duration);

        this.currentScene = sceneIndex;
    }

    playSceneAudio(sceneIndex) {
        // Stop all audio first
        Object.values(this.audioElements).forEach(audio => {
            if (audio && audio !== this.audioElements.backgroundMusic) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        // Play scene-specific audio
        switch (sceneIndex) {
            case 0: // Scene 1: News Report
                if (this.audioElements.newsReport) {
                    setTimeout(() => {
                        this.audioElements.newsReport.play().catch(e => console.log('Audio play failed'));
                    }, 2000);
                }
                break;

            case 1: // Scene 2: Scientist Message
                if (this.audioElements.scientistMessage) {
                    setTimeout(() => {
                        this.audioElements.scientistMessage.play().catch(e => console.log('Audio play failed'));
                    }, 1500);
                }
                break;

            case 2: // Scene 3: Wind Effect
                if (this.audioElements.windEffect) {
                    setTimeout(() => {
                        this.audioElements.windEffect.play().catch(e => console.log('Audio play failed'));
                    }, 1000);
                }
                break;

            case 3: // Scene 4: Electric Effect
                if (this.audioElements.electricEffect) {
                    setTimeout(() => {
                        this.audioElements.electricEffect.play().catch(e => console.log('Audio play failed'));
                    }, 500);
                }
                break;
        }
    }

    updateProgressIndicator(activeIndex) {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            if (index <= activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    nextScene() {
        if (this.currentScene < this.scenes.length - 1) {
            this.showScene(this.currentScene + 1);
        } else {
            this.endAnimation();
        }
    }

    endAnimation() {
        this.isPlaying = false;
        
        // Fade out background music
        if (this.audioElements.backgroundMusic) {
            const fadeOut = setInterval(() => {
                if (this.audioElements.backgroundMusic.volume > 0.1) {
                    this.audioElements.backgroundMusic.volume -= 0.1;
                } else {
                    this.audioElements.backgroundMusic.pause();
                    clearInterval(fadeOut);
                }
            }, 200);
        }

        // Redirect to main menu after a short delay
        setTimeout(() => {
            window.location.href = 'main-menu.html';
        }, 2000);
    }

    // Method to handle user interaction for audio autoplay
    enableAudio() {
        // This method can be called after user interaction to enable audio
        if (this.audioElements.backgroundMusic && this.audioElements.backgroundMusic.paused) {
            this.audioElements.backgroundMusic.play().catch(e => console.log('Audio play failed'));
        }
    }
}

// Utility functions for scene effects
class SceneEffects {
    static createStars(container) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.position = 'absolute';
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.backgroundColor = 'white';
            star.style.borderRadius = '50%';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.opacity = Math.random() * 0.8 + 0.2;
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
            container.appendChild(star);
        }
    }

    static createElectricBolts(container) {
        for (let i = 0; i < 5; i++) {
            const bolt = document.createElement('div');
            bolt.className = 'electric-bolt';
            bolt.style.position = 'absolute';
            bolt.style.width = '2px';
            bolt.style.height = Math.random() * 100 + 50 + 'px';
            bolt.style.background = 'linear-gradient(to bottom, #00ff88, transparent)';
            bolt.style.left = Math.random() * 100 + '%';
            bolt.style.top = Math.random() * 50 + '%';
            bolt.style.animation = `electricFlash ${Math.random() * 2 + 1}s ease-in-out infinite`;
            container.appendChild(bolt);
        }
    }

    static addParticleEffect(container, type = 'dust') {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = type === 'dust' ? 'rgba(255,255,255,0.3)' : '#00ff88';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${Math.random() * 5 + 3}s ease-in-out infinite`;
            container.appendChild(particle);
        }
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
        
        @keyframes electricFlash {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize opening animation
    const openingAnimation = new OpeningAnimation();

    // Add scene effects
    const scene1 = document.getElementById('scene1');
    if (scene1) {
        SceneEffects.createStars(scene1);
    }

    const scene4 = document.getElementById('scene4');
    if (scene4) {
        SceneEffects.createElectricBolts(scene4);
        SceneEffects.addParticleEffect(scene4, 'energy');
    }

    // Handle user interaction for audio autoplay
    document.addEventListener('click', () => {
        openingAnimation.enableAudio();
    }, { once: true });

    // Prevent right-click and F12 (optional security)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
        }
    });
});

// Export for potential external use
window.OpeningAnimation = OpeningAnimation;
window.SceneEffects = SceneEffects;