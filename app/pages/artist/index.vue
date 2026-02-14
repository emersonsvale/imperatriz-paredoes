<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-muted mb-4">Redirecionando para o painel do artista...</p>
      <NuxtLink
        to="/artist/upload"
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
  layout: 'artist',
  middleware: 'artist-guard',
})

// Redireciona /artist para o painel de upload
await navigateTo('/artist/upload', { replace: true })

useHead({
  title: 'Artista — Imperatriz Paredões',
})
</script>
