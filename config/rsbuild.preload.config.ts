import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      preload: './src/preload.ts',
    },
    decorators: {
      version: '2022-03',
    },
  },
  output: {
    distPath: {
      root: '.rsbuild/preload',
    },
    filename: {
      js: 'preload.cjs',
    },
    target: 'node',
  },
  tools: {
    bundlerChain: (chain) => {
      // Configure output as CommonJS
      chain.output.libraryTarget('commonjs2');
      
      // Externalize Node.js built-ins and Electron
      chain.externals({
        electron: 'commonjs electron',
        sequelize: 'commonjs2 sequelize',
        'sequelize-typescript': 'commonjs2 sequelize-typescript',
        'ts-node': 'commonjs ts-node',
      });

      // Add fallback for pg-hstore to prevent build errors
      chain.resolve.set('fallback', {
        'pg-hstore': false,
      });
    },
  },
  performance: {
    buildCache: false,

  },
}); 