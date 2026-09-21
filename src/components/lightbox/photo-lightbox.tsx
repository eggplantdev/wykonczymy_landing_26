'use client'

import dynamic from 'next/dynamic'
import { createContext, useContext, useState, type ReactNode } from 'react'

import type { MediaImageT } from '@/components/media/types'

// Swiper plus the dialog is weight a visitor who never opens a photo should not carry.
//
// `loading` is not cosmetic and must stay, even though it renders nothing. Without it Next
// gives the lazy component a Suspense boundary with no fallback, so the suspension bubbles
// to the page's own boundary: React hides that whole subtree while the chunk loads and the
// scroll position dies with it — opening a photo below the fold threw the visitor back up
// the page, and closing did not put them back.
const PhotoLightboxDialog = dynamic(
  () => import('./photo-lightbox-dialog').then((module) => module.PhotoLightboxDialog),
  { loading: () => null },
)

// Keyed by url so the tiles don't have to agree with the provider on a
// numbering — the article's two photos and the gallery below build their lists separately.
const PhotoLightboxContext = createContext<((url: string) => void) | null>(null)

type PropsT = {
  images: MediaImageT[]
  children: ReactNode
}

export function PhotoLightbox({ images, children }: PropsT) {
  const [openUrl, setOpenUrl] = useState<string | null>(null)
  const index = images.findIndex((image) => image.url === openUrl)

  // Closing drops focus on `<body>`, so the next Tab restarts at the top of the page —
  // accepted 2026-09-21. Radix only restores focus to a `Dialog.Trigger` and a tile is not
  // one, so fixing it means `onCloseAutoFocus`, which is more machinery than one stray Tab
  // is worth here.
  return (
    <PhotoLightboxContext value={setOpenUrl}>
      {children}

      {index >= 0 && (
        <PhotoLightboxDialog
          images={images}
          initialIndex={index}
          onClose={() => setOpenUrl(null)}
        />
      )}
    </PhotoLightboxContext>
  )
}

export function useOpenPhoto() {
  const openPhoto = useContext(PhotoLightboxContext)

  if (!openPhoto) throw new Error('useOpenPhoto must be used within a PhotoLightbox')

  return openPhoto
}
