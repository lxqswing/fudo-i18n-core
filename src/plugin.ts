export interface Plugin {
  name: string
  setup?(core: any): void
}

export const plugins: Plugin[] = []

export function usePlugin(p: Plugin) {
  plugins.push(p)
}
