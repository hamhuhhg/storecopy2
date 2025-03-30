
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fetch the API status to ensure database is running
fetch('/api/test')
  .then(response => response.json())
  .then(data => {
    console.log('Database connection status:', data.message);
  })
  .catch(error => {
    console.warn('Database server may not be running:', error);
  })
  .finally(() => {
    // Render the app regardless of database status
    createRoot(document.getElementById("root")!).render(<App />);
  });
