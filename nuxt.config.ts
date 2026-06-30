import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  alias: {
    "@legacy": fileURLToPath(new URL("./src", import.meta.url)),
  },
  compatibilityDate: "2025-06-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  icon: {
    provider: "iconify",
    serverBundle: false,
  },
  devServer: {
    host: "0.0.0.0",
    port: 5200,
  },
  nitro: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@legacy": fileURLToPath(new URL("./src", import.meta.url)),
    },
    externals: {
      external: ["better-sqlite3"],
    },
  },
  runtimeConfig: {
    appConfigPath: "config.toml",
    public: {
      appName: "dreamine2api",
    },
  },
  typescript: {
    strict: true,
  },
});
