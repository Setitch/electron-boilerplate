import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      main: './src/main.ts',
    },
    decorators: {
      version: '2022-03',
    },
  },
  output: {
    distPath: {
      root: '.rsbuild/main',
    },
    filename: {
      js: 'main.cjs',
    },
    target: 'node',
  },
  tools: {
    bundlerChain: (chain, { target }) => {
      // Configure output as CommonJS
      chain.output.libraryTarget('commonjs2');
      
      // Externalize Node.js built-ins and Electron
      chain.externals({
        electron: 'commonjs electron',
        'electron-squirrel-startup': 'commonjs electron-squirrel-startup',
        'electron-window-state': 'commonjs electron-window-state',
        'electron-devtools-installer': 'commonjs electron-devtools-installer',
        sqlite3: 'commonjs sqlite3',
        'ts-node': 'commonjs ts-node',
      });

      if (target === 'node') {
        // chain.externals({
        //   sequelize: 'commonjs sequelize',
        //   'sequelize-typescript': 'commonjs sequelize-typescript',
        // });
      }

      // // Copy migration files as assets
      // chain.plugin('copy-migrations')
      //   .use(require('copy-webpack-plugin'), [{
      //     patterns: [
      //       {
      //         from: 'src/database/migrations',
      //         to: 'database/migrations',
      //         globOptions: {
      //           ignore: ['**/*.d.ts'],
      //         },
      //       },
      //     ],
      //   }]);
      
      // Add fallback for pg-hstore to prevent build errors
      chain.resolve.set('fallback', {
        'pg-hstore': false,
      });
      
      // Configure Rspack for decorator support
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
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true,
            },
          },
        });
      
      // Add environment variables for development
      chain.plugin('define').tap(([options]) => [
        {
          ...options,
          MAIN_WINDOW_VITE_DEV_SERVER_URL: JSON.stringify(
            process.env.NODE_ENV === 'development' 
              ? 'http://localhost:5173' 
              : undefined,
          ),
          MAIN_WINDOW_VITE_NAME: JSON.stringify('main_window'),
        },
      ]);
    },
  },
  performance: {
    buildCache: false,
  },
}); 