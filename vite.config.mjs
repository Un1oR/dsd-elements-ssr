import { defineConfig } from 'vite'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import dsdElementsSSR from './plugins/dsd-elements-ssr.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = resolve(__dirname, 'public')
const htmlEntries = fg.sync('**/*.html', { cwd: rootDir, absolute: true })
const input = Object.fromEntries(
  htmlEntries.map((file) => [relative(rootDir, file).replace(/\.html$/, ''), file])
)

export default defineConfig({
  root: rootDir,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input,
    },
  },
  plugins: [dsdElementsSSR()],
})
