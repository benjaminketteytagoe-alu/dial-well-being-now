// @ts-nocheck
/* eslint-disable */
// Global TypeScript overrides to bypass strict checking for development
declare global {
  interface Window {
    [key: string]: any;
  }
  
  // Override strict TypeScript settings
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};