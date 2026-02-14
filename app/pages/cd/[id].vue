<template>
  <div class="flex min-h-screen flex-col pb-24 antialiased">
    <AppHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-6 py-8 lg:px-10">
      <BreadcrumbNav :items="breadcrumbs" />

      <div v-if="loading" class="flex items-center justify-center py-20">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>

      <div v-else-if="cd" class="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <CdDetailAlbum
            :album="cd.album"
            :dj="cd.dj"
            :cd-id="id"
            :tracks="cd.tracks"
          />
        </div>
        <div class="lg:col-span-8">
          <CdDetailTracklist
            :tracks="cd.tracks"
            :album-cover-url="cd.album.coverUrl"
            :initial-visible="6"
            :cd-id="id"
          />
        </div>
      </div>

      <EmptyState
        v-else
        icon="album"
        title="CD não encontrado"
        description="O CD que você procura não existe ou foi removido."
        action-label="Voltar ao Início"
        action-to="/"
        action-icon="arrow_back"
      />
    </main>

  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import CdDetailAlbum from '~/components/CdDetailAlbum.vue'
import CdDetailTracklist from '~/components/CdDetailTracklist.vue'
import BreadcrumbNav from '~/components/BreadcrumbNav.vue'
import EmptyState from '~/components/EmptyState.vue'
import type { AlbumDetail, Track } from '~~/shared/types/Cd'
import type { ArtistProfile } from '~~/shared/types/Artist'
import type { BreadcrumbItem } from '~/components/BreadcrumbNav.vue'

interface CdDetailData {
  album: AlbumDetail
  dj: ArtistProfile
  tracks: Track[]
}

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: cdData, pending: loading } = await useFetch<CdDetailData | null>(
  () => `/api/cds/${id.value}`,
  { key: () => `cd-${id.value}` }
)

const cd = computed<CdDetailData | null>(() => cdData.value ?? null)

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { label: 'Início', to: '/' },
  { label: 'CDs', to: '/' },
  { label: cd.value ? cd.value.album.title : 'CD não encontrado' },
])

useHead({
  title: () =>
    cd.value
      ? `${cd.value.album.title} - Imperatriz Paredões`
      : 'Detalhes do CD - Imperatriz Paredões',
})
</script>
