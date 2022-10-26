import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        viteStaticCopy({
            targets: [
                {
                    src: './node_modules/@idux/components/icon/assets/*.svg',
                    dest: 'idux-icons'
                }
            ]
        })
    ]
})
