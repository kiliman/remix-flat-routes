import { defineConfig } from 'tsup'

export default defineConfig(() => {
  const commonOptions = {
    splitting: false,
    sourcemap: false,
    clean: true,
  }

  return [{
    ...commonOptions,
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'], // TODO: consider removing cjs support. Vite expects ESM anyway and v1 remix compiler can use serverDependenciesToBundle option
    dts: true, // Generate declaration file (.d.ts)
  }, {
    ...commonOptions,
    entry: ['src/cli.ts'],
    format: 'cjs',
  }]
})
