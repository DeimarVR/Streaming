import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Aula Viva',
        short_name: 'Aula Viva',
        description: 'Clases en vivo, grabadas y organizadas por rol.',
        theme_color: '#5B8CFF',
        background_color: '#0A0E16',
        display: 'standalone',
        start_url: '/',
        icons: [],
      },
    }),
  ],
  server: { port: 5173 },
});
