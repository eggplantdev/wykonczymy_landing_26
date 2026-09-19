import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'

import { CountUp } from '@/components/home/numbers/count-up'
import { formatFigure, parseFigure } from '@/components/home/numbers/figure'

describe('parseFigure', () => {
  it.each([
    ['8+', { prefix: '', target: 8, suffix: '+', width: 1 }],
    ['250+', { prefix: '', target: 250, suffix: '+', width: 3 }],
    ['100%', { prefix: '', target: 100, suffix: '%', width: 3 }],
    ['~50', { prefix: '~', target: 50, suffix: '', width: 2 }],
    ['ponad 30', { prefix: 'ponad ', target: 30, suffix: '', width: 2 }],
  ])('splits %s into digits and decoration', (value, expected) => {
    expect(parseFigure(value)).toEqual(expected)
  })

  // A single counter cannot drive two digit runs, and counting `1 000` to 1 over a second and a
  // half reads as broken. Static text is the honest fallback — see the Polish-formatting caveat in
  // the review-gate ledger: `1 000+` is a likely edit and deserves real support, not this list.
  it.each(['1 000', '1 500', '4,5', '4.5', '2-3', '', 'wkrótce'])(
    'declines to animate %s',
    (value) => {
      expect(parseFigure(value)).toBeNull()
    },
  )

  it('rests on the width the admin typed', () => {
    const figure = parseFigure('007')!
    expect(figure.target).toBe(7)
    expect(formatFigure(figure, 7)).toBe('007')
    expect(formatFigure(figure, 0)).toBe('000')
  })
})

// The figure is split across two spans: a static one for assistive tech and the `aria-hidden` one
// the animation drives. Only the second can carry the pre-animation zero, so an assertion about
// what the server serialises has to read that one — matching the whole markup passes on the
// static span alone and proves nothing.
function animatedText(html: string) {
  const host = document.createElement('div')
  host.innerHTML = html
  return host.querySelector('[aria-hidden="true"]')?.textContent
}

describe('CountUp server rendering', () => {
  // jsdom ships no IntersectionObserver, and motion registers one the moment a `viewport` prop is
  // mounted. Nothing here asserts on scrolling, so a stub that observes nothing is enough.
  beforeAll(() => {
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    } as unknown as typeof IntersectionObserver
  })

  // The count is a client-side enhancement, so whatever the server serialises is what a crawler, a
  // visitor whose JS never arrives, and the pre-hydration paint all read. Seeding the counter at
  // zero put `000+` in that HTML — a false claim on the section carrying the site's credibility
  // figures.
  it('serialises the real figure, never the pre-animation zero', () => {
    const html = renderToStaticMarkup(createElement(CountUp, { value: '250+' }))

    expect(animatedText(html)).toBe('250+')
    expect(html).toContain('<span class="sr-only">250+</span>')
  })

  it('renders a figure it will not animate as plain text', () => {
    const html = renderToStaticMarkup(createElement(CountUp, { value: '1 000' }))

    expect(html).toBe('<span>1 000</span>')
  })
})
