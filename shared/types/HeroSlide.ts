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

/** Slide apenas imagem/banner (opcionalmente com link) */
export interface HeroSlideBanner {
  type: 'banner'
  imageUrl: string
  imageAlt?: string
  /** Link ao clicar no banner – se omitido, não é clicável */
  link?: string
}

export type HeroSlide = HeroSlideContent | HeroSlideBanner
