import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class GameRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.gltfLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        this.models = new Map();
        this.gameObjects = [];
        this.clock = new THREE.Clock();
        
        console.log('🎮 GameRenderer initialized');
    }

    async init(canvas) {
        try {
            console.log('🚀 Initializing realistic 3D game...');
            
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
            this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
            
            // Create camera positioned inside living room
            this.camera = new THREE.PerspectiveCamera(
                75, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                1000
            );
            // Position camera to match Unity scene - corner view of living room
            this.camera.position.set(-3, 2, 3);
            
            // Create renderer with shadows
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true,
                powerPreference: "high-performance"
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Enable shadows
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.2;
            
            // Fixed camera - no controls, static view matching Unity
            // Camera positioned to look at center of living room like Unity scene
            this.camera.lookAt(0, 1, 0); // Look at center of room where student character is
            
            // Add mouse interaction for object selection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.interactableObjects = [];
        
        // Game state and effects
        this.gameTime = 0;
        this.dayNightCycle = true;
        this.ambientAudio = null;
        this.particles = [];
        
        // Create simple particle system for atmosphere
        this.createParticleSystem();
            
            // Setup lighting
            this.setupLighting();
            
            // Create ground
            this.createGround();
            
            // Load and place models
            await this.loadGameModels();
            
            console.log('✅ Game renderer initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize renderer:', error);
            return false;
        }
    }

    setupLighting() {
        // Warmer ambient light for Unity-style indoor scene
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);
        
        // Main directional light (window light) - warmer tone like Unity
        this.directionalLight = new THREE.DirectionalLight(0xfff8dc, 1.0);
        this.directionalLight.position.set(3, 5, 2);
        this.directionalLight.castShadow = true;
        
        // Shadow camera settings for indoor scene - tighter for better quality
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 20;
        this.directionalLight.shadow.camera.left = -5;
        this.directionalLight.shadow.camera.right = 5;
        this.directionalLight.shadow.camera.top = 5;
        this.directionalLight.shadow.camera.bottom = -5;
        
        this.scene.add(this.directionalLight);
        
        // Point light for room illumination - warmer tone
        const pointLight = new THREE.PointLight(0xfff8dc, 0.5, 8);
        pointLight.position.set(-1, 2.5, 0);
        pointLight.castShadow = true;
        this.scene.add(pointLight);
        
        // Hemisphere light for natural indoor lighting - Unity style
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.4);
        this.scene.add(hemisphereLight);
        
        console.log('💡 Unity-style indoor lighting setup complete');
    }

    createGround() {
        // Create a large ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3a5f3a,
            transparent: true,
            opacity: 0.8
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        console.log('🌱 Ground created');
    }

    async loadModel(modelPath) {
        return new Promise((resolve, reject) => {
            const isFBX = modelPath.toLowerCase().endsWith('.fbx');
            const loader = isFBX ? this.fbxLoader : this.gltfLoader;
            
            loader.load(
                modelPath,
                (loadedModel) => {
                    // For GLTF, the model is in .scene property, for FBX it's the object itself
                    const model = isFBX ? loadedModel : loadedModel.scene;
                    
                    // Enable shadows for all meshes
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Enhance materials
                            if (child.material) {
                                child.material.needsUpdate = true;
                                
                                // For FBX models, ensure proper material setup
                                if (isFBX && child.material.map) {
                                    child.material.map.flipY = false;
                                }
                            }
                        }
                    });
                    
                    resolve(model);
                },
                (progress) => {
                    console.log(`Loading ${modelPath}: ${(progress.loaded / progress.total * 100)}%`);
                },
                (error) => {
                    console.error(`Failed to load ${modelPath}:`, error);
                    reject(error);
                }
            );
        });
    }

    async loadGameModels() {
        console.log('📦 Loading game models...');
        
        try {
            // Load models focused on student character in living room
            const modelsToLoad = [
                { path: '/models/living-room.fbx', position: [0, 0, 0], scale: 0.03, type: 'living-room' },
                { path: '/models/player.fbx', position: [0, 0, 0], scale: 0.015, type: 'student' },
                { path: '/models/table.fbx', position: [-2, 0, -1.5], scale: 0.015, type: 'table' },
                { path: '/models/socket.fbx', position: [1.5, 0.5, -2], scale: 0.03, type: 'socket' },
                { path: '/models/monitor.fbx', position: [-2, 0.4, -1.5], scale: 0.01, type: 'monitor' }
            ];

            for (const modelInfo of modelsToLoad) {
                try {
                    const model = await this.loadModel(modelInfo.path);
                    
                    // Position and scale the model
                    model.position.set(...modelInfo.position);
                    model.scale.setScalar(modelInfo.scale);
                    
                    // Make objects interactable
                    model.userData = { 
                        type: modelInfo.type,
                        originalMaterial: null,
                        isInteractable: true 
                    };
                    this.interactableObjects.push(model);
                    
                    // Add to scene
                    this.scene.add(model);
                    this.gameObjects.push(model);
                    
                    console.log(`✅ Loaded: ${modelInfo.path}`);
                    
                } catch (error) {
                    console.warn(`⚠️ Could not load ${modelInfo.path}, skipping...`);
                }
            }
            
            console.log(`🎯 Loaded ${this.gameObjects.length} models successfully`);
            
        } catch (error) {
            console.error('❌ Error loading models:', error);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // Update game time for day/night cycle
        this.gameTime += 0.01;
        this.updateDayNightCycle();
        this.updateParticles();
        
        // No controls - camera is fixed
        
        // Animate some objects
        this.gameObjects.forEach((obj, index) => {
            if (obj.userData.type === 'vehicle') {
                // Slight bobbing animation for vehicles
                obj.position.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
            }
        });
        
        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    updateDayNightCycle() {
        if (!this.dayNightCycle) return;
        
        // Create a slow day/night cycle (full cycle in ~60 seconds)
        const timeOfDay = (Math.sin(this.gameTime * 0.1) + 1) / 2; // 0 to 1
        
        // Update ambient light intensity
        this.ambientLight.intensity = 0.3 + (timeOfDay * 0.4); // 0.3 to 0.7
        
        // Update directional light
        this.directionalLight.intensity = 0.5 + (timeOfDay * 0.8); // 0.5 to 1.3
        
        // Change sky color based on time
        const skyColor = new THREE.Color();
        if (timeOfDay > 0.8) {
            // Day time - bright blue
            skyColor.setHSL(0.6, 0.8, 0.8);
        } else if (timeOfDay > 0.2) {
            // Transition
            const factor = (timeOfDay - 0.2) / 0.6;
            skyColor.setHSL(0.6, 0.8, 0.3 + (factor * 0.5));
        } else {
            // Night time - dark blue
            skyColor.setHSL(0.65, 0.9, 0.1);
        }
        
        this.scene.background = skyColor;
        
        // Update fog color to match sky
        this.scene.fog.color = skyColor;
    }

    createParticleSystem() {
        // Create floating particles for atmosphere (like dust or small debris)
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200; // x
            positions[i * 3 + 1] = Math.random() * 50 + 5; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
        
        console.log('✨ Particle system created');
    }

    updateParticles() {
        if (this.particleSystem) {
            // Gentle floating motion for particles
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Slow vertical movement
                positions[i + 1] += Math.sin(this.gameTime + i) * 0.01;
                
                // Reset particles that go too high
                if (positions[i + 1] > 60) {
                    positions[i + 1] = 5;
                }
                
                // Gentle horizontal drift
                positions[i] += Math.sin(this.gameTime * 0.5 + i) * 0.005;
                positions[i + 2] += Math.cos(this.gameTime * 0.3 + i) * 0.005;
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }

    start() {
        console.log('🎬 Starting game animation loop');
        this.animate();
        this.setupEventListeners();
    }

    getModelType(path) {
        if (path.includes('building')) return 'building';
        if (path.includes('car') || path.includes('truck')) return 'vehicle';
        if (path.includes('tree')) return 'nature';
        if (path.includes('lamp')) return 'infrastructure';
        if (path.includes('excavator')) return 'construction';
        return 'object';
    }

    setupEventListeners() {
        // Mouse click for object selection
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });

        // Mouse move for hover effects
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });
    }

    onMouseClick(event) {
        this.updateMousePosition(event);
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object.parent || intersects[0].object;
            this.selectObject(clickedObject);
        } else {
            this.deselectObject();
        }
    }

    onMouseMove(event) {
        this.updateMousePosition(event);
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
        
        // Change cursor on hover
        if (intersects.length > 0) {
            this.renderer.domElement.style.cursor = 'pointer';
        } else {
            this.renderer.domElement.style.cursor = 'default';
        }
    }

    updateMousePosition(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    selectObject(object) {
        // Deselect previous object
        this.deselectObject();
        
        this.selectedObject = object;
        
        // Add highlight effect
        object.traverse((child) => {
            if (child.isMesh && child.material) {
                child.userData.originalMaterial = child.material;
                // Handle both single materials and material arrays
                if (Array.isArray(child.material)) {
                    child.material = child.material.map(mat => mat.clone ? mat.clone() : mat);
                    child.material.forEach(mat => {
                        if (mat.emissive) mat.emissive.setHex(0x444444);
                    });
                } else if (child.material.clone) {
                    child.material = child.material.clone();
                    if (child.material.emissive) child.material.emissive.setHex(0x444444);
                }
            }
        });
        
        // Update UI with object info
        this.updateObjectInfo(object);
        console.log(`Selected: ${object.userData.type} object`);
    }

    deselectObject() {
        if (this.selectedObject) {
            // Remove highlight effect
            this.selectedObject.traverse((child) => {
                if (child.isMesh && child.userData.originalMaterial) {
                    child.material = child.userData.originalMaterial;
                }
            });
            this.selectedObject = null;
            this.clearObjectInfo();
        }
    }

    updateObjectInfo(object) {
        const infoElement = document.getElementById('object-info');
        if (infoElement) {
            infoElement.innerHTML = `
                <h3>Selected Object</h3>
                <p><strong>Type:</strong> ${object.userData.type}</p>
                <p><strong>Position:</strong> ${object.position.x.toFixed(1)}, ${object.position.y.toFixed(1)}, ${object.position.z.toFixed(1)}</p>
                <p><strong>Scale:</strong> ${object.scale.x.toFixed(1)}</p>
            `;
            infoElement.style.display = 'block';
        }
    }

    clearObjectInfo() {
        const infoElement = document.getElementById('object-info');
        if (infoElement) {
            infoElement.style.display = 'none';
        }
    }

    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        console.log('🧹 Renderer disposed');
    }
}

// Export for backward compatibility
export const SimCityRenderer = GameRenderer;