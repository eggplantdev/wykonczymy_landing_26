import { useEffect, useState } from 'react'
import { Autoplay, Keyboard } from 'swiper/modules'
import type { SwiperClass, SwiperProps } from 'swiper/react'

import { useIsOverlayOpen } from '@/lib/overlay'

// What `lazyPreloadPrevNext` cannot reach: the first slide is never its own neighbour, so it
// keeps native lazy loading and waits for the visitor to scroll within range of the carousel.
// `eager` takes that gate off; `low` keeps the request behind the page's own preloaded photo,
// which is the one image that has to arrive first.
export const firstSlideLoading = { loading: 'eager', fetchPriority: 'low' } as const

// Every carousel on the site behaves identically — the same advance, the same pause on
// hover, the same keyboard support. Only the track geometry (slidesPerView, spacing,
// breakpoints) is a per-section decision, so that stays at the call site.
export const carouselDefaults = {
  modules: [Autoplay, Keyboard],
  loop: true,
  // `disableOnInteraction: false` so a swipe pauses the rotation rather than killing it
  // for the rest of the visit.
  autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
  // A slide parked off to the side is clipped by the track, so its intersection ratio is
  // zero and native lazy loading never fires — the first advance then lands on an image
  // that starts downloading at that moment. Swiper strips `loading` off the neighbouring
  // slides instead (`lazyPreload` is on by default; the count is what ships at 0), which
  // covers everything past the first slide. The first one is the caller's job: it is never
  // a neighbour of itself, so it waits for the visitor to scroll within range.
  lazyPreloadPrevNext: 1,
  speed: 200,
  grabCursor: true,
  keyboard: { enabled: true },
} satisfies SwiperProps

// Swiper lays the track out on the client, so the first paint is a stack of full-width
// slides. Every carousel hides itself until Swiper reports ready; the gate lives here so
// the trade — an SSR-invisible section in exchange for no layout flash — is decided once.
//
// It also holds the instance, which is what lets a covered carousel stand down: Swiper's
// keyboard handler is on `document` and its `onlyInViewport` guard asks only whether the
// track is on screen, never whether a dialog is painted over it. Every carousel goes
// through this hook, so the rule lands once rather than per section.
//
// `keyboard.disable()` and not the instance-wide `disable()`: the latter also stops touch,
// and a resize while it is off — which Radix's scroll lock fires on opening a dialog —
// leaves the track's active slide unset, because the realignment that would normally
// follow is exactly what being disabled suppresses. Autoplay is stopped alongside for the
// same reason the keys are: whatever moves the track while it is covered, the visitor
// finds it somewhere else on closing with nothing to connect that to.
export function useCarousel() {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const isOverlayOpen = useIsOverlayOpen()

  useEffect(() => {
    if (!swiper || swiper.destroyed || !isOverlayOpen) return

    // Only restart what this hook stopped — a section may have paused its own rotation for
    // reasons of its own, and an overlay closing is no licence to override that.
    const wasAutoplaying = swiper.autoplay.running

    swiper.keyboard.disable()
    if (wasAutoplaying) swiper.autoplay.stop()

    return () => {
      if (swiper.destroyed) return

      swiper.keyboard.enable()
      if (wasAutoplaying) swiper.autoplay.start()
    }
  }, [swiper, isOverlayOpen])

  return {
    className: swiper ? undefined : 'opacity-0',
    onSwiper: setSwiper,
    swiper,
  }
}
