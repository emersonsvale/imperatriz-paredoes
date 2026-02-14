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
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BaseIcon name="album" class="text-primary" />
            Meus CDs
          </h1>
          <NuxtLink
            to="/artist/upload"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background-dark font-bold text-sm hover:bg-primary-hover transition-colors"
          >
            <span class="material-symbols-outlined text-lg">add</span>
            Lançar CD
          </NuxtLink>
        </div>

        <div v-if="cdsLoading" class="flex items-center justify-center py-12">
          <p class="text-text-secondary">Carregando seus CDs...</p>
        </div>
        <div v-else-if="myCds.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <CdCard
            v-for="cd in myCds"
            :key="cd.id"
            :id="cd.id"
            :title="cd.title"
            :artist="cd.artist"
            :cover-url="cd.coverUrl"
            :download-size="cd.downloadSize"
          />
        </div>

        <EmptyState
          v-else
          icon="album"
          title="Nenhum CD lançado"
          description="Publique seu primeiro CD pelo Dashboard para ele aparecer aqui."
          action-label="Ir para Dashboard"
          action-to="/artist/upload"
          action-icon="dashboard"
        />
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
import CdCard from '~/components/CdCard.vue'
import EmptyState from '~/components/EmptyState.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useArtistCds } from '~/composables/useArtistCds'
import { usePerfil } from '~/composables/usePerfil'

const { cds, loading: cdsLoading, toCdCardData, fetchCds } = useArtistCds()
const { perfil } = usePerfil()

const artistName = computed(() => perfil.value?.nome ?? 'Artista')
const myCds = computed(() => cds.value.map((cd) => toCdCardData(cd, artistName.value)))

useHead({
  title: 'Meus CDs — Imperatriz Paredões',
})
</script>
