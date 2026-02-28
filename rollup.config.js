import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import { builtinModules } from "module";
import fs from "fs-extra"; // 确保已安装：npm i fs-extra --save-dev

const isProduction = process.env.NODE_ENV === "production";
const nodeExternals = ["i18next-fs-backend", "path"];

// 构建后复制 ESM 到 CJS 目录的插件
function copyCjs() {
  return {
    name: "copy-cjs",
    async writeBundle() {
      await fs.copy("dist/esm", "dist/cjs", {
        filter: (src) => !src.includes("types"), // 排除类型目录
      });
    },
  };
}

// 1. ESM/CJS 构建配置（带类型声明）
const esmCjsConfig = {
  input: "src/index.ts",
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  ],
  external: [
    "i18next",
    "i18next-icu",
    "i18next-http-backend",
    ...nodeExternals,
    ...builtinModules,
  ],
  plugins: [
    json(),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true, // 仅为 ESM/CJS 生成类型声明
      declarationDir: "dist/esm/types", // 严格嵌套在 output.dir 下
      sourceMap: true,
      outDir: "dist/esm", // 和 output.dir 完全一致
      noEmit: false,
      emitDeclarationOnly: false,
    }),
    isProduction && terser({ format: { comments: false } }),
    copyCjs(), // 复制 ESM 到 CJS 目录
  ],
};

// 2. UMD 构建配置（无类型声明，独立配置）
const umdConfig = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "I18nCore",
      sourcemap: true,
      globals: {
        i18next: "i18next",
        "i18next-icu": "i18nextICU",
        "i18next-http-backend": "i18nextHttpBackend",
      },
    },
  ],
  external: ["i18next", "i18next-icu", "i18next-http-backend"],
  plugins: [
    json(),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    // 关键：UMD 配置不启用 TypeScript 声明生成，仅编译 JS
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false, // 禁用声明文件
      declarationDir: undefined,
      outDir: undefined,
      sourceMap: true,
    }),
    isProduction && terser({ format: { comments: false } }),
  ],
};

// 3. 客户端构建配置
const clientConfig = {
  input: "src/client.ts",
  output: [
    {
      dir: "dist/client/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  ],
  external: ["i18next"],
  plugins: [
    json(),
    resolve({ browser: true }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist/client/esm/types",
      sourceMap: true,
      outDir: "dist/client/esm",
    }),
    // 复制客户端 ESM 到 CJS
    {
      name: "copy-client-cjs",
      async writeBundle() {
        await fs.copy("dist/client/esm", "dist/client/cjs", {
          filter: (src) => !src.includes("types"),
        });
      },
    },
    isProduction && terser({ format: { comments: false } }),
  ],
};

// 导出所有配置
export default [esmCjsConfig, umdConfig, clientConfig];
