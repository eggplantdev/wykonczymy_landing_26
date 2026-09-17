import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

import { emptyContactValues, type ContactFormValuesT } from './contact-schema'

export type ContactDraftT = Omit<ContactFormValuesT, 'acceptsTerms'>

type ContactFormStoreT = {
  draft: ContactDraftT
  setDraft: (values: ContactFormValuesT) => void
  clearDraft: () => void
}

// The one place consent is dropped. Restoring a ticked box would be agreement the
// visitor never gave in this session, and `Omit` only states that in the type — this
// is what enforces it at every call site.
export function toDraft({ acceptsTerms: _acceptsTerms, ...draft }: ContactFormValuesT) {
  return draft
}

export const useContactFormStore = create<ContactFormStoreT>()(
  persist(
    (set, get) => ({
      draft: toDraft(emptyContactValues()),
      setDraft: (values) => {
        const draft = toDraft(values)
        // The form holds its debounce timer per field, so several fields' timers can
        // land back to back once typing stops, each reading the same values. Without this
        // guard each repeat re-serialises an identical draft into sessionStorage.
        if (shallow(get().draft, draft)) return
        set({ draft })
      },
      clearDraft: () => set({ draft: toDraft(emptyContactValues()) }),
    }),
    {
      name: 'contact-form-draft',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)
