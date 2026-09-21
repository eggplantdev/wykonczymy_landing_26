// Swiper-free on purpose: the three slide components that spread this are server components,
// and `carousel.ts` imports `swiper/modules` and a hook.
// The first slide is never its own neighbour, so `lazyPreloadPrevNext` skips it. `eager` takes
// it off the observer, `low` keeps it behind the page's preloaded photo.
export const firstSlideLoading = { loading: 'eager', fetchPriority: 'low' } as const
