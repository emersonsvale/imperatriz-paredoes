<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-white">Entrar</h1>
        <p class="mt-2 text-sm text-muted">
          Use seu e-mail e senha para acessar.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <BaseInput
          id="login-email"
          v-model="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          :error="error"
          :disabled="loading"
          required
        />
        <BaseInput
          id="login-senha"
          v-model="password"
          type="password"
          label="Senha"
          placeholder="Sua senha"
          :disabled="loading"
          required
        />
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </BaseButton>
      </form>

      <p class="text-center text-sm text-muted">
        Não tem conta?
        <NuxtLink to="/cadastro" class="font-bold text-primary hover:underline">
          Cadastrar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false,
  middleware: ['guest-guard'],
})

const { signInWithPassword, loading, error } = useAuth()
const email = ref('')
const password = ref('')

async function onSubmit() {
  const result = await signInWithPassword(email.value, password.value)
  if (result.success) await navigateTo('/')
}
</script>
