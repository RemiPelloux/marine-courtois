/**
 * Anti-spam: the address is never shipped in plain text (HTML or JS bundle).
 * It is stored as XOR-ed, reversed character codes and decoded only in the
 * browser, after a visitor asks for it.
 */
const KEY = 29;

export function decodeEmail(codes: readonly number[]): string {
  return codes
    .slice()
    .reverse()
    .map((c) => String.fromCharCode(c ^ KEY))
    .join("");
}

/** Used once to produce the stored codes (kept for maintenance). */
export function encodeEmail(address: string): number[] {
  return [...address].map((c) => c.charCodeAt(0) ^ KEY).reverse();
}
