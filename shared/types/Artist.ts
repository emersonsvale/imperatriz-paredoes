/** Perfil de um DJ/Artista */
export interface ArtistProfile {
  /** ID do perfil (UUID) para link para página pública do DJ */
  id?: string
  name: string
  avatarUrl: string
  bio: string
  /** URL ou @handle do Instagram */
  instagram?: string
  /** URL do Facebook */
  facebook?: string
  /** URL ou @handle do Twitter/X */
  twitter?: string
  /** Número com DDI ou link wa.me */
  whatsapp?: string
  /** URL do SoundCloud (legado) */
  soundcloud?: string
}
