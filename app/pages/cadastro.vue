<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-white">Criar conta</h1>
        <p class="mt-2 text-sm text-muted">
          Preencha seus dados para se cadastrar.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <BaseInput
          id="cadastro-nome"
          v-model="nome"
          type="text"
          label="Nome"
          placeholder="Seu nome"
          :error="fieldErrors.nome"
          :disabled="loading"
          required
        />
        <BaseInput
          id="cadastro-email"
          v-model="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          :error="fieldErrors.email"
          :disabled="loading"
          required
        />
        <BaseInput
          id="cadastro-senha"
          v-model="password"
          type="password"
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          :error="fieldErrors.password"
          :disabled="loading"
          required
        />
        <BaseInput
          id="cadastro-telefone"
          v-model="telefone"
          type="tel"
          label="Telefone"
          placeholder="(00) 00000-0000"
          :error="fieldErrors.telefone"
          :disabled="loading"
        />

        <p v-if="authError" class="text-sm text-red-400">
          {{ authError }}
        </p>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="loading"
        >
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </BaseButton>
      </form>

      <p class="text-center text-sm text-muted">
        Já tem conta?
        <NuxtLink to="/login" class="font-bold text-primary hover:underline">
          Entrar
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
})

const { signUp, loading, error: authError } = useAuth()

const nome = ref('')
const email = ref('')
const password = ref('')
const telefone = ref('')

const fieldErrors = ref<Record<string, string>>({})

function validate(): boolean {
  const err: Record<string, string> = {}
  if (!nome.value.trim()) err.nome = 'Nome é obrigatório'
  if (!email.value.trim()) err.email = 'E-mail é obrigatório'
  if (!password.value) err.password = 'Senha é obrigatória'
  else if (password.value.length < 6) err.password = 'Senha deve ter no mínimo 6 caracteres'
  fieldErrors.value = err
  return Object.keys(err).length === 0
}

async function onSubmit() {
  fieldErrors.value = {}
  if (!validate()) return

  const result = await signUp({
    email: email.value,
    password: password.value,
    nome: nome.value.trim(),
    telefone: telefone.value.trim() || undefined,
  })

  if (result.success) {
    await navigateTo('/')
  }
}
</script>
