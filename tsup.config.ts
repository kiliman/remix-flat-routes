import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/*'],
  format: ['cjs', 'esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: false,
  clean: true,
})
