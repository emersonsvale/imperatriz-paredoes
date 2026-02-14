/**
 * Composable de autenticação Supabase.
 * Expõe usuário, estado de loading e ações (login OTP, email/senha, cadastro, logout).
 */
import type { User } from '@supabase/supabase-js'
import type { Database } from '~~/shared/types/database.types'

type TipoUser = Database['public']['Enums']['tipo_user']

export interface SignUpPayload {
  email: string
  password: string
  nome: string
  telefone?: string
  tipo_user?: TipoUser
  foto_perfil?: string
}

export function useAuth() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function signUp(payload: SignUpPayload) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: payload.email.trim(),
        password: payload.password,
        options: {
          data: {
            full_name: payload.nome.trim(),
            name: payload.nome.trim(),
            telefone: payload.telefone?.trim() ?? '',
            tipo_user: payload.tipo_user ?? 'Ouvinte',
            foto_perfil: payload.foto_perfil?.trim() ?? '',
          },
        },
      })
      if (err) {
        error.value = err.message
        return { success: false, error: err }
      }
      return { success: true, data }
    } finally {
      loading.value = false
    }
  }

  async function signInWithPassword(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (err) {
        error.value = err.message
        return { success: false, error: err }
      }
      return { success: true }
    } finally {
      loading.value = false
    }
  }

  async function signInWithOtp(email: string, redirectTo?: string) {
    loading.value = true
    error.value = null
    const baseUrl = import.meta.client && typeof window !== 'undefined' ? window.location.origin : ''
    const callbackUrl = redirectTo ?? (baseUrl ? `${baseUrl}/confirm` : undefined)
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: callbackUrl,
        },
      })
      if (err) {
        error.value = err.message
        return { success: false, error: err }
      }
      return { success: true }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null
    try {
      await supabase.auth.signOut()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao sair'
    } finally {
      loading.value = false
    }
  }

  return {
    user: user as Ref<User | null>,
    isAuthenticated,
    loading: readonly(loading),
    error: readonly(error),
    signUp,
    signInWithPassword,
    signInWithOtp,
    signOut,
  }
}
