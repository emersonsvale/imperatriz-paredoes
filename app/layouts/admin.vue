<template>
  <div v-if="guardReady" class="flex-1 min-h-0 flex flex-col overflow-hidden">
    <NuxtPage />
  </div>
  <div
    v-else
    class="flex min-h-screen items-center justify-center bg-background-dark font-display text-white"
  >
    <p class="text-text-secondary">
      Carregando...
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Layout /admin/*. Usa getSession() (storage) para não depender de useSupabaseUser().
 */
const guardReady = ref(false)

onMounted(async () => {
  const supabase = useSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    navigateTo('/login')
    return
  }

  const { data: perfil } = await supabase
    .from('perfil')
    .select('tipo_user')
    .eq('id', userId)
    .single()

  if (perfil?.tipo_user !== 'Admin') {
    navigateTo('/')
    return
  }

  guardReady.value = true
})
</script>
