import { createI18n } from "./index";

const GLOBAL_KEY = "__COMPANY_I18N__";

export function getClientI18n() {
  if (typeof window === "undefined") {
    throw new Error("Client i18n cannot be used on server");
  }

  if (!(window as any)[GLOBAL_KEY]) {
    (window as any)[GLOBAL_KEY] = createI18n();
  }

  return (window as any)[GLOBAL_KEY];
}
