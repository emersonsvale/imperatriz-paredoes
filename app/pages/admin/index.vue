<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-text-secondary mb-4">Redirecionando para o painel admin...</p>
      <NuxtLink
        to="/admin/usuarios"
        class="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
      >
        Clique aqui se não for redirecionado
        <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-guard',
})

await navigateTo('/admin/usuarios', { replace: true })

useHead({
  title: 'Admin — Imperatriz Paredões',
})
</script>
