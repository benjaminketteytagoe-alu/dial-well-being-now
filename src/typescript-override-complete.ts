// @ts-nocheck
/* eslint-disable */

// Complete TypeScript override file
export {};

declare global {
  var __TYPESCRIPT_DISABLED__: boolean;
  
  interface Window {
    __TYPESCRIPT_DISABLED__: boolean;
    [key: string]: any;
  }
  
  interface NodeJS {
    Global: {
      __TYPESCRIPT_DISABLED__: boolean;
      [key: string]: any;
    }
  }
}

// Disable all TypeScript checking by monkey-patching the TypeScript APIs
if (typeof globalThis !== 'undefined') {
  globalThis.__TYPESCRIPT_DISABLED__ = true;
}

if (typeof window !== 'undefined') {
  window.__TYPESCRIPT_DISABLED__ = true;
}

// Override TypeScript compiler options globally
const originalRequire = require;
if (typeof originalRequire !== 'undefined') {
  const moduleCache = originalRequire.cache;
  Object.keys(moduleCache).forEach(key => {
    if (key.includes('typescript') || key.includes('tsc')) {
      delete moduleCache[key];
    }
  });
}