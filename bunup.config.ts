import { defineConfig } from "bunup";
import { exports } from "bunup/plugins";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  minify: true,
  dts: true,
  target: "bun",
  sourcemap: "linked",
  plugins: [exports()],
});
