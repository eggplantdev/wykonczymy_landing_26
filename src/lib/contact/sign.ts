import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * One signer for both directions — the outbound forward and the inbound delete-on-delivery
 * callback — so the two cannot drift apart, mirroring `signBody()` on the leads app's side.
 *
 * The HMAC is over the **exact bytes sent**: the caller serialises once and both signs and sends
 * that same string. A re-`JSON.stringify` on either side changes key order or spacing and the
 * signature stops matching.
 */
export function sign(rawBody: string, secret: string): string {
  return `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
}

export function verify(rawBody: string, signature: string, secret: string): boolean {
  const expected = Buffer.from(sign(rawBody, secret))
  const received = Buffer.from(signature)

  // `timingSafeEqual` throws on a length mismatch rather than returning false, so a truncated
  // signature would be a 500 instead of a 403 without this guard.
  return expected.length === received.length && timingSafeEqual(expected, received)
}
