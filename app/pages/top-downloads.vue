<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full">
      <section>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BaseIcon name="trending_up" class="text-primary" />
              Top Downloads
            </h1>
            <p class="text-muted text-sm mt-1">
              CDs mais baixados pela galera.
            </p>
          </div>
          <NuxtLink
            to="/"
            class="text-sm font-semibold text-muted hover:text-primary transition-colors hidden md:flex items-center gap-1"
          >
            <BaseIcon name="arrow_back" size="md" />
            Voltar à home
          </NuxtLink>
        </div>

        <div v-if="items.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <CdCard
            v-for="(cd, index) in items"
            :key="cd.id"
            :id="cd.id"
            :title="cd.titulo"
            :artist="cd.artista"
            :cover-url="cd.capa_url ?? ''"
            :download-size="undefined"
            :rank="index + 1"
          />
        </div>
        <p v-else class="text-center py-12 text-text-secondary">
          Nenhum CD com downloads ainda.
        </p>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import CdCard from '~/components/CdCard.vue'
import type { TopDownloadItem } from '~~/server/api/cds/top-downloads.get'

const { data } = await useFetch<{ items: TopDownloadItem[] }>('/api/cds/top-downloads?limit=100', {
  key: 'cds-top-downloads-all',
  default: () => ({ items: [] }),
})

const items = computed(() => data.value?.items ?? [])

useHead({
  title: 'Top Downloads | Imperatriz Paredões',
})
</script>
