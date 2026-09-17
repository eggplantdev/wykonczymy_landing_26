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
    <PageWrapper hasHero={false} title={title}>
      <div className="paddings pb-12 md:pb-20">
        <div className="mx-auto max-w-[68ch]">
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
