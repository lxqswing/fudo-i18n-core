import { createI18n } from './index'

const GLOBAL_KEY = '__FUDO_I18N__'

export function getClientI18n(): any {
  if (typeof window === 'undefined') {
    throw new Error('getClientI18n must be called in browser')
  }

  const w = window as any
  if (!w[GLOBAL_KEY]) {
    w[GLOBAL_KEY] = createI18n()
  }
  return w[GLOBAL_KEY]
}
