import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

import { productName, version } from './../package.json';

export default defineConfig({
  plugins: [
    pluginReact({
      swcReactOptions: {
        runtime: 'automatic',
      },
    }),
    pluginSvgr(),
  ],
  source: {
    entry: {
      index: './src/app/index.tsx',
    },
    decorators: {
      version: '2022-03',
    },
  },
  resolve: {
    alias: {
      '@ui': './src/app/components/ui',
      '@providers': './src/app/components/providers',
      '@types': './src/@types',
    },
  },
  output: {
    distPath: {
      root: '.rsbuild/renderer',
      js: 'assets/js',
      css: 'assets/css',
      media: 'assets/media',
    },
  },
  tools: {
    bundlerChain: (chain, { CHAIN_ID }) => {
      // Exclude database modules from renderer bundle
      chain.resolve.set('fallback', {
        'pg-hstore': false,
      });
      
      // Configure Rspack for decorator support with JSX
      chain.module
        .rule('typescript')
        .test(/\.(ts|tsx)$/)
        .use('builtin:swc-loader')
        .loader('builtin:swc-loader')
        .options({
          jsc: {
            parser: {
              syntax: 'typescript',
              decorators: true,
              tsx: true, // Enable TSX parsing
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true,
              react: {
                runtime: 'automatic', // Use automatic JSX runtime
                importSource: 'react', // Import React from 'react'
              },
            },
          },
        });
      
      // Add platform-specific defines
      chain.plugin(CHAIN_ID.PLUGIN.DEFINE).tap(([options]) => [
        {
          ...options,
          __DARWIN__: JSON.stringify(process.platform === 'darwin'),
          __WIN32__: JSON.stringify(process.platform === 'win32'),
          __LINUX__: JSON.stringify(process.platform === 'linux'),
          __APP_NAME__: JSON.stringify(productName),
          __APP_VERSION__: JSON.stringify(version),
          __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
        },
      ]);
    },
  },
  dev: {
    progressBar: true,
  },
  html: {
    template: './index.html',
  },
  server: {
    port: 5173,
  },
}); 