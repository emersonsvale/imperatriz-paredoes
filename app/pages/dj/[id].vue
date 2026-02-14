<template>
  <div class="flex min-h-screen flex-col pb-24 antialiased">
    <AppHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-6 py-8 lg:px-10">
      <BreadcrumbNav :items="breadcrumbs" />

      <div v-if="loading" class="flex items-center justify-center py-20">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>

      <div v-else-if="dj" class="flex flex-col gap-10">
        <!-- Cabeçalho do perfil -->
        <div class="rounded-2xl border border-white/5 bg-surface-dark p-6 md:p-8">
          <div class="flex flex-col gap-6 md:flex-row md:items-start">
            <div class="shrink-0">
              <div class="size-28 overflow-hidden rounded-full border-2 border-primary md:size-36">
                <img
                  v-if="dj.foto_perfil"
                  :alt="dj.nome"
                  class="size-full object-cover"
                  :src="dj.foto_perfil"
                />
                <div
                  v-else
                  class="flex size-full items-center justify-center bg-surface text-4xl font-bold text-primary md:text-5xl"
                >
                  {{ dj.nome.charAt(0).toUpperCase() }}
                </div>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-green">
                DJ / Artista
              </p>
              <h1 class="font-display text-3xl font-bold text-white md:text-4xl">
                {{ dj.nome }}
              </h1>
              <div class="mt-4 flex flex-wrap gap-4 text-sm text-muted-green">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[18px]">album</span>
                  <strong class="text-white">{{ dj.cdCount }}</strong> CDs
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[18px]">equalizer</span>
                  <strong class="text-white">{{ dj.playsCount }}</strong> plays
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[18px]">download</span>
                  <strong class="text-white">{{ dj.downloadsCount }}</strong> downloads
                </span>
              </div>
              <p
                v-if="dj.bio"
                class="mt-4 max-w-2xl text-sm leading-relaxed text-white/70"
              >
                {{ dj.bio }}
              </p>
              <!-- Redes sociais -->
              <div
                v-if="hasSocialLinks"
                class="mt-6 flex flex-wrap gap-3"
              >
                <a
                  v-if="dj.instagram"
                  :href="instagramHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-[#E1306C] hover:bg-[#E1306C]/10 hover:text-white"
                >
                  <span class="material-symbols-outlined text-[20px]">photo_camera</span>
                  Instagram
                </a>
                <a
                  v-if="dj.facebook"
                  :href="facebookHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-white"
                >
                  <span class="material-symbols-outlined text-[20px]">group</span>
                  Facebook
                </a>
                <a
                  v-if="dj.twitter"
                  :href="twitterHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:text-white"
                >
                  <span class="material-symbols-outlined text-[20px]">tag</span>
                  X / Twitter
                </a>
                <a
                  v-if="dj.whatsapp"
                  :href="whatsappHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-white"
                >
                  <span class="material-symbols-outlined text-[20px]">chat</span>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de CDs -->
        <section>
          <h2 class="mb-6 font-display text-xl font-bold text-white md:text-2xl">
            CDs de {{ dj.nome }}
          </h2>
          <div
            v-if="dj.cds.length"
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            <NuxtLink
              v-for="cd in dj.cds"
              :key="cd.id"
              :to="`/cd/${cd.id}`"
              class="group flex flex-col gap-2"
            >
              <div class="relative aspect-square overflow-hidden rounded-xl">
                <img
                  :alt="cd.titulo"
                  class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  :src="cd.capa_url || '/placeholder-cd.png'"
                />
                <div class="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
              </div>
              <div>
                <h3 class="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-primary">
                  {{ cd.titulo }}
                </h3>
                <p class="mt-0.5 text-xs text-muted-green">
                  {{ formatDate(cd.created_at) }} · {{ cd.plays_count }} plays · {{ cd.downloads_count }} downloads
                </p>
              </div>
            </NuxtLink>
          </div>
          <p v-else class="py-8 text-center text-muted-green">
            Nenhum CD publicado ainda.
          </p>
        </section>
      </div>

      <EmptyState
        v-else
        icon="person"
        title="DJ não encontrado"
        description="O perfil que você procura não existe ou foi removido."
        action-label="Voltar ao Início"
        action-to="/"
        action-icon="arrow_back"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import BreadcrumbNav from '~/components/BreadcrumbNav.vue'
import EmptyState from '~/components/EmptyState.vue'
import type { BreadcrumbItem } from '~/components/BreadcrumbNav.vue'
import { instagramUrl, facebookUrl, twitterUrl, whatsappUrl } from '~/utils/socialLinks'

interface DjPublicProfile {
  id: string
  nome: string
  foto_perfil: string | null
  bio: string | null
  instagram: string | null
  facebook: string | null
  twitter: string | null
  whatsapp: string | null
  cdCount: number
  playsCount: number
  downloadsCount: number
  cds: Array<{
    id: string
    titulo: string
    capa_url: string | null
    created_at: string
    downloads_count: number
    plays_count: number
  }>
}

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: djData, pending: loading } = await useFetch<DjPublicProfile | null>(
  () => `/api/djs/${id.value}`,
  { key: () => `dj-${id.value}` }
)

const dj = computed<DjPublicProfile | null>(() => djData.value ?? null)

const hasSocialLinks = computed(() => {
  const d = dj.value
  return Boolean(d && (d.instagram || d.facebook || d.twitter || d.whatsapp))
})

const instagramHref = computed(() =>
  dj.value?.instagram ? instagramUrl(dj.value.instagram) : ''
)
const facebookHref = computed(() =>
  dj.value?.facebook ? facebookUrl(dj.value.facebook) : ''
)
const twitterHref = computed(() =>
  dj.value?.twitter ? twitterUrl(dj.value.twitter) : ''
)
const whatsappHref = computed(() =>
  dj.value?.whatsapp ? whatsappUrl(dj.value.whatsapp) : ''
)

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { label: 'Início', to: '/' },
  { label: 'DJs', to: '/#top-djs' },
  { label: dj.value ? dj.value.nome : 'Perfil' },
])

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

useHead({
  title: () =>
    dj.value
      ? `${dj.value.nome} - Imperatriz Paredões`
      : 'Perfil do DJ - Imperatriz Paredões',
})
</script>
