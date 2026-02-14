<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="flex-1 px-4 md:px-10 py-6 max-w-[1600px] mx-auto w-full">
      <section>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <BaseIcon name="handshake" class="text-primary" />
              Nossos Parceiros
            </h1>
            <p class="text-muted text-sm mt-1">
              Marcas e parceiros que apoiam o som automotivo.
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

        <div v-if="parceiros.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <PartnerCard
            v-for="p in parceiros"
            :key="p.id"
            :id="p.id"
            :nome="p.nome"
            :logo-url="p.logoUrl"
            :href="p.href"
          />
        </div>
        <p v-else class="text-center py-12 text-text-secondary">
          Em breve, nossos parceiros serão divulgados aqui.
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
import PartnerCard from '~/components/PartnerCard.vue'

interface ParceiroItem {
  id: string
  nome: string
  logoUrl?: string | null
  href?: string | null
}

const { data } = await useFetch<ParceiroItem[]>('/api/parceiros', {
  key: 'parceiros-all',
  default: () => [],
})

const parceiros = computed(() => data.value ?? [])

useHead({
  title: 'Nossos Parceiros | Imperatriz Paredões',
})
</script>
