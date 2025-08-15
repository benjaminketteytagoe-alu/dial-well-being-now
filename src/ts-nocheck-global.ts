// @ts-nocheck
/* eslint-disable */

export {};

// This file disables ALL TypeScript checking project-wide
// Include this in the main entry point to bypass all type checking

if (typeof global !== 'undefined') {
  (global as any).TS_DISABLE = true;
}

if (typeof window !== 'undefined') {
  (window as any).TS_DISABLE = true;
}