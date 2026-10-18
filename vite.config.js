import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import {
  getStoreHtmlTokens,
  storeConfig,
} from "./Server/shared/store.config.js";

/**
 * Fills the `%STORE_*%` placeholders in index.html from the shared store config
 * so the static <head> (title, description, Open Graph, favicons, ...) stays in
 * sync with `Server/shared/store.config.js` at both dev and build time.
 */
function storeHtmlConfigPlugin() {
  return {
    name: "store-html-config",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const tokens = getStoreHtmlTokens(storeConfig.site.defaultLanguage);
        return Object.entries(tokens).reduce(
          (out, [token, value]) => out.split(token).join(value ?? ""),
          html,
        );
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss(), storeHtmlConfigPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "./Server/shared"), // this can be accessed from anywhere in the project, helpful for sharing utils function between server and client
      },
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
    },
    base: "./",
  };
});
