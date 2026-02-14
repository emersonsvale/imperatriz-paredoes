<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <div class="text-center">
      <p v-if="pending" class="text-muted">Confirmando login...</p>
      <p v-else-if="error" class="text-red-400">{{ error }}</p>
      <p v-else class="text-white">Redirecionando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { useSupabaseCookieRedirect } from '#imports'

definePageMeta({
  layout: false,
})

const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()
const pending = ref(true)
const error = ref<string | null>(null)

watch(
  user,
  (u) => {
    if (u) {
      pending.value = false
      const path = redirectInfo.pluck()
      navigateTo(path || '/')
    }
  },
  { immediate: true }
)

onMounted(() => {
  setTimeout(() => {
    if (pending.value && !user.value) {
      pending.value = false
      error.value = 'Não foi possível confirmar o login. Tente novamente.'
    }
  }, 5000)
})
</script>
