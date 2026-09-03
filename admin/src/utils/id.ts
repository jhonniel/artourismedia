function createUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return createUUID()
}

/** crypto.randomUUID is unavailable on non-secure origins (e.g. http://LAN_IP:5174). */
export function installCryptoRandomUUIDPolyfill(): void {
  if (typeof globalThis.crypto === 'undefined') {
    return
  }

  if (typeof globalThis.crypto.randomUUID !== 'function') {
    globalThis.crypto.randomUUID = createUUID as Crypto['randomUUID']
  }
}
