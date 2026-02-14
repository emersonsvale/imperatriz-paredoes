<template>
  <aside
    id="artist-sidebar"
    class="w-64 h-full bg-card-dark border-r border-border-dark flex flex-col justify-between hidden md:flex shrink-0 z-20"
  >
    <div class="p-6 flex flex-col gap-8">
      <!-- Brand / Profile -->
      <div class="flex items-center gap-3">
        <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-neon bg-background-dark">
          <img
            v-if="avatarUrl"
            alt="Perfil do artista"
            class="w-full h-full object-cover"
            :src="avatarUrl"
          >
          <div v-else class="w-full h-full flex items-center justify-center text-text-secondary">
            <span class="material-symbols-outlined">person</span>
          </div>
        </div>
        <div class="flex flex-col">
          <h1 class="text-white text-base font-bold leading-tight">
            {{ artistName }}
          </h1>
          <p class="text-text-secondary text-xs font-medium">
            Painel do Artista
          </p>
        </div>
      </div>
      <!-- Navigation -->
      <nav class="flex flex-col gap-2">
        <NuxtLink
          to="/artist/upload"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/artist/upload') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">dashboard</span>
          <span class="text-sm font-bold">Dashboard</span>
        </NuxtLink>
        <NuxtLink
          to="/artist/cds"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/artist/cds') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">album</span>
          <span class="text-sm font-medium">Meus CDs</span>
        </NuxtLink>
        <NuxtLink
          to="/artist/estatisticas"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/artist/estatisticas') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">bar_chart</span>
          <span class="text-sm font-medium">Estatísticas</span>
        </NuxtLink>
        <NuxtLink
          to="/artist/configuracoes/perfil"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/artist/configuracoes/perfil') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">settings</span>
          <span class="text-sm font-medium">Configurações</span>
        </NuxtLink>
      </nav>
    </div>
    <!-- Rodapé: início e sair -->
    <div class="p-4 border-t border-border-dark flex flex-col gap-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
      >
        <span class="material-symbols-outlined">home</span>
        <span class="text-sm font-medium">Página inicial</span>
      </NuxtLink>
      <button
        type="button"
        class="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
        @click="handleSignOut"
      >
        <span class="material-symbols-outlined">logout</span>
        <span class="text-sm font-medium">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePerfil } from '~/composables/usePerfil'
import { useAuth } from '~/composables/useAuth'

const { perfil } = usePerfil()
const { signOut } = useAuth()
const artistName = computed(() => perfil.value?.nome ?? 'Artista')
const avatarUrl = computed(() => perfil.value?.foto_perfil ?? '')

const route = useRoute()
function isActive(path: string) {
  if (path.startsWith('/artist/configuracoes')) {
    return route.path.startsWith('/artist/configuracoes')
  }
  return route.path === path
}

async function handleSignOut() {
  await signOut()
  await navigateTo('/')
}
</script>
