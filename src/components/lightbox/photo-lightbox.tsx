'use client'

import dynamic from 'next/dynamic'
import { createContext, useContext, useRef, useState, type ReactNode } from 'react'

import type { MediaImageT } from '@/components/media/types'

// Swiper plus the dialog is weight a visitor who never opens a photo should not carry.
const PhotoLightboxDialog = dynamic(() =>
  import('./photo-lightbox-dialog').then((module) => module.PhotoLightboxDialog),
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
  // Radix hands focus back to a `Dialog.Trigger`, and a tile is not one — without this,
  // closing leaves focus on `<body>` and the next Tab restarts at the top of the page.
  const opener = useRef<HTMLElement | null>(null)
  const index = images.findIndex((image) => image.url === openUrl)

  const open = (url: string) => {
    opener.current = document.activeElement as HTMLElement | null
    setOpenUrl(url)
  }

  const close = () => {
    opener.current?.focus()
    setOpenUrl(null)
  }

  return (
    <PhotoLightboxContext value={open}>
      {children}

      {index >= 0 && <PhotoLightboxDialog images={images} initialIndex={index} onClose={close} />}
    </PhotoLightboxContext>
  )
}

export function useOpenPhoto() {
  const openPhoto = useContext(PhotoLightboxContext)

  if (!openPhoto) throw new Error('useOpenPhoto must be used within a PhotoLightbox')

  return openPhoto
}
