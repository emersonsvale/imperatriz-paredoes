<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full space-y-10">
      <!-- Hero Slider (banners, CDs e DJs selecionados pelo admin) -->
      <HeroSlider :slides="heroSlides" :autoplay-interval="6000" />

      <!-- Top 10 Downloads -->
      <section id="top-downloads">
        <SectionHeader
          title="Top 10 Downloads"
          icon="trending_up"
          action-text="Ver todos"
          action-to="/top-downloads"
        />
        <div v-if="topDownloads.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <CdCard
            v-for="cd in topDownloads"
            :key="cd.id"
            :id="cd.id"
            :title="cd.title"
            :artist="cd.artist"
            :cover-url="cd.coverUrl"
            :download-size="cd.downloadSize"
            :rank="cd.rank"
          />
        </div>
        <p v-else class="text-center py-8 text-text-secondary">
          Nenhum CD com downloads ainda.
        </p>
      </section>

      <!-- Top DJs -->
      <FeaturedSection
        id="top-djs"
        title="Top DJs"
        subtitle="Os artistas com mais CDs, plays e downloads."
        action-text="Ver todos"
        action-to="/djs"
      >
        <div v-if="topDjs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TopDjCard
            v-for="(dj, index) in topDjs"
            :key="dj.id"
            :id="dj.id"
            :nome="dj.nome"
            :avatar-url="dj.foto_perfil"
            :cd-count="dj.cdCount"
            :plays-count="dj.playsCount"
            :downloads-count="dj.downloadsCount"
            :rank="index + 1"
            :to="`/dj/${dj.id}`"
          />
        </div>
        <p v-else class="text-center py-8 text-text-secondary">
          Nenhum DJ com CDs publicados ainda.
        </p>
      </FeaturedSection>

      <!-- New Releases (CDs reais do banco) -->
      <section>
        <SectionHeader
          title="Últimos lançamentos"
          icon="new_releases"
          icon-color="text-accent-purple"
        />
        <div v-if="newReleases.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          <CdCardCompact
            v-for="cd in newReleases"
            :key="cd.id"
            :id="cd.id"
            :title="cd.title"
            :date="cd.date"
            :cover-url="cd.coverUrl"
            :is-new="cd.isNew"
          />
        </div>
        <p v-else class="text-center py-8 text-text-secondary">
          Nenhum lançamento ainda. Seja o primeiro a publicar um CD!
        </p>
      </section>

      <!-- Nossos Parceiros -->
      <FeaturedSection
        id="nossos-parceiros"
        title="Nossos Parceiros"
        subtitle="Marcas e parceiros que apoiam o som automotivo."
        action-text="Ver todos"
        action-to="/parceiros"
      >
        <div v-if="parceiros.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PartnerCard
            v-for="p in parceiros"
            :key="p.id"
            :id="p.id"
            :nome="p.nome"
            :logo-url="p.logoUrl"
            :href="p.href"
          />
        </div>
        <p v-else class="text-center py-8 text-text-secondary">
          Em breve, nossos parceiros serão divulgados aqui.
        </p>
      </FeaturedSection>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import HeroSlider from '~/components/HeroSlider.vue'
import type { HeroSlide } from '~~/shared/types/HeroSlide'
import SectionHeader from '~/components/SectionHeader.vue'
import FeaturedSection from '~/components/FeaturedSection.vue'
import CdCard from '~/components/CdCard.vue'
import CdCardCompact from '~/components/CdCardCompact.vue'
import TopDjCard from '~/components/TopDjCard.vue'
import PartnerCard from '~/components/PartnerCard.vue'
import type { CdCardData, CdCompactData } from '~~/shared/types/Cd'
import { formatRelativeDate } from '~/utils/formatRelativeDate'

useHead({
  title: 'Imperatriz Paredões - Som Automotivo',
})

/* ─── Últimos lançamentos (CDs públicos do banco) ─── */
const { data: latestCdsData } = await useFetch<{ items: { id: string; titulo: string; created_at: string; capa_url: string | null; artista: string }[] }>('/api/cds/latest', {
  key: 'cds-latest',
  default: () => ({ items: [] }),
})
const newReleases = computed<CdCompactData[]>(() => {
  const items = latestCdsData.value?.items ?? []
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  return items.map((cd) => ({
    id: cd.id,
    title: cd.titulo,
    date: formatRelativeDate(cd.created_at),
    coverUrl: cd.capa_url ?? '',
    isNew: now - new Date(cd.created_at).getTime() < oneDayMs,
  }))
})

/* ─── Top 10 Downloads (CDs do banco ordenados por downloads_count) ─── */
const { data: topDownloadsData } = await useFetch<{
  items: { id: string; titulo: string; capa_url: string | null; artista: string; downloads_count: number }[]
}>('/api/cds/top-downloads', {
  key: 'cds-top-downloads',
  default: () => ({ items: [] }),
})
const topDownloads = computed<CdCardData[]>(() => {
  const items = topDownloadsData.value?.items ?? []
  return items.map((cd, index) => ({
    id: cd.id,
    title: cd.titulo,
    artist: cd.artista,
    coverUrl: cd.capa_url ?? '',
    downloadSize: undefined,
    rank: index + 1,
  }))
})

/* ─── Top DJs (perfis com mais CDs, plays e downloads) ─── */
const { data: topDjsData } = await useFetch<{
  items: { id: string; nome: string; foto_perfil: string | null; cdCount: number; playsCount: number; downloadsCount: number }[]
}>('/api/djs/top', {
  key: 'djs-top',
  default: () => ({ items: [] }),
})
const topDjs = computed(() => topDjsData.value?.items ?? [])

/* ─── Nossos Parceiros (API pública) ─── */
interface ParceiroItem {
  id: string
  nome: string
  logoUrl?: string | null
  href?: string | null
}
const { data: parceirosData } = await useFetch<ParceiroItem[]>('/api/parceiros', {
  key: 'parceiros',
  default: () => [],
})
const parceiros = computed(() => parceirosData.value ?? [])

/* ─── Hero Slider (banners, CDs e DJs selecionados pelo admin) ─── */
const { data: heroSlidesData } = await useFetch<HeroSlide[]>('/api/hero/slides', {
  key: 'hero-slides',
  default: () => [],
})
const heroSlides = computed(() => heroSlidesData.value ?? [])

</script>
