<template>
  <aside
    id="admin-sidebar"
    class="w-64 h-full bg-card-dark border-r border-border-dark flex flex-col justify-between hidden md:flex shrink-0 z-20"
  >
    <div class="p-6 flex flex-col gap-8">
      <!-- Brand / Admin -->
      <div class="flex items-center gap-3">
        <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-neon bg-background-dark flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
        </div>
        <div class="flex flex-col">
          <h1 class="text-white text-base font-bold leading-tight">
            {{ adminName }}
          </h1>
          <p class="text-text-secondary text-xs font-medium">
            Painel Administrativo
          </p>
        </div>
      </div>
      <!-- Navigation -->
      <nav class="flex flex-col gap-2">
        <NuxtLink
          to="/admin/usuarios"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/admin/usuarios') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">group</span>
          <span class="text-sm font-bold">Usuários</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/parceiros"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/admin/parceiros') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">handshake</span>
          <span class="text-sm font-medium">Parceiros</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/banners"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/admin/banners') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">campaign</span>
          <span class="text-sm font-medium">Banners</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/hero"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/admin/hero') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">view_carousel</span>
          <span class="text-sm font-medium">Destaques Hero</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/cds"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          :class="isActive('/admin/cds') ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon' : 'text-text-secondary hover:bg-white/5 hover:text-white'"
        >
          <span class="material-symbols-outlined">album</span>
          <span class="text-sm font-medium">CDs e Faixas</span>
        </NuxtLink>
      </nav>
    </div>
    <!-- Rodapé -->
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
const adminName = computed(() => perfil.value?.nome ?? 'Admin')
const route = useRoute()

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

async function handleSignOut() {
  await signOut()
  await navigateTo('/')
}
</script>
