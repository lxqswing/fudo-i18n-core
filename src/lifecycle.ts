// lifecycle hooks (simple placeholders)
export type Hook = (payload?: any) => void

export const hooks = {
  beforeInit: [] as Hook[],
  afterInit: [] as Hook[]
}

export function on(hookName: keyof typeof hooks, fn: Hook) {
  hooks[hookName].push(fn)
}
