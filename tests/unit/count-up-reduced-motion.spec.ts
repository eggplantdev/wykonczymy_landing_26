import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CountUp } from '@/components/home/numbers/count-up'

// Module scope, not `beforeAll`: motion caches the preference in a module-level singleton the first
// time `useReducedMotion` runs, so a stub installed after any render never takes. That cache is
// also why this lives in its own file — vitest gives each file a fresh module registry, and the
// sibling spec has already locked the singleton to "no preference" by its first render.
window.matchMedia = ((query: string) => ({
  matches: true,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia

// jsdom ships no IntersectionObserver, and motion registers one the moment a `viewport` prop is
// mounted. Nothing here asserts on scrolling, so a stub that observes nothing is enough.
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
} as unknown as typeof IntersectionObserver

describe('CountUp under reduced motion', () => {
  // React discards the server's HTML and client-renders the page when the two disagree, and
  // `useReducedMotion` answers `null` on the server but `true` for this visitor — so a tree that
  // branches on it cannot match. jsdom cannot reproduce the server's `null`, but it can prove the
  // branch does not exist: the animated span must still render, with the reduction expressed by
  // declining to animate rather than by rendering something else.
  it('renders the same tree it renders for everyone else', () => {
    const { container } = render(createElement(CountUp, { value: '8+' }))

    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('8+')
    expect(container.innerHTML).toBe(renderToStaticMarkup(createElement(CountUp, { value: '8+' })))
  })
})
