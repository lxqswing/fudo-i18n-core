export { I18nCore } from './core'
export { I18nConfig } from './types'

import { I18nCore as I18nCoreClass } from './core'

export function createI18n() {
  return new I18nCoreClass()
}
