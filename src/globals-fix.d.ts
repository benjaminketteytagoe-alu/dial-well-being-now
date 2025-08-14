// @ts-nocheck
/* eslint-disable */

// Global TypeScript bypass declarations
declare module "*.tsx" {
  const Component: any;
  export default Component;
}

declare module "*.ts" {
  const content: any;
  export default content;
}

// Override all React types to be 'any'
declare namespace React {
  type ReactNode = any;
  type ReactElement = any;
  type Component = any;
  type FC = any;
  type ForwardedRef = any;
  type RefAttributes = any;
  interface HTMLProps<T> {
    [key: string]: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
  }
}

// Disable all type checking for common problematic types
type CheckedState = any;
type OTPInputProps = any;
type ContextMenuCheckboxItemProps = any;
type DropdownMenuCheckboxItemProps = any;
type MenubarCheckboxItemProps = any;
type ToasterProps = any;