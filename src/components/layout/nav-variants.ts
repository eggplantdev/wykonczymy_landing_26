// The bar packs items into a bordered pill; inside the mobile panel they stack full
// width and the pill's chrome would only draw a box around the whole panel.
export type NavVariantT = 'bar' | 'panel'

export const navGroupClass: Record<NavVariantT, string> = {
  bar: '',
  panel: 'w-full flex-col border-transparent bg-transparent p-0',
}

export const navItemClass: Record<NavVariantT, string> = {
  bar: '',
  // No hover state on a touch panel: it only ever fires as a sticky highlight left
  // behind after a tap.
  panel: 'text-24 hover:text-shwarz min-h-12 w-full justify-center hover:bg-transparent',
}

// The trigger stands in for a whole NavGroup, so it carries the pill's own border and
// height rather than an item's.
export const navTriggerClass: Record<NavVariantT, string> = {
  bar: 'border-grau_700 min-h-10 rounded-lg border bg-white px-4',
  panel: 'bg-shwarz text-24 min-h-12 rounded-2xl border-transparent px-6 text-white',
}

// Open, the trigger drops the edge it shares with the list so the two read as one
// continuous shape rather than a pill with a box parked underneath.
export const navTriggerOpenClass = 'rounded-b-none border-b-transparent'

export const navMenuClass: Record<NavVariantT, string> = {
  bar: 'w-full flex-col rounded-t-none border-t-transparent p-1 pt-0',
  panel:
    'bg-shwarz w-full flex-col rounded-2xl rounded-t-none border-transparent p-1 pt-0 shadow-xl',
}

export const navMenuItemClass: Record<NavVariantT, string> = {
  bar: 'w-full justify-center',
  panel:
    'text-24 min-h-12 w-full justify-center rounded-xl text-white hover:bg-transparent hover:text-white',
}
