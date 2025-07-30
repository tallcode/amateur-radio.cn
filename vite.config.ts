// Plugins
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
// Utilities
import { defineConfig } from 'vite'

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }) as any,
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (chunkInfo) => {
          const extname = chunkInfo.names[0]?.split('.').pop() || ''
          if (['ttf', 'woff', 'woff2', 'eot'].includes(extname)) {
            return 'fonts/[name][extname]'
          }
          else if (['svg', 'ico'].includes(extname)) {
            return 'assets/[name][extname]'
          }
          else {
            return 'assets/[name]-[hash][extname]'
          }
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (['vuetify'].some(lib => id.includes(lib))) {
              return 'ui'
            }
            if (['vue', 'vue-router', 'pinia', 'vueuse'].some(lib => id.includes(lib))) {
              return 'vue'
            }
            if (['lodash', 'uuid', 'dayjs'].some(lib => id.includes(lib))) {
              return 'util'
            }
            if (['markdown'].some(lib => id.includes(lib))) {
              return 'markdown'
            }
            if (['katex'].some(lib => id.includes(lib))) {
              return 'katex'
            }
            return 'vendor'
          }
          else {
            return 'app'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})
