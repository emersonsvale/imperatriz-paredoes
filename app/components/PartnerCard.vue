<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    rel="noopener noreferrer"
    class="bg-black/40 hover:bg-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center group transition-colors border border-transparent hover:border-border-subtle"
    :class="href ? 'cursor-pointer' : ''"
  >
    <div class="shrink-0 size-16 rounded-xl overflow-hidden border-2 border-primary/30 bg-surface-dark flex items-center justify-center">
      <img
        v-if="logoUrl"
        :alt="nome"
        class="size-full object-contain p-1"
        :src="logoUrl"
      />
      <span
        v-else
        class="text-2xl font-bold text-primary"
      >
        {{ nome.charAt(0).toUpperCase() }}
      </span>
    </div>
    <div class="flex-1 min-w-0 text-center sm:text-left">
      <h4 class="font-bold text-white truncate">
        {{ nome }}
      </h4>
    </div>
    <span
      v-if="href"
      class="shrink-0 bg-surface text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity inline-flex"
    >
      <BaseIcon name="arrow_forward" />
    </span>
  </component>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

withDefaults(
  defineProps<{
    id: string
    nome: string
    logoUrl?: string | null
    href?: string | null
  }>(),
  { logoUrl: null, href: null }
)
</script>
