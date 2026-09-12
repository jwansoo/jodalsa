import path from 'node:path'
import VueRouter from 'vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.vue\.[tj]sx?\?vue/, // .vue (vue-loader with experimentalInlineMatchResource enabled)
        /\.md$/, // .md,
      ],
      imports: [
        'vue',
        'vue-router',
        {
          pinia: ['defineStore', 'storeToRefs', 'acceptHMRUpdate'],
        },
        {
          'vue-meta': ['useMeta'],
        },
      ],
      dts: true,
      viteOptimizeDeps: true,
      dirs: ['src/stores'],
    }),
    VueRouter(),
    Components({/* options */}),
    tailwindcss(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('iconify-icon'),
        },
      },
    }),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        id: '/admin/orders',
        name: '조달컨설팅 관리자',
        short_name: '조달컨설팅 관리자',
        description: '관리자용 — 입금확인, 문의관리, 단체관리',
        lang: 'ko',
        start_url: '/admin/orders',
        scope: '/',
        display: 'standalone',
        background_color: '#1e2a4a',
        theme_color: '#1e2a4a',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
