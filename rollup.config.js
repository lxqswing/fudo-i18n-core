import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
// 新增：导入 JSON 解析插件（解决 tr46 的 JSON 依赖问题）
import json from "@rollup/plugin-json";

const isProduction = process.env.NODE_ENV === "production";

export default [
  // 1. 核心模块（index.ts）
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        sourcemap: true,
        name: "I18nCore",
        // 新增：配置 UMD 全局变量映射
        globals: {
          i18next: "i18next",
          "i18next-icu": "i18nextICU",
          "i18next-http-backend": "i18nextHttpBackend",
        },
      },
    ],
    external: ["i18next", "i18next-icu", "i18next-http-backend"],
    plugins: [
      // 新增：解析 JSON 文件（解决 tr46 的 JSON 依赖问题）
      json(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
      }),
      isProduction &&
        terser({
          format: { comments: false },
        }),
    ],
  },
  // 2. Client 模块（client.ts）
  {
    input: "src/client.ts",
    output: [
      {
        file: "dist/client.cjs",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      { file: "dist/client.js", format: "esm", sourcemap: true },
    ],
    external: ["i18next", "@company/i18n-core"], // 修正：依赖核心包而非相对路径
    plugins: [
      json(), // 新增：JSON 解析插件
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
      }),
      isProduction &&
        terser({
          format: { comments: false },
        }),
    ],
  },
];
