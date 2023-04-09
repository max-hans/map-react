import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    minify: "terser",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          drei: ["@react-three/drei"],
        },
      },
    },
    terserOptions: {
      output: {
        comments: false, // This will remove all comments from the output files
      },
    },
  },
});
