<template>
  <NuxtLink
    :to="`/cd/${id}`"
    class="group relative bg-card-dark rounded-2xl p-3 hover:bg-card-hover transition-all hover:-translate-y-1 duration-300 block"
  >
    <!-- Rank Badge -->
    <div
      v-if="rank"
      class="absolute top-0 left-0 z-10 bg-white text-[#0a0a0a] text-xs font-bold px-3 py-1 rounded-br-lg rounded-tl-lg shadow-lg"
    >
      #{{ rank }}
    </div>

    <!-- Cover Image -->
    <div class="relative aspect-square rounded-xl overflow-hidden mb-3">
      <img
        :alt="`Capa: ${title}`"
        class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        :src="coverUrl"
      />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        <span class="bg-primary text-black p-3 rounded-full group-hover:scale-110 transition-transform inline-flex">
          <BaseIcon name="play_arrow" />
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="px-1">
      <h4 class="font-bold text-white truncate text-base">{{ title }}</h4>
      <p class="text-muted text-xs truncate mb-2">{{ artist }}</p>
      <span class="w-full flex items-center justify-center gap-1 bg-surface hover:bg-surface-hover text-white text-xs font-bold py-2 rounded-lg transition-colors group-hover:bg-primary group-hover:text-white inline-flex">
        <BaseIcon name="download" size="sm" />
        Baixar{{ downloadSize ? ` (${downloadSize})` : '' }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

defineProps<{
  id: string | number
  title: string
  artist: string
  coverUrl: string
  downloadSize?: string
  rank?: number
}>()
</script>
