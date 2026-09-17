import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { PageWrapper } from '@/components/layout/page-wrapper'

type PropsT = {
  // The heading is the page document's own localized title, not part of the field group.
  title: string
  body?: SerializedEditorState | null
}

// The whole page is one rich-text field, so the only structure here is the measure it is
// read at — long legal prose across the full grid is unreadable.
export function LegalPage({ title, body }: PropsT) {
  return (
    <PageWrapper hasHero={false}>
      <div className="paddings py-12 md:py-20">
        <div className="mx-auto max-w-[68ch]">
          <h1 className="text-32 md:text-40 lg:text-52 mb-8 md:mb-12">{title}</h1>

          {body && (
            <div className="legal-prose">
              <RichText data={body} disableContainer />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
