export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

export function isCorruptedPayload(value: unknown): boolean {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const encoded = JSON.stringify(value)

  return (
    encoded.includes('__PHP_Incomplete_Class') ||
    encoded.includes('AnonymousResourceCollection')
  )
}
