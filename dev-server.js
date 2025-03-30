
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Calculate __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the backend server
const serverProcess = spawn('node', [path.join(__dirname, 'src/server/start-server.js')], {
  stdio: 'inherit',
  shell: true
});

// Start the frontend Vite dev server
const viteProcess = spawn('vite', [], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  serverProcess.kill();
  viteProcess.kill();
  process.exit();
});

console.log('🚀 Development servers started. Backend on port 5000, Frontend on port 8080');
