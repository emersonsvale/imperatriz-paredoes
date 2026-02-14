<template>
  <nav class="mb-8 flex flex-wrap items-center gap-2 text-sm" aria-label="Navegação">
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="text-muted-green transition-colors hover:text-white"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="font-medium text-white">{{ item.label }}</span>
      <BaseIcon
        v-if="index < items.length - 1"
        name="chevron_right"
        size="sm"
        class="text-muted-green"
      />
    </template>
  </nav>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
