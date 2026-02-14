<template>
  <NuxtLink
    :to="to"
    class="bg-black/40 hover:bg-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center group transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
  >
    <div class="shrink-0 size-16 rounded-full overflow-hidden border-2 border-primary/30">
      <img
        v-if="avatarUrl"
        :alt="nome"
        class="size-full object-cover"
        :src="avatarUrl"
      />
      <div
        v-else
        class="size-full bg-surface-dark flex items-center justify-center text-2xl font-bold text-primary"
      >
        {{ nome.charAt(0).toUpperCase() }}
      </div>
    </div>
    <div class="flex-1 min-w-0 text-center sm:text-left">
      <h4 class="font-bold text-white truncate">
        {{ nome }}
      </h4>
      <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-muted-green">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">album</span>
          <strong class="text-white">{{ cdCount }}</strong> CDs
        </span>
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">equalizer</span>
          <strong class="text-white">{{ playsCount }}</strong> plays
        </span>
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">download</span>
          <strong class="text-white">{{ downloadsCount }}</strong> downloads
        </span>
      </div>
    </div>
    <span class="shrink-0 bg-surface text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity inline-flex">
      <BaseIcon name="arrow_forward" />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

withDefaults(
  defineProps<{
    id: string
    nome: string
    avatarUrl?: string | null
    cdCount: number
    playsCount: number
    downloadsCount: number
    to?: string
  }>(),
  { to: '#' }
)
</script>
