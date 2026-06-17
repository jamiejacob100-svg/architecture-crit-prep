import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set for GitHub Pages project hosting at /<repo>/.
// Override with BASE_PATH env var if the repo is renamed.
const base = process.env.BASE_PATH || '/architecture-crit-prep/'

export default defineConfig({
  base,
  plugins: [react()],
})
