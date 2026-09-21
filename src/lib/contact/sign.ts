import { createHmac, timingSafeEqual } from 'node:crypto'

export type SignatureScopeT = 'landing-submission' | 'landing-cleanup'

const keyFor = (secret: string, scope: SignatureScopeT) =>
  createHmac('sha256', secret).update(scope, 'utf8').digest()

/**
 * One signer for both directions — the outbound forward and the inbound delete-on-delivery
 * callback — so the two cannot drift apart, mirroring `signBody()` on the leads app's side.
 *
 * The key is derived from the shared secret AND the scope, so a signature minted for one purpose
 * can never verify as the other. Without that, any copy of a signed submission — our own retry
 * queue, a log — was also a valid, never-expiring „delete this submission's files" instruction,
 * because a cleanup body is nothing but a `submissionId` and every envelope carries one.
 *
 * The HMAC is over the **exact bytes sent**: the caller serialises once and both signs and sends
 * that same string. A re-`JSON.stringify` on either side changes key order or spacing and the
 * signature stops matching.
 */
export function sign(rawBody: string, secret: string, scope: SignatureScopeT): string {
  return `sha256=${createHmac('sha256', keyFor(secret, scope)).update(rawBody).digest('hex')}`
}

export function verify(
  rawBody: string,
  signature: string,
  secret: string,
  scope: SignatureScopeT,
): boolean {
  const expected = Buffer.from(sign(rawBody, secret, scope))
  const received = Buffer.from(signature)

  // `timingSafeEqual` throws on a length mismatch rather than returning false, so a truncated
  // signature would be a 500 instead of a 403 without this guard.
  return expected.length === received.length && timingSafeEqual(expected, received)
}
