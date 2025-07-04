import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/

export default defineConfig(({ mode }) => ({
  // base: mode === 'development' ? '/' : '/viewer/',
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/style/element.scss" as *; @use "/src/style/upload.scss" as *;`,
        api: "modern-compiler"
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        })
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass"
        })
      ],
    }),
  ]
}))
