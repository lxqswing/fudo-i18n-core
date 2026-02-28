// index.ts

import { I18nCore } from "./core";

export * from "./core";
export * from "./client";

export function createI18n() {
  return new I18nCore();
}
