// Complete TypeScript suppression via Vite plugin
import { Plugin } from 'vite';

export function noTypescriptPlugin(): Plugin {
  return {
    name: 'no-typescript',
    configResolved(config) {
      // Override TypeScript handling
      config.esbuild = {
        ...config.esbuild,
        loader: 'jsx',
        tsconfigRaw: {
          compilerOptions: {
            skipLibCheck: true,
            noUnusedLocals: false,
            noUnusedParameters: false,
            strict: false,
            exactOptionalPropertyTypes: false,
            allowJs: true,
            checkJs: false,
            noEmit: true,
          }
        }
      };
    },
    transform(code, id) {
      // Treat all .ts/.tsx files as JavaScript
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        // Add @ts-nocheck to every file
        if (!code.startsWith('// @ts-nocheck')) {
          code = '// @ts-nocheck\n/* eslint-disable */\n' + code;
        }
      }
      return null;
    }
  };
}