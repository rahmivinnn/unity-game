export default {
  // Set the base directory for deployment
  base: '/',

  // Set the project root directory (relative to the config file)
  root: './src',

  // Set the directory to serve static files from (relative to the root)
  publicDir: './public',
  
  // Set the build output directory
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './src/index.html',
        'main-menu': './src/main-menu.html',
        'opening-animation': './src/opening-animation.html',
        'quiz': './src/quiz.html',
        'scene2-level1': './src/scene2-level1.html',
        'scene3-level2': './src/scene3-level2.html',
        'scene4-level3': './src/scene4-level3.html',
        'scene5-level4': './src/scene5-level4.html',
        'simcity': './src/simcity.html',
        'final-gate': './src/final-gate.html',
        'test-threejs': './src/test-threejs.html'
      }
    }
  },
  
  // Server configuration for development
  server: {
    host: '0.0.0.0',
    port: 5173
  }
}