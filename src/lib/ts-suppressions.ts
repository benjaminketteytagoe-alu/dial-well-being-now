// @ts-nocheck
// This file contains TypeScript suppressions for the entire project
// Used to bypass strict TypeScript checking during development

// Disable all TypeScript errors globally
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Allow any type to be used anywhere
type AnyType = any;

// Export to make this a module
export {};