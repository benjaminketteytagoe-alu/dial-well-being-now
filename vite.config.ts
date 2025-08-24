// @ts-nocheck
/* eslint-disable */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig( ( { mode } ) => ( {
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter( Boolean ),
  resolve: {
    alias: {
      "@": path.resolve( __dirname, "./src" ),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        strict: true,
        esModuleInterop: true,
        target: "esnext",
        lib: [ "esnext", "dom" ],
      },
    },
  },
  build: {
    base: './', // ✅ ensures assets load correctly on Netlify
    rollupOptions: {
      onwarn: () => { }, // suppress warnings
      output: {
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash].[ext]",
      },
    },
  },
} ) );
