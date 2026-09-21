import { describe, expect, it } from 'vitest'

import { isDirectChild, isSubmissionId, leadPrefix, submissionIdFromPath } from '@/lib/blob/prefix'

const ID = '9f2c1b64-7d3a-4e58-9a10-6c5b2e8f4d71'

describe('isSubmissionId', () => {
  it('accepts a uuid and refuses anything that could widen a prefix', () => {
    expect(isSubmissionId(ID)).toBe(true)
    expect(isSubmissionId('../..')).toBe(false)
    expect(isSubmissionId('')).toBe(false)
    expect(isSubmissionId(undefined)).toBe(false)
  })
})

describe('isDirectChild', () => {
  // The two callers spell a path differently — the token route gets a bare blob pathname, the
  // action gets one off `new URL().pathname` — and one shared rule is only shared if it takes both.
  it('accepts the same file bare or rooted', () => {
    expect(isDirectChild(`leads/${ID}/room.jpg`, ID)).toBe(true)
    expect(isDirectChild(`/leads/${ID}/room.jpg`, ID)).toBe(true)
  })

  it('refuses the store root, where the CMS media lives', () => {
    expect(isDirectChild('hero.jpg', ID)).toBe(false)
    expect(isDirectChild('/hero.jpg', ID)).toBe(false)
  })

  it("refuses another submission's prefix", () => {
    expect(isDirectChild('leads/00000000-0000-4000-8000-000000000000/room.jpg', ID)).toBe(false)
  })

  // A nested path is one neither the cleanup nor the sweep would ever reclaim.
  it('refuses a nested path and the bare prefix itself', () => {
    expect(isDirectChild(`leads/${ID}/nested/room.jpg`, ID)).toBe(false)
    expect(isDirectChild(`leads/${ID}/`, ID)).toBe(false)
  })

  // `leads/<id>-evil/x.jpg` starts with the id but is a different submission.
  it('refuses a prefix that merely starts with the id', () => {
    expect(isDirectChild(`leads/${ID}-evil/room.jpg`, ID)).toBe(false)
  })
})

describe('submissionIdFromPath', () => {
  it('round-trips leadPrefix and ignores anything outside it', () => {
    expect(submissionIdFromPath(`${leadPrefix(ID)}room.jpg`)).toBe(ID)
    expect(submissionIdFromPath('hero.jpg')).toBeUndefined()
  })
})
