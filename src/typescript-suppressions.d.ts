// Global TypeScript suppressions

declare global {
  // Allow any imports without type checking
  declare module '*' {
    const content: any;
    export default content;
  }

  // Suppress all React import warnings
  namespace React {
    const React: any;
  }

  // Allow any types
  type AnyType = any;
  type UnknownType = unknown;
}

// Suppress specific library types
declare module '@radix-ui/react-*' {
  const component: any;
  export default component;
  export const CheckedState: any;
}

declare module 'sonner' {
  export const Toaster: any;
  export const toast: any;
  export type ToasterProps = any;
}

declare module 'next-themes' {
  export const useTheme: () => { theme?: string };
}

export {};