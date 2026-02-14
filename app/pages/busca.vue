<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader v-model:search="searchInput" />

    <main class="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full">
      <p v-if="!searchQuery" class="text-muted-secondary py-8">
        Digite algo no campo de busca acima e pressione Enter.
      </p>

      <template v-else>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-6">
          Resultados para &quot;{{ searchQuery }}&quot;
        </h1>

        <div v-if="pending" class="flex justify-center py-12">
          <span class="text-muted-secondary">Buscando...</span>
        </div>

        <template v-else>
        <!-- CDs -->
        <section class="mb-10">
          <h2 class="text-lg font-semibold text-white mb-4">CDs</h2>
          <div v-if="cds.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            <CdCardCompact
              v-for="cd in cds"
              :key="cd.id"
              :id="cd.id"
              :title="cd.titulo"
              :date="cdDate(cd.created_at)"
              :cover-url="cd.capa_url ?? ''"
              :is-new="cdIsNew(cd.created_at)"
            />
          </div>
          <p v-else class="text-text-secondary py-4">Nenhum CD encontrado.</p>
        </section>

        <!-- DJs -->
        <section>
          <h2 class="text-lg font-semibold text-white mb-4">DJs</h2>
          <div v-if="djs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TopDjCard
              v-for="dj in djs"
              :key="dj.id"
              :id="dj.id"
              :nome="dj.nome"
              :avatar-url="dj.foto_perfil"
              :cd-count="dj.cdCount"
              :plays-count="dj.playsCount"
              :downloads-count="dj.downloadsCount"
              :to="`/dj/${dj.id}`"
            />
          </div>
          <p v-else class="text-text-secondary py-4">Nenhum DJ encontrado.</p>
        </section>
        </template>
      </template>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import CdCardCompact from '~/components/CdCardCompact.vue'
import TopDjCard from '~/components/TopDjCard.vue'
import type { SearchCdItem, SearchDjItem } from '~~/server/api/search.get'
import { formatRelativeDate } from '~/utils/formatRelativeDate'

const route = useRoute()

const searchQuery = computed(() => (route.query.q as string) ?? '')
const searchInput = ref(searchQuery.value)

watch(
  () => route.query.q,
  (q) => {
    searchInput.value = (q as string) ?? ''
  },
  { immediate: true }
)

const { data, pending } = await useFetch<{ cds: SearchCdItem[]; djs: SearchDjItem[] }>(
  () => (searchQuery.value ? `/api/search?q=${encodeURIComponent(searchQuery.value)}` : null),
  {
    key: () => `search-${searchQuery.value}`,
    watch: [searchQuery],
    default: () => ({ cds: [], djs: [] }),
  }
)

const cds = computed(() => data.value?.cds ?? [])
const djs = computed(() => data.value?.djs ?? [])

function cdDate(iso: string) {
  return formatRelativeDate(iso)
}

function cdIsNew(iso: string) {
  const oneDayMs = 24 * 60 * 60 * 1000
  return Date.now() - new Date(iso).getTime() < 7 * oneDayMs
}

useHead({
  title: searchQuery.value ? `Busca: ${searchQuery.value} | Imperatriz Paredões` : 'Busca | Imperatriz Paredões',
})
</script>
