/** Slide com conteúdo (título, descrição, botões Ouvir/Baixar) */
export interface HeroSlideContent {
  type: 'content'
  tag?: string
  title: string
  titleHighlight?: string
  titleSuffix?: string
  description?: string
  imageUrl: string
  imageAlt?: string
  /** URL para "Ouvir agora" – se omitido, o botão não é exibido */
  listenUrl?: string
  /** URL para "Baixar" – se omitido, o botão não é exibido */
  downloadUrl?: string
}

/** Slide de CD no hero: capa à esquerda, info à direita (tags, título, artista, botões) */
export interface HeroSlideCd {
  type: 'cd'
  id: string
  title: string
  artist: string
  coverUrl: string
  /** Data formatada (ex: 13/02/2026) */
  date: string
  tracksCount: number
  playsCount: number
  downloadsCount: number
  /** Exibir tag "NOVO" se lançado recentemente */
  isNew: boolean
  listenUrl: string
  downloadUrl: string
}

/** Slide apenas imagem/banner (opcionalmente com link) */
export interface HeroSlideBanner {
  type: 'banner'
  imageUrl: string
  imageAlt?: string
  /** Link ao clicar no banner – se omitido, não é clicável */
  link?: string
}

export type HeroSlide = HeroSlideContent | HeroSlideCd | HeroSlideBanner
