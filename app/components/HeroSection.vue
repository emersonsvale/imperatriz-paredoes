<template>
  <section
    id="hero-section"
    class="relative w-full rounded-2xl overflow-hidden bg-card-dark group min-h-[300px] md:min-h-[400px] flex items-center"
  >
    <!-- Background Image + Gradient -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-r from-background-page via-background-page/85 to-transparent z-10" />
      <img
        :alt="imageAlt"
        class="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        :src="imageUrl"
      />
    </div>

    <!-- Content -->
    <div class="relative z-20 px-6 md:px-12 py-8 max-w-3xl">
      <BaseBadge
        v-if="tag"
        :label="tag"
        variant="purple-glow"
        size="md"
        :pulse="true"
        class="mb-4"
      />
      <h2 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
        {{ title }}
        <span
          v-if="titleHighlight"
          class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple"
        >
          {{ titleHighlight }}
        </span>
        {{ titleSuffix ? ` ${titleSuffix}` : '' }}
      </h2>
      <p v-if="description" class="text-muted text-lg mb-8 max-w-xl">
        {{ description }}
      </p>
      <div class="flex flex-wrap gap-4">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'

withDefaults(
  defineProps<{
    tag?: string
    title: string
    titleHighlight?: string
    titleSuffix?: string
    description?: string
    imageUrl: string
    imageAlt?: string
  }>(),
  {
    tag: undefined,
    titleHighlight: undefined,
    titleSuffix: undefined,
    description: undefined,
    imageAlt: 'Hero image',
  }
)
</script>
