<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full">
      <section>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BaseIcon name="groups" class="text-primary" />
              Top DJs
            </h1>
            <p class="text-muted text-sm mt-1">
              Os artistas com mais CDs, plays e downloads.
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

        <div v-if="items.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <TopDjCard
            v-for="(dj, index) in items"
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
        <p v-else class="text-center py-12 text-text-secondary">
          Nenhum DJ com CDs publicados ainda.
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
import TopDjCard from '~/components/TopDjCard.vue'
import type { TopDjItem } from '~~/server/api/djs/top.get'

const { data } = await useFetch<{ items: TopDjItem[] }>('/api/djs/top?limit=100', {
  key: 'djs-top-all',
  default: () => ({ items: [] }),
})

const items = computed(() => data.value?.items ?? [])

useHead({
  title: 'Top DJs | Imperatriz Paredões',
})
</script>
