import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e", timeout: 30000,
  use: { baseURL: "http://localhost:3200" },
  webServer: { command: "npm run build && npx next start -p 3200", url: "http://localhost:3200", timeout: 240000, reuseExistingServer: true },
});
