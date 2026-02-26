import i18next from 'i18next'
export class I18nextEngine {
  async init(config: any) {
    // attach plugins and initialize
    // load optional plugins dynamically to avoid bundlers parsing ESM .d.mts files
    try {
      const pkg = 'i18next-icu'
      const icuMod: any = await import(pkg)
      const ICU = icuMod && (icuMod.default || icuMod)
      if (ICU) i18next.use(ICU)
    } catch (e) {
      // plugin not available; continue
    }

    try {
      const pkg2 = 'i18next-http-backend'
      const backendMod: any = await import(pkg2)
      const HttpBackend = backendMod && (backendMod.default || backendMod)
      if (HttpBackend) i18next.use(HttpBackend)
    } catch (e) {
      // backend plugin not available; continue
    }

    await i18next.init(config)
  }

  t(key: string, options?: any): any {
    return i18next.t(key, options)
  }

  async changeLanguage(locale: string) {
    await i18next.changeLanguage(locale)
  }

  getLanguage() {
    return i18next.language
  }
}
