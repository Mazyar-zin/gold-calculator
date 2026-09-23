import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.png',
        'apple-touch-icon.png',
        'icon-192.png',
        'icon-512.png',
        'maskable-512.png',
      ],
      manifest: {
        id: '/',
        name: 'محاسبه‌گر طلا',
        short_name: 'طلا',
        description: 'محاسبه‌گر شخصی قیمت طلا و ماشین حساب',
        start_url: '/',
        scope: '/',
        theme_color: '#f5f1e9',
        background_color: '#f5f1e9',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'fa',
        dir: 'rtl',
        categories: ['finance', 'utilities'],
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
})
