import { defineConfig } from "tsup";

export default defineConfig({
  entry: { "adstream-player": "src/index.ts" },
  format: ["iife"],
  globalName: "AdStreamPlayer",
  footer: {
    js: "window.AdStreamPlayer = window.AdStreamPlayer?.AdStreamPlayer ?? window.AdStreamPlayer;"
  },
  clean: true,
  minifyWhitespace: true,
  outDir: "dist",
  outExtension() {
    return {
      js: ".js"
    };
  }
});
