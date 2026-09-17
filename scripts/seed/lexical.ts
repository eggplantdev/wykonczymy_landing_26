import type {
  SerializedEditorState,
  SerializedParagraphNode,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical/lexical'

/**
 * Payload stores a `richText` field as Lexical's own JSON tree, so the seed cannot hand it a
 * plain string. The reviews are prose with paragraph breaks and no marks, which is the one
 * shape worth building by hand — anything richer is typed into the admin.
 */
export function toLexical(paragraphs: string[]): SerializedEditorState {
  const text = (value: string): SerializedTextNode => ({
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: value,
    version: 1,
  })

  const paragraph = (value: string): SerializedParagraphNode => ({
    type: 'paragraph',
    children: [text(value)],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    version: 1,
  })

  return {
    root: {
      type: 'root',
      children: paragraphs.map(paragraph),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
