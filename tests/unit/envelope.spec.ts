import { describe, expect, it } from 'vitest'

import { buildEnvelope } from '@/lib/contact/envelope'
import { emptyContactValues } from '@/lib/contact/contact-schema'
import { getTranslations, i18n } from '@/lib/i18n/i18n'
import { LANDING_SUBMISSION } from '../fixtures/landing-submission'

const { submissionId, submittedAt, assets, ...pinned } = LANDING_SUBMISSION

const values = {
  ...emptyContactValues(),
  name: LANDING_SUBMISSION.name,
  email: LANDING_SUBMISSION.email,
  phone: LANDING_SUBMISSION.phone,
  address: LANDING_SUBMISSION.address,
  scope: LANDING_SUBMISSION.scope,
  area: LANDING_SUBMISSION.area,
  timing: LANDING_SUBMISSION.timing,
  message: LANDING_SUBMISSION.message,
  acceptsTerms: true,
}

const build = () => buildEnvelope({ values, submissionId, assets, submittedAt })

describe('buildEnvelope', () => {
  // The one test that catches wire drift: the fixture is committed on both sides of the
  // contract, so a field this builder stops sending fails here before it reaches the leads app.
  it('reproduces every field the shared fixture pins', () => {
    expect(build()).toMatchObject({ submissionId, submittedAt, assets, ...pinned })
  })

  it('carries no field the fixture does not pin, beyond the self-describing tail', () => {
    const { rawData: _rawData, formQuestions: _formQuestions, ...envelope } = build()

    expect(envelope).toEqual({ submissionId, submittedAt, assets, ...pinned })
  })

  it('repeats the answers in rawData, in the order the form asks them', () => {
    expect(build().rawData).toEqual([
      { name: 'name', values: [LANDING_SUBMISSION.name] },
      { name: 'email', values: [LANDING_SUBMISSION.email] },
      { name: 'phone', values: [LANDING_SUBMISSION.phone] },
      { name: 'address', values: [LANDING_SUBMISSION.address] },
      { name: 'scope', values: [LANDING_SUBMISSION.scope] },
      { name: 'area', values: [LANDING_SUBMISSION.area] },
      { name: 'timing', values: [LANDING_SUBMISSION.timing] },
      { name: 'message', values: [LANDING_SUBMISSION.message] },
    ])
  })

  // An empty answer as an empty string would render a blank row in the answers dialog.
  it('omits an unanswered field from both the typed fields and rawData', () => {
    const envelope = buildEnvelope({
      values: { ...values, phone: '', message: '   ' },
      submissionId,
      assets: [],
      submittedAt,
    })

    expect(envelope).not.toHaveProperty('phone')
    expect(envelope).not.toHaveProperty('message')
    expect(envelope.rawData.map((answer) => answer.name)).not.toContain('phone')
  })

  // `locale` was dropped from the wire (decision 2026-09-21), so the labels are the default
  // dictionary's for every visitor — the salesperson reading them is Polish either way.
  it('labels the questions from the default dictionary', () => {
    const labels = getTranslations(i18n.defaultLocale).form

    expect(build().formQuestions).toEqual([
      { key: 'name', label: labels.name },
      { key: 'email', label: labels.email },
      { key: 'phone', label: labels.phone },
      { key: 'address', label: labels.address },
      { key: 'scope', label: labels.scope },
      { key: 'area', label: labels.area },
      { key: 'timing', label: labels.timing },
      { key: 'message', label: labels.message },
    ])
  })

  it('describes every question, including the ones this visitor left blank', () => {
    const envelope = buildEnvelope({
      values: { ...emptyContactValues(), email: 'anna@example.com', acceptsTerms: true },
      submissionId,
      assets: [],
    })

    expect(envelope.formQuestions).toHaveLength(8)
    expect(envelope.rawData).toHaveLength(1)
  })
})
