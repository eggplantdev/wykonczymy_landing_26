import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PageWrapper } from '@/components/layout/page-wrapper'
import { ObjectSlideContent } from '@/components/object-carousel/object-slide-content'
import { EntryTitle } from '@/components/ui/entry-title'
import { SectionTitle } from '@/components/ui/section-title'

function headingTags(html: string) {
  return [...html.matchAll(/<(h[1-6])[\s>]/g)].map(([, tag]) => tag)
}

const SLIDE_ITEM = {
  key: 'dom-w-wilanowie',
  href: '/realizacje/dom-w-wilanowie/',
  title: 'Dom w Wilanowie',
  text: 'Pełne wykończenie pod klucz.',
  image: null,
}

describe('the page outline', () => {
  // The home page passes no `title`, so its hero owns the only `h1`. A second one here would
  // give every non-home page two.
  it('gives PageWrapper no heading of its own when no title is passed', () => {
    const html = renderToStaticMarkup(<PageWrapper>body</PageWrapper>)

    expect(headingTags(html)).toEqual([])
  })

  it('opens a titled page with an h1', () => {
    const html = renderToStaticMarkup(<PageWrapper title="Realizacje">body</PageWrapper>)

    expect(headingTags(html)).toEqual(['h1'])
  })

  // The carousel above these slides carries the section's one real heading, so a slide adds a
  // single h3 under it. Both were `h2` before, once per slide and again per breakpoint — six
  // copies of the section title standing in the outline of a three-slide carousel.
  it('adds exactly one heading per carousel slide, below the section level', () => {
    const html = renderToStaticMarkup(
      <ObjectSlideContent item={SLIDE_ITEM} sectionTitle="Inne realizacje" />,
    )

    expect(headingTags(html)).toEqual(['h3'])
  })

  // One of the two breakpoint variants is always in the DOM, so without this the section title
  // is read out again as the first thing inside every slide link.
  it('hides the slide’s repeated section label from assistive tech', () => {
    const html = renderToStaticMarkup(
      <ObjectSlideContent item={SLIDE_ITEM} sectionTitle="Inne realizacje" />,
    )

    const labels = [...html.matchAll(/<p\b[^>]*>Inne realizacje<\/p>/g)].map(([tag]) => tag)

    expect(labels).toHaveLength(2)
    expect(labels.every((tag) => tag.includes('aria-hidden="true"'))).toBe(true)
  })
})

describe('the heading components', () => {
  it('sets an entry title as a section of its page by default', () => {
    const html = renderToStaticMarkup(<EntryTitle title="Dom w Wilanowie" />)

    expect(headingTags(html)).toEqual(['h2'])
  })

  it('drops an entry title a level when it sits under a carousel heading', () => {
    const html = renderToStaticMarkup(<EntryTitle title="Dom w Wilanowie" level="h3" />)

    expect(headingTags(html)).toEqual(['h3'])
  })

  // Several section titles come from optional CMS fields. An unset one used to render an empty
  // h2, which stands in the outline as a section with no name.
  it('renders no section heading at all when the CMS field is empty', () => {
    const html = renderToStaticMarkup(<SectionTitle title={undefined} />)

    expect(html).toBe('')
  })
})
