export interface I18nConfig {
  defaultLocale: string
  supportedLocales: string[]
  namespaces?: string[]
  backend?: {
    loadPath: string
  }
}

export interface I18nEngine {
  init(config: any): Promise<void>
  t(key: string, options?: any): any
  changeLanguage(locale: string): Promise<void>
  getLanguage(): string
}

export type Listener = (...args: any[]) => void
