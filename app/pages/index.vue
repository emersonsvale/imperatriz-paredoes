<template>
  <div class="flex min-h-screen flex-col pb-24">
    <AppHeader />

    <main class="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full space-y-10">
      <!-- Hero Slider (destaques, banners) -->
      <HeroSlider :slides="heroSlides" :autoplay-interval="6000" />

      <!-- Category Filters -->
      <CategoryTabs v-model="activeCategory" :tabs="categories" />

      <!-- Top 10 Downloads -->
      <section id="top-downloads">
        <SectionHeader
          title="Top 10 Downloads"
          icon="trending_up"
          action-text="Ver todos"
          action-to="/#top-downloads"
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
        action-to="/#top-downloads"
      >
        <div v-if="topDjs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TopDjCard
            v-for="dj in topDjs"
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
        action-to="/#nossos-parceiros"
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
import CategoryTabs from '~/components/CategoryTabs.vue'
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

/* ─── State ─── */
const activeCategory = ref('all')

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

/* ─── Nossos Parceiros (placeholder; depois pode vir de API/tabela) ─── */
interface ParceiroItem {
  id: string
  nome: string
  logoUrl?: string | null
  href?: string | null
}
const parceiros = ref<ParceiroItem[]>([])

/* ─── Hero Slider (destaques + banners) ─── */
const heroSlides: HeroSlide[] = [
  {
    type: 'content',
    tag: 'Destaque da Semana',
    title: 'Paredão',
    titleHighlight: 'Treme Terra',
    titleSuffix: '2024',
    description:
      'A maior seleção de Eletro-Funk e Automotivo do Brasil. Baixe agora o CD exclusivo mixado pelos melhores DJs da cena.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcurwCz4EBb9htKfYz_T4IscUZdLkJ5VmRpK6xIMkul64onZ4cXd2fD3SCOXIhSs4fJpQ-vDdyjbHSMHPuhirIc_wZny_uhI7QcPrfwin9Lm5qFF8dl1Efg52KAsacg5MZENb4Ilmw4-9LS6AEusmwJvFK9Cq1sS4K2MwkNQwUvI0GGZlJF2zX8i6lRirz4_OtEktVtngCbNYHW5KRCY_IdGi8YVJ-0Bx7dPLINsXYI8nSscxKrkpjZqqKwVSk3tGH8YpN3Ih8aRs',
    imageAlt: 'DJ performing at huge party with neon lights',
    listenUrl: '/cd/1',
    downloadUrl: '/cd/1',
  },
  {
    type: 'banner',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADan9_JJp55_0dOaH8xkzXMKxGZu5sU2hGxmBSNcJ4DvU16An3hg0oqpBfsdi08AWDzH9RCsWkKccytutdkBA283U3NNBzL44YT1O-sflCrOz53Cgs-GXtLv_qnAqdKootElKA1m5VnqE2Vf_fqDTB1MjWy_9tOTT0zoVyh3-HQ1QXKV0t9zgoid-tsu-4Qg1bRvoB5qkn_vhzwH95h64WKpXRZWUN7oFB8jS0pL8gPX8JUSk037neW5Z-9uSDrvXt5Mef5lAxoU4',
    imageAlt: 'Paredão 2024',
    link: '/cd/2',
  },
  {
    type: 'content',
    tag: 'Novidade',
    title: 'Summer',
    titleHighlight: 'Eletrohits',
    titleSuffix: '2024',
    description: 'Os hits do verão para o seu paredão.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAYLpwe1HeYLQ_PuRfdZJZAP-ijywmw5H9IETUobRjw48P7sndc-nkmhy3OsAXMtvsWohtnF2EbTrEv6xru-7eftj01MQfyXgqS0H6oR5L_7aeifVXYduk4_khdN4Y04aABZIRevUA4SzI-eobvAH-w595WHpBJyJ_IoaQkg7ab5ddxT7rlDyqSZY3vv6unf3BN_-Rw9thJAp3Toeq9LgbEgK-X23EWEwpuYpfi2WNe_H-_318BKGLoGei47ck7Ax36PiabdbFJU0E',
    imageAlt: 'Summer Eletrohits',
    listenUrl: '/cd/3',
  },
]

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'eletro-funk', label: 'Eletro-Funk' },
  { id: 'piseiro', label: 'Piseiro' },
  { id: 'forro', label: 'Forró' },
  { id: 'automotivo', label: 'Automotivo' },
  { id: 'mega-funk', label: 'Mega Funk' },
]

</script>
