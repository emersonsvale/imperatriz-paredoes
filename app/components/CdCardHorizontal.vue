<template>
  <NuxtLink
    :to="`/cd/${id}`"
    class="bg-black/40 hover:bg-white/5 p-3 rounded-xl flex gap-4 items-center group transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
  >
    <img
      :alt="`Capa: ${title}`"
      class="size-20 rounded-lg object-cover shadow-lg"
      :src="coverUrl"
    />
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-white truncate">{{ title }}</h4>
      <p class="text-muted text-xs mb-2">{{ subtitle }}</p>
      <div v-if="badge" class="flex items-center gap-2">
        <BaseBadge :label="badge" variant="primary" size="sm" />
      </div>
    </div>
    <span class="bg-surface text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity inline-flex">
      <BaseIcon name="play_arrow" />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'

defineProps<{
  id: string | number
  title: string
  subtitle: string
  coverUrl: string
  badge?: string
}>()
</script>
