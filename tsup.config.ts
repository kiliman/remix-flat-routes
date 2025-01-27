import { defineConfig } from 'tsup'

export default defineConfig(() => {
  const commonOptions = {
    splitting: false,
    sourcemap: false,
    clean: true,
  }

  const indexCommonOptions = {
    entry: ['src/index.ts'],
  }

  return [{
    ...commonOptions,
    ...indexCommonOptions,
    format: 'esm',
    dts: true, // Generate declaration file (.d.ts)
  }, {
    ...commonOptions,
    ...indexCommonOptions,
    format: 'cjs', // TODO: consider removing cjs support. Vite expects ESM anyway and v1 remix compiler can use serverDependenciesToBundle option
  }, {
    ...commonOptions,
    entry: ['src/cli.ts'],
    format: 'cjs',
  }]
})
