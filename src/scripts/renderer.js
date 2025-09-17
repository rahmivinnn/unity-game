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

      // Add test objects to verify rendering is working
      console.log('=== CREATING TEST OBJECTS ===');
      
      // Red cube
      const testGeometry = new THREE.BoxGeometry(1, 1, 1);
      const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const testCube = new THREE.Mesh(testGeometry, testMaterial);
      testCube.position.set(-2, 0, -5);
      this.scene.add(testCube);
      console.log('Red cube added at:', testCube.position);
      
      // Green sphere
      const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      testSphere.position.set(0, 0, -5);
      this.scene.add(testSphere);
      console.log('Green sphere added at:', testSphere.position);
      
      // Blue cylinder
      const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
      const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const testCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      testCylinder.position.set(2, 0, -5);
      this.scene.add(testCylinder);
      console.log('Blue cylinder added at:', testCylinder.position);
      
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