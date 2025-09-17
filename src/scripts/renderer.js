import * as THREE from 'three';
import { CameraManager } from './camera.js';
import { City } from './sim/city.js';
import { InputManager } from './input.js';
import { AssetManager } from './assets/assetManager.js';

/**
 * Main Three.js renderer class for SimCity game
 */
export class SimCityRenderer {
  constructor() {
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.city = null;
    this.inputManager = null;
    this.assetManager = null;
    this.isRunning = false;
    this.lastTime = 0;
    
    this.init();
  }

  /**
   * Initialize the Three.js renderer and scene
   */
  async init() {
    try {
      // Get the render target element
      const renderTarget = document.getElementById('three-canvas') || document.getElementById('render-target');
      if (!renderTarget) {
        console.error('Render target element not found');
        return;
      }

      // Create Three.js scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background

      // Create WebGL renderer
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false
      });
      console.log('Renderer created:', this.renderer);
      this.renderer.setSize(renderTarget.clientWidth, renderTarget.clientHeight);
      console.log('Renderer size set to:', renderTarget.clientWidth, 'x', renderTarget.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0x87CEEB, 1.0); // Sky blue background
      console.log('Renderer clear color set to sky blue');
      
      // Add canvas to render target
      renderTarget.appendChild(this.renderer.domElement);
      console.log('Canvas added to render target:', renderTarget);
      console.log('Canvas element:', this.renderer.domElement);
      console.log('Canvas dimensions:', this.renderer.domElement.width, 'x', this.renderer.domElement.height);

      // Create simple UI object for compatibility
      if (!window.ui) {
        window.ui = {
          gameWindow: renderTarget,
          isPaused: false
        };
      }

      // Initialize camera manager
      this.cameraManager = new CameraManager();
      console.log('Camera manager created');
      console.log('Camera type:', this.cameraManager.camera.type);
      console.log('Camera position:', this.cameraManager.camera.position);
      console.log('Camera looking at:', this.cameraManager.cameraOrigin);
      console.log('Camera zoom:', this.cameraManager.camera.zoom);
      console.log('Camera near/far:', this.cameraManager.camera.near, this.cameraManager.camera.far);
      console.log('Camera frustum (left/right/top/bottom):', 
        this.cameraManager.camera.left, this.cameraManager.camera.right, 
        this.cameraManager.camera.top, this.cameraManager.camera.bottom);
      console.log('Camera matrix world:', this.cameraManager.camera.matrixWorld);

      // Initialize input manager
      this.inputManager = new InputManager();

      // Initialize asset manager with callback
      await new Promise((resolve) => {
        this.assetManager = new AssetManager(() => {
          window.assetManager = this.assetManager;
          resolve();
        });
      });

      // Create city
      this.city = new City(16); // Create a 16x16 city
      console.log('City created:', this.city);
      console.log('City children count:', this.city.children.length);
      this.scene.add(this.city);
      this.scene.add(this.city.debugMeshes);
      console.log('Scene children count after adding city:', this.scene.children.length);

      // Add lighting
      this.setupLighting();

      // Add real 3D environment objects
      console.log('=== CREATING 3D ENVIRONMENT ===');
      
      // Create ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x90EE90,
        transparent: true,
        opacity: 0.8
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1;
      ground.receiveShadow = true;
      this.scene.add(ground);
      console.log('Ground plane added');
      
      // Create energy-efficient house
      this.createEnergyEfficientHouse();
      
      // Create solar panels
      this.createSolarPanels();
      
      // Create wind turbines
      this.createWindTurbines();
      
      console.log('Scene children count:', this.scene.children.length);

      // Handle window resize
      window.addEventListener('resize', this.onWindowResize.bind(this));

