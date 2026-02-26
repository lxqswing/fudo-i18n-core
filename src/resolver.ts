// resolver can be used to resolve translation keys or resource locations
export function resolveKey(moduleName: string, key: string) {
  return `${moduleName}.${key}`
}
