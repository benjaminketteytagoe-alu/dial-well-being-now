// @ts-nocheck
/* eslint-disable */
// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Disable type checking in esbuild for faster builds
    tsconfigRaw: {
      compilerOptions: {
        noUnusedLocals: false,
        noUnusedParameters: false,
      }
    }
  }
}));
