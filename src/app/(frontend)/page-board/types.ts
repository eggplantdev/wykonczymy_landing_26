export type BoardViewT = {
  height: number
  src: string
  thumbHeight: number
  thumbWidth: number
  viewport: string
  width: number
}

export type BoardPageT = {
  family: string
  redirectsTo?: string
  route: string
  source: string
  views?: BoardViewT[]
}

export type BoardFamilyT = {
  key: string
  label: string
  source: string
}

export type BoardViewportT = {
  key: string
  label: string
  screen: string
  width: number
}

export type BoardManifestT = {
  capturedAt: string
  families: BoardFamilyT[]
  pages: BoardPageT[]
  viewports: BoardViewportT[]
}
