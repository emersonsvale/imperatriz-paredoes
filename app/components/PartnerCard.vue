<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    rel="noopener noreferrer"
    class="group flex flex-col rounded-xl overflow-hidden bg-black/40 hover:bg-white/5 border border-transparent hover:border-border-subtle transition-colors"
    :class="href ? 'cursor-pointer' : ''"
  >
    <!-- Área da logo (mesma proporção do TopDjCard) -->
    <div class="relative aspect-square w-full overflow-hidden rounded-t-xl bg-surface-dark flex items-center justify-center">
      <img
        v-if="logoUrl"
        :alt="nome"
        class="size-full object-contain p-4"
        :src="logoUrl"
      />
      <span
        v-else
        class="text-4xl font-bold text-primary"
      >
        {{ nome.charAt(0).toUpperCase() }}
      </span>
    </div>
    <!-- Nome -->
    <div class="flex flex-1 flex-col gap-2 p-3">
      <h4 class="font-bold text-white truncate text-base leading-tight">
        {{ nome }}
      </h4>
    </div>
  </component>
</template>

<script setup lang="ts">
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
