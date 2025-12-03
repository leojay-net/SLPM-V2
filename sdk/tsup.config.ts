import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'privacy/index': 'src/privacy/index.ts',
        'swaps/index': 'src/swaps/index.ts',
        'cashu/index': 'src/cashu/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    external: ['starknet'],
});
