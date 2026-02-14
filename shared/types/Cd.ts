/** Dados para exibição em CdCard (grid vertical com rank) */
export interface CdCardData {
  id: string | number
  title: string
  artist: string
  coverUrl: string
  downloadSize?: string
  rank?: number
}

/** Dados para exibição em CdCardHorizontal (list item com thumbnail) */
export interface CdHorizontalData {
  id: string | number
  title: string
  subtitle: string
  coverUrl: string
  badge?: string
}

/** Dados para exibição em CdCardCompact (lançamentos recentes) */
export interface CdCompactData {
  id: string | number
  title: string
  date: string
  coverUrl: string
  isNew?: boolean
}

/** Dados completos de um álbum/CD para página de detalhe */
export interface AlbumDetail {
  title: string
  subtitle: string
  coverUrl: string
  tags: string[]
  releaseDate: string
  trackCount: number
  totalDuration: string
  downloadsCount?: number
  playsCount?: number
}

/** Uma faixa de áudio */
export interface Track {
  id: string
  title: string
  artist: string
  duration: string
  isActive?: boolean
  /** URL do arquivo de áudio para reprodução */
  audioUrl?: string
  downloadsCount?: number
  playsCount?: number
}

/** Faixa atualmente em reprodução no player global */
export interface NowPlayingTrack {
  title: string
  artist: string
  duration: string
  albumArt?: string
  /** URL do arquivo de áudio */
  audioUrl?: string
  /** ID do CD (para contagem de plays) */
  cdId?: string
  /** ID da faixa (para contagem de plays) */
  faixaId?: string
}
