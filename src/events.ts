import { Listener } from './types'

export class EventEmitter {
  private events: Record<string, Listener[]> = {}

  on(event: string, callback: Listener) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  }

  off(event: string, callback?: Listener) {
    if (!this.events[event]) return
    if (!callback) {
      delete this.events[event]
      return
    }
    this.events[event] = this.events[event].filter(fn => fn !== callback)
  }

  emit(event: string, ...args: any[]) {
    this.events[event]?.forEach(fn => fn(...args))
  }
}
