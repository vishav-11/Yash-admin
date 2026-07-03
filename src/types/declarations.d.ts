/**
 * CSS Module Declarations
 *
 * Why: TypeScript by default doesn't understand CSS file imports.
 * Without this, `import "./globals.css"` throws error TS2882.
 * This tells TypeScript to treat all .css imports as valid modules.
 */

// CSS files
declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}

// CSS Modules
declare module "*.module.css" {
  const styles: { [className: string]: string };
  export default styles;
}

// SCSS files (future use)
declare module "*.scss" {
  const styles: { [className: string]: string };
  export default styles;
}

declare module "*.module.scss" {
  const styles: { [className: string]: string };
  export default styles;
}

// Image files
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import type React from "react";
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

// Font files
declare module "*.woff" {
  const src: string;
  export default src;
}

declare module "*.woff2" {
  const src: string;
  export default src;
}