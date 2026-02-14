<template>
  <div class="bg-background-dark font-display text-white overflow-hidden h-full flex flex-1 min-h-0">
    <ArtistSidebar />

    <main class="flex-1 flex flex-col h-full relative overflow-hidden">
      <div class="md:hidden flex items-center justify-between p-4 bg-card-dark border-b border-border-dark">
        <NuxtLink to="/" class="font-bold text-primary">
          IMPERATRIZ
        </NuxtLink>
        <button
          type="button"
          class="text-white material-symbols-outlined"
          aria-label="Menu"
        >
          menu
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
        <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 mb-8">
          <BaseIcon name="bar_chart" class="text-primary" />
          Estatísticas
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :subtitle="stat.subtitle"
            :subtitle-icon="stat.subtitleIcon"
            :subtitle-color="stat.subtitleColor"
            :icon="stat.icon"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BaseIcon name="trending_up" class="text-primary" />
              Plays nos últimos 7 dias
            </h2>
            <div class="space-y-3">
              <div
                v-for="day in playsLastDays"
                :key="day.label"
                class="flex items-center justify-between py-2 border-b border-border-dark last:border-0"
              >
                <span class="text-sm text-text-secondary">{{ day.label }}</span>
                <span class="text-sm font-bold text-white">{{ day.plays }}</span>
              </div>
            </div>
          </div>

          <div class="bg-card-dark border border-border-dark rounded-2xl p-6">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BaseIcon name="album" class="text-primary" />
              CDs mais ouvidos
            </h2>
            <div class="space-y-3">
              <div
                v-for="(cd, i) in topCds"
                :key="cd.title"
                class="flex items-center gap-3 py-2 border-b border-border-dark last:border-0"
              >
                <span class="text-xs font-bold text-text-secondary w-6">#{{ i + 1 }}</span>
                <span class="text-sm text-white truncate flex-1">{{ cd.title }}</span>
                <span class="text-sm font-bold text-primary">{{ cd.plays }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'artist',
  middleware: 'artist-guard',
})
import ArtistSidebar from '~/components/artist/ArtistSidebar.vue'
import StatCard from '~/components/StatCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useArtistCds } from '~/composables/useArtistCds'

const { cds } = useArtistCds()

const totalPlays = computed(() =>
  cds.value.reduce((acc, cd) => acc + (cd.plays_count ?? 0), 0)
)
const totalDownloads = computed(() =>
  cds.value.reduce((acc, cd) => acc + (cd.downloads_count ?? 0), 0)
)
const mediaPlaysPorCd = computed(() =>
  cds.value.length > 0 ? Math.round(totalPlays.value / cds.value.length) : 0
)

const stats = computed(() => [
  {
    label: 'CDs no ar',
    value: String(cds.value.length),
    subtitle: cds.value[0] ? `Último: "${cds.value[0].titulo}"` : 'Nenhum CD',
    subtitleIcon: undefined as string | undefined,
    subtitleColor: 'text-text-secondary',
    icon: 'album',
  },
  {
    label: 'Total de Plays',
    value: String(totalPlays.value),
    subtitle: `${totalDownloads.value} downloads no total`,
    subtitleIcon: 'trending_up' as const,
    subtitleColor: 'text-primary',
    icon: 'equalizer',
  },
  {
    label: 'Média de plays por CD',
    value: String(mediaPlaysPorCd.value),
    subtitle: 'todos os CDs',
    subtitleIcon: undefined as string | undefined,
    subtitleColor: 'text-text-secondary',
    icon: 'show_chart',
  },
])

const playsLastDays = [
  { label: 'Hoje', plays: '—' },
  { label: 'Ontem', plays: '—' },
  { label: 'Qui', plays: '—' },
  { label: 'Qua', plays: '—' },
  { label: 'Ter', plays: '—' },
  { label: 'Seg', plays: '—' },
  { label: 'Dom', plays: '—' },
]

const topCds = computed(() =>
  cds.value
    .slice()
    .sort((a, b) => (b.plays_count ?? 0) - (a.plays_count ?? 0))
    .slice(0, 5)
    .map((cd) => ({ title: cd.titulo, plays: cd.plays_count ?? 0 }))
)

useHead({
  title: 'Estatísticas — Imperatriz Paredões',
})
</script>
