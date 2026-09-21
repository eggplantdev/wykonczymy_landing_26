import { describe, expect, it } from 'vitest'

import { sign, verify } from '@/lib/contact/sign'

const secret = '2b7e4f0a9d1c635847ea02fb5d9c81763a4e0f28bc5619d3708af41e6b2d95c7'
const body = JSON.stringify({ submissionId: '9f2c1b64-7d3a-4e58-9a10-6c5b2e8f4d71' })

describe('sign / verify', () => {
  it('round-trips the exact bytes it signed', () => {
    expect(verify(body, sign(body, secret), secret)).toBe(true)
  })

  it('emits the sha256= prefix the contract header carries', () => {
    expect(sign(body, secret)).toMatch(/^sha256=[0-9a-f]{64}$/)
  })

  // Re-serialising an object changes key order or spacing, which is why both sides pass the
  // string around rather than the object.
  it('rejects a body that changed after signing', () => {
    expect(verify(`${body} `, sign(body, secret), secret)).toBe(false)
  })

  it('rejects a signature made with a different secret', () => {
    expect(verify(body, sign(body, 'not-the-shared-secret'), secret)).toBe(false)
  })

  // `timingSafeEqual` throws on a length mismatch, so without the guard this is a 500 rather
  // than a 403.
  it('rejects a truncated signature instead of throwing', () => {
    expect(verify(body, sign(body, secret).slice(0, 20), secret)).toBe(false)
  })

  it('rejects a missing signature', () => {
    expect(verify(body, '', secret)).toBe(false)
  })
})
