export function resolveNamespace(key: string, defaultNS: string): string {
  return key.includes(":") ? key.split(":")[0] : defaultNS;
}