      // Hide loading screen
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          loadingScreen.style.opacity = '0';
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }
      }, 1000);

      console.log('SimCity renderer initialized successfully');
      
      // Start the render loop
      this.start();
      
    } catch (error) {
      console.error('Failed to initialize SimCity renderer:', error);
    }
  }

  /**
   * Setup scene lighting
   */
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    this.scene.add(directionalLight);
  }

  /**
   * Create energy-efficient house
   */
  createEnergyEfficientHouse() {
    const houseGroup = new THREE.Group();
    
    // House base
    const houseGeometry = new THREE.BoxGeometry(8, 6, 8);
    const houseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    house.position.y = 3;
    house.castShadow = true;
    house.receiveShadow = true;
    houseGroup.add(house);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(6, 3, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 7.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);
    
    // Windows
    for (let i = 0; i < 4; i++) {
      const windowGeometry = new THREE.BoxGeometry(1, 1.5, 0.1);
      const windowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.7
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(
        Math.cos(i * Math.PI / 2) * 4.1,
        2,
        Math.sin(i * Math.PI / 2) * 4.1
      );
      window.rotation.y = i * Math.PI / 2;
      houseGroup.add(window);
    }
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(1.5, 3, 0.1);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 4.1);
    door.castShadow = true;
    houseGroup.add(door);
    
    houseGroup.position.set(0, 0, 0);
    this.scene.add(houseGroup);
    console.log('Energy-efficient house created');
  }

  /**
   * Create solar panels
   */
  createSolarPanels() {
    const solarGroup = new THREE.Group();
    
    for (let i = 0; i < 6; i++) {
      const panelGeometry = new THREE.BoxGeometry(2, 0.1, 1);
      const panelMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2
      });
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(
        (i % 3) * 2.5 - 2.5,
        8,
        Math.floor(i / 3) * 1.5 - 0.75
      );
      panel.rotation.x = -Math.PI / 6; // Tilt towards sun
      panel.castShadow = true;
      solarGroup.add(panel);
    }
    
    solarGroup.position.set(0, 0, 0);
    this.scene.add(solarGroup);
    console.log('Solar panels created');
  }

  /**
   * Create wind turbines
   */
  createWindTurbines() {
    const turbineGroup = new THREE.Group();
    
    for (let i = 0; i < 3; i++) {
      const singleTurbine = new THREE.Group();
      
      // Tower
      const towerGeometry = new THREE.CylinderGeometry(0.2, 0.3, 15);
      const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.y = 7.5;
      tower.castShadow = true;
      singleTurbine.add(tower);
      
      // Nacelle
      const nacelleGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
      const nacelleMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
      const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
      nacelle.position.y = 15;
      nacelle.castShadow = true;
      singleTurbine.add(nacelle);
      
      // Blades
      for (let j = 0; j < 3; j++) {
        const bladeGeometry = new THREE.BoxGeometry(0.1, 8, 0.3);
        const bladeMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5F5 });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.set(0, 15, 0);
        blade.rotation.z = (j * Math.PI * 2) / 3;
        blade.castShadow = true;
        singleTurbine.add(blade);
      }
      
      singleTurbine.position.set(
        (i - 1) * 20,
        0,
        -15
      );
      turbineGroup.add(singleTurbine);
    }
    
    this.scene.add(turbineGroup);
    console.log('Wind turbines created');
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    if (!this.renderer || !this.camera) return;

    const renderTarget = document.getElementById('render-target');
    if (!renderTarget) return;

    this.renderer.setSize(renderTarget.clientWidth, renderTarget.clientHeight);
    this.cameraManager.resize();
  }

  /**
   * Start the render loop
   */
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Stop the render loop
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate.bind(this));

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update city simulation
    if (this.city) {
      // Run simulation steps based on delta time (roughly 1 step per second)
      const simulationSteps = Math.floor(deltaTime);
      if (simulationSteps > 0) {
        this.city.simulate(simulationSteps);
      }
    }

    // Update camera
    if (this.cameraManager) {
      this.cameraManager.updateCameraPosition();
    }

    // Input manager doesn't need update method

    // Debug: Log render info occasionally
     if (Math.random() < 0.1) { // 10% chance to log
       console.log('Rendering scene with', this.scene.children.length, 'children');
       console.log('Camera position:', this.cameraManager.camera.position);
       console.log('Camera looking at:', this.cameraManager.cameraOrigin);
     }

    // Render the scene
    if (this.renderer && this.scene && this.cameraManager?.camera) {
      this.renderer.render(this.scene, this.cameraManager.camera);
    }
  }

  /**
   * Get the current city instance
   */
  getCity() {
    return this.city;
  }

  /**
   * Get the current scene
   */
  getScene() {
    return this.scene;
  }

  /**
   * Get the renderer
   */
  getRenderer() {
    return this.renderer;
  }

  /**
   * Get the camera manager
   */
  getCameraManager() {
    return this.camera;
  }

  /**
   * Dispose of resources
   */
  dispose() {
    this.stop();
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.city) {
      this.city.dispose?.();
    }
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }
}

// Export the renderer class for use by game.js
// The actual initialization will be handled by the Game class

export default SimCityRenderer;