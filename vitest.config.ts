import { defineConfig } from "vitest/config";
export default defineConfig({ test: { exclude: ["e2e/**", "node_modules/**"], environment: "node", testTimeout: 60000, hookTimeout: 60000 }, resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } } });
