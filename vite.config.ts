/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy(), tailwindcss(), createSvgIconsPlugin({
    // 指定你 SVG 文件的目录（可以是绝对路径或相对项目根目录）
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    // 指定 symbolId 的格式：svg 文件名会自动替换 [name]
    symbolId: 'icon-[name]',
    // 可选，svg 文件内容是否全量扫（默认 false，只有修改时会重新生成）
    // svgoOptions: { plugins: [...] }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8000,
    open: true,
    cors: true,
  },

  test: {
    globals: true,
    environment: "jsdom",
  },
  base: "/",
});
