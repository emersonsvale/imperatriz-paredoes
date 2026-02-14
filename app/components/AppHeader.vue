<template>
  <header
    id="app-header"
    class="sticky top-0 z-50 border-b border-nav-border bg-background-page/98 backdrop-blur-md py-4 overflow-visible min-h-[5rem]"
  >
    <div
      class="relative mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 md:px-10"
    >
      <!-- Logo: tamanho atual, fora do fluxo para não aumentar a altura do header -->
      <NuxtLink
        to="/"
        class="absolute left-6 md:left-10 -top-4 z-10 flex shrink-0"
      >
        <img
          src="/LOGO%20IMPERATRIZ%203D%201.png"
          alt="Imperatriz Paredões"
          class="h-20 w-auto max-h-none object-contain object-left md:h-24 lg:h-28 drop-shadow-lg"
          width="200"
          height="80"
        />
      </NuxtLink>
      <!-- Espaço reservado para a logo (não sobrepor busca/botões) -->
      <div class="w-20 md:w-24 lg:w-28 shrink-0" aria-hidden="true" />
      <!-- Search Bar -->
      <div class="hidden md:flex min-w-0 max-w-xl flex-1 mx-4 lg:mx-8">
        <form
          class="relative w-full group"
          action="/busca"
          method="get"
          @submit.prevent="onSearchSubmit"
        >
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted group-focus-within:text-primary transition-colors">
            <span class="material-symbols-outlined">search</span>
          </div>
          <input
            :id="searchInputId"
            v-model="searchQuery"
            class="w-full bg-card-dark border-none rounded-xl py-3 pl-12 pr-4 text-white placeholder-muted-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-page focus:bg-card-hover transition-all"
            type="search"
            name="q"
            autocomplete="off"
            :placeholder="searchPlaceholder"
            aria-label="Buscar"
          />
        </form>
      </div>
      <!-- User Actions -->
      <div class="flex shrink-0 items-center gap-3">
        <template v-if="isAuthenticated">
          <NuxtLink
            v-if="perfil?.tipo_user === 'Admin'"
            to="/admin/usuarios"
            class="hidden sm:flex items-center gap-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-2 text-sm font-bold transition-colors"
            aria-label="Painel Admin"
          >
            <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
            Admin
          </NuxtLink>
          <NuxtLink
            to="/artist/configuracoes/perfil"
            class="hidden sm:flex items-center gap-2 rounded-xl bg-card-dark hover:bg-card-hover p-1 pr-4 transition-colors"
            aria-label="Meu Perfil"
            @click="emit('profile-click')"
          >
            <div class="size-8 rounded-lg bg-gradient-to-br from-primary to-accent-purple overflow-hidden flex shrink-0">
              <img
                v-if="displayAvatarUrl"
                :alt="displayName ? `Avatar de ${displayName}` : 'Avatar do usuário'"
                class="h-full w-full object-cover"
                :src="displayAvatarUrl"
              >
              <span
                v-else
                class="flex h-full w-full items-center justify-center bg-primary/80 text-background-page text-sm font-bold"
              >
                {{ displayInitial }}
              </span>
            </div>
            <span class="text-sm font-bold text-white">{{ displayName || 'Meu Perfil' }}</span>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="rounded-xl bg-card-dark hover:bg-card-hover px-4 py-2.5 text-sm font-bold text-white transition-colors"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            to="/cadastro"
            class="rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-sm font-bold text-background-page transition-colors shadow-primary-glow"
          >
            Cadastrar
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { usePerfil } from '~/composables/usePerfil'

const searchInputId = 'header-search-input'

const props = withDefaults(
  defineProps<{
    searchPlaceholder?: string
  }>(),
  {
    searchPlaceholder: 'Buscar CDs, DJs ou Paredões...',
  }
)

const emit = defineEmits<{
  'profile-click': []
}>()

const searchQuery = defineModel<string>('search', { default: '' })
const route = useRoute()

function onSearchSubmit() {
  const q = searchQuery.value?.trim() ?? ''
  if (!q) return
  navigateTo({ path: '/busca', query: { q } })
}

watch(
  () => route.query.q,
  (q) => {
    if (route.path === '/busca' && typeof q === 'string') {
      searchQuery.value = q
    }
  },
  { immediate: true }
)

const user = useSupabaseUser()
const { perfil } = usePerfil()

const isAuthenticated = computed(() => Boolean(user.value))

const displayName = computed(() => perfil.value?.nome ?? user.value?.email ?? '')

const displayAvatarUrl = computed(() => perfil.value?.foto_perfil ?? null)

const displayInitial = computed(() => {
  const name = perfil.value?.nome ?? user.value?.email ?? ''
  if (!name) return '?'
  const first = name.trim().charAt(0)
  return first.toUpperCase()
})
</script>
