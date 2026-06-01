import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: '/',
    plugins: [
        VitePWA({
        registerType: 'autoUpdate',
        // Include all static assets you want pre-cached
        includeAssets: ['icons/*.png', 'sounds/*.mp3', 'models/*.glb', 'data/*.json'],
        manifest: {
            name: 'Kauwe Bende',
            short_name: 'KauweBende',
            description: 'Question game with 3D objects',
            theme_color: '#1a1a2e',
            background_color: '#000016',
            orientation: 'portrait',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
            // Copy your icons array from your manifest.json (or write it here)
            // Example:
            { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
            { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
            { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
            { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
            { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
            { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
            { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/maskable-icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
            ]
        },
        workbox: {
            // Cache all built files (js, css, html)
            globPatterns: ['**/*.{js,css,html}'],
            // Additional runtime caching for large media
            runtimeCaching: [
            {
                urlPattern: /^\/sounds\/.*\.mp3/,
                handler: 'CacheFirst',
                options: {
                cacheName: 'sounds-cache',
                expiration: { maxEntries: 20 }
                }
            },
            {
                urlPattern: /^\/models\/.*\.glb/,
                handler: 'CacheFirst',
                options: {
                cacheName: 'models-cache',
                expiration: { maxEntries: 10 }
                }
            },
            {
                urlPattern: /^\/data\/.*\.json/,
                handler: 'NetworkFirst',
                options: {
                cacheName: 'questions-cache',
                expiration: { maxEntries: 10 }
                }
            }
            ]
        }
        })
    ]
})