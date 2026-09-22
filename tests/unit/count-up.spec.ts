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
    ['1 000+', { prefix: '', target: 1000, suffix: '+', width: 4, separator: ' ' }],
    ['1\u00A0500', { prefix: '', target: 1500, suffix: '', width: 4, separator: '\u00A0' }],
  ])('splits %s into digits and decoration', (value, expected) => {
    expect(parseFigure(value)).toEqual(expected)
  })

  // A single counter cannot drive two digit runs, so anything holding a second one is static text.
  // Decimals are on that list by decision, not by limitation: this section carries whole counts.
  it.each(['4,5', '4.5', '2-3', '1 0000', '', 'wkrótce'])('declines to animate %s', (value) => {
    expect(parseFigure(value)).toBeNull()
  })

  // The separator is re-derived every frame rather than carried from the target, so the figure is
  // grouped the whole way up instead of acquiring a space on its last frame.
  it('groups the digits while they climb', () => {
    const figure = parseFigure('1 000+')!

    expect(formatFigure(figure, 50)).toBe('0 050+')
    expect(formatFigure(figure, 999)).toBe('0 999+')
    expect(formatFigure(figure, 1000)).toBe('1 000+')
  })

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
    const html = renderToStaticMarkup(createElement(CountUp, { value: '2-3' }))

    expect(html).toBe('<span>2-3</span>')
  })
})
