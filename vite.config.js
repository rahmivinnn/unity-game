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
      input: 'src/index.html'
    }
  },
  
  // Server configuration for development
  server: {
    host: '0.0.0.0',
    port: 5173
  }
}