import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  minify: true,
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
