/**
 * Usado na tela de login: se o usuário já estiver logado, redireciona conforme o perfil.
 * - Admin → /admin
 * - DJ → /artist
 * - Ouvinte (ou sem perfil) → /
 */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    const user = useSupabaseUser()
    if (!user.value?.id) return
    try {
      const headers = useRequestHeaders(['cookie']) as HeadersInit
      const res = await $fetch<{ tipo_user: string | null }>('/api/me/tipo-user', { headers })
      const tipo = res?.tipo_user ?? 'Ouvinte'
      if (tipo === 'Admin') return navigateTo('/admin')
      if (tipo === 'DJ') return navigateTo('/artist')
      return navigateTo('/')
    } catch {
      return navigateTo('/')
    }
  }

  const supabase = useSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) return

  const { data: perfil } = await supabase
    .from('perfil')
    .select('tipo_user')
    .eq('id', userId)
    .single()

  const tipo = perfil?.tipo_user ?? 'Ouvinte'
  if (tipo === 'Admin') return navigateTo('/admin')
  if (tipo === 'DJ') return navigateTo('/artist')
  return navigateTo('/')
})
