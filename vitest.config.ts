import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const mfeMockPath = path.resolve(__dirname, "./src/test/mocks/mfe.tsx");

const mfeAliases: Array<{ find: string; replacement: string }> = [
  "intelligence/App",
  "ai/AIRouteLayout",
  "ai/BookPage",
  "ai/AudioSection",
  "ai/ImagesSection",
  "ai/VideoSection",
  "ai/StudioDashboard",
  "ai/NewProjectPage",
  "ai/ProjectDetailPage",
  "ai/SocialAccountsPage",
  "ai/ProductDataDiscoveryPage",
  "ai/RetailSection",
  "crm/App",
  "erp/App",
  "erp/DashboardPage",
  "erp/CatalogPage",
  "erp/InventoryPage",
  "erp/OrdersListPage",
  "erp/AIContentPage",
  "finance/App",
  "pdv/App",
  "rpg/App",
  "sso/App",
  "omnichannel/App",
  "omnichannel/InboxView",
  "admin/App",
  "wellness/Pages",
  "consumer/App",
].map((find) => ({ find, replacement: mfeMockPath }));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.tsx"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/tests/**", "**/e2e/**"],
    globals: true,
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/**/*.d.ts",
        "src/test/**",
      ],
      thresholds: {
        branches: 67,
        functions: 61,
        lines: 82,
        statements: 82,
      },
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      ...mfeAliases,
    ],
  },
});
