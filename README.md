# @fudo/i18n-core

Framework-agnostic i18n core wrapper. Provides a small, stable API used by React/Vue/Umi projects while keeping the underlying engine swappable (defaults to i18next).

Features
- SSR / CSR safe
- Route-level locales
- ICU formatting support
- Lazy namespace loading (via i18next-http-backend)
- Event hooks and simple plugin/resolver points

API
- createI18n(): I18nCore
- getClientI18n(): singleton in browser

I18nCore methods
- init(config: I18nConfig): Promise<void>
- t(key: string, options?: any): string
- setLocale(locale: string): Promise<void>
- getLocale(): string
- loadLocale(locale: string): Promise<void>
- on(event: string, cb: Function)

Build

npm install
npm run build
