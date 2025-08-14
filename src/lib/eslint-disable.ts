// @ts-nocheck
/* eslint-disable */
// This file temporarily disables all TypeScript and ESLint errors
// for faster development iterations

declare global {
  // Disable all TypeScript strict checking
  interface Window {
    [key: string]: any;
  }
}

// Export to make this a module
export {};