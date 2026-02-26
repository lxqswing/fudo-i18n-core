import { I18nConfig } from './types'
import { I18nextEngine } from './engine'
import { EventEmitter } from './events'

export class I18nCore {
  private engine = new I18nextEngine()
  private emitter = new EventEmitter()
  private config!: I18nConfig
  private initialized = false

  async init(config: I18nConfig) {
    if (this.initialized) return

    this.config = config

    await this.engine.init({
      lng: config.defaultLocale,
      fallbackLng: config.defaultLocale,
      supportedLngs: config.supportedLocales,
      ns: config.namespaces,
      backend: config.backend,
      interpolation: {
        escapeValue: true
      }
    })

    this.initialized = true
    this.emitter.emit('ready')
  }

  t(key: string, options?: any) {
    return this.engine.t(key, options)
  }

  async setLocale(locale: string) {
    if (!this.config.supportedLocales.includes(locale)) {
      throw new Error(`Unsupported locale: ${locale}`)
    }

    await this.engine.changeLanguage(locale)
    this.emitter.emit('localeChanged', locale)
  }

  getLocale() {
    return this.engine.getLanguage()
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback)
  }

  off(event: string, callback?: (...args: any[]) => void) {
    // expose off via emitter
    ;(this.emitter as any).off(event, callback)
  }

  async loadLocale(locale: string) {
    // For engines that support lazy loading, changing language will trigger backend load
    if (!this.config.supportedLocales.includes(locale)) {
      throw new Error(`Unsupported locale: ${locale}`)
    }
    await this.engine.changeLanguage(locale)
  }
}
