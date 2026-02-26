export async function fetchJson(path: string) {
  if (typeof fetch === 'undefined') {
    // Node fetch fallback: dynamic import of node-fetch if available
    try {
      // try dynamic import to avoid require usage in ESM contexts
      // node-fetch v3 is ESM-only; this will work when available
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nf: any = await import('node-fetch')
      const nodeFetch = nf.default || nf
      const res = await nodeFetch(path)
      return await res.json()
    } catch (err) {
      throw new Error('fetch is not available in this environment')
    }
  }

  const res = await fetch(path)
  return await res.json()
}
