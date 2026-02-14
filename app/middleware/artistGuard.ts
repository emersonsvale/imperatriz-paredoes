/**
 * Restringe rotas /artist/* apenas a usuários com perfil tipo_user = 'DJ'.
 * No cliente usa supabase.auth.getSession() (sessão direta do storage), sem depender de useSupabaseUser().
 */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    const user = useSupabaseUser()
    if (!user.value?.id) {
      return navigateTo('/login')
    }
    try {
      const headers = useRequestHeaders(['cookie']) as HeadersInit
      const res = await $fetch<{ tipo_user: string | null }>('/api/me/tipo-user', { headers })
      if (res?.tipo_user !== 'DJ') {
        return navigateTo('/')
      }
    } catch {
      return navigateTo('/login')
    }
    return
  }

  const supabase = useSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    return navigateTo('/login')
  }

  const { data: perfil } = await supabase
    .from('perfil')
    .select('tipo_user')
    .eq('id', userId)
    .single()

  if (perfil?.tipo_user !== 'DJ') {
    return navigateTo('/')
  }
})
