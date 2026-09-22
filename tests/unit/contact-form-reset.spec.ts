import { FormApi } from '@tanstack/react-form'
import { describe, expect, it } from 'vitest'

import { emptyContactValues } from '@/lib/contact/contact-schema'

const DEFAULT_VALUES = emptyContactValues()

const draft = { ...DEFAULT_VALUES, name: 'Jan Kowalski', email: 'jan@example.com' }

function mountedForm() {
  const form = new FormApi({ defaultValues: DEFAULT_VALUES })
  form.mount()
  return form
}

// Mirrors the restore effect in `contact-form.tsx`.
function restoreDraft(form: ReturnType<typeof mountedForm>, values: object = draft) {
  form.reset({ ...DEFAULT_VALUES, ...values, acceptsTerms: false }, { keepDefaultValues: true })
}

describe('restoring a draft into the form', () => {
  it('puts the saved draft into the fields', () => {
    const form = mountedForm()

    restoreDraft(form)

    expect(form.state.values.name).toBe('Jan Kowalski')
    expect(form.state.values.email).toBe('jan@example.com')
  })

  // `FormApi.reset(values)` reassigns `options.defaultValues` unless told not to, so
  // restoring a draft would otherwise make that draft the form's permanent reset
  // target. A bare `reset()` is the cheapest way to read those defaults back out:
  // drop `keepDefaultValues` and it hands the draft back instead of empty fields.
  it('does not let the restored draft become the form defaults', () => {
    const form = mountedForm()

    restoreDraft(form)
    form.reset()

    expect(form.state.values).toEqual(DEFAULT_VALUES)
  })

  // sessionStorage outlives a deploy, so a draft saved by the previous bundle is missing
  // every field added since. Restored as-is it leaves that input uncontrolled and fails the
  // schema the upload token is minted against.
  it('fills a field the saved draft predates', () => {
    const form = mountedForm()
    const { timing: _timing, ...staleDraft } = draft

    restoreDraft(form, staleDraft)

    expect(form.state.values.timing).toBe('')
  })

  it('clears every field after a send, including the consent box', () => {
    const form = mountedForm()

    restoreDraft(form)
    form.setFieldValue('acceptsTerms', true)
    form.reset(DEFAULT_VALUES)

    expect(form.state.values).toEqual(DEFAULT_VALUES)
  })
})
