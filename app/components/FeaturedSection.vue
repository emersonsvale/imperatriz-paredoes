<template>
  <section
    :id="sectionId"
    class="rounded-3xl bg-gradient-to-br from-card-dark to-background-page border border-border-subtle p-6 md:p-8 relative overflow-hidden"
  >
    <!-- Decorative Blur -->
    <div
      class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px]"
      :class="blurColor"
    />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 relative z-10">
      <div>
        <h3 class="text-2xl font-bold text-white mb-1">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-muted text-sm">
          {{ subtitle }}
        </p>
      </div>
      <NuxtLink
        v-if="actionText && actionTo"
        :to="actionTo"
        class="hidden md:flex items-center gap-2 text-primary font-bold hover:text-white transition-colors"
      >
        {{ actionText }}
        <BaseIcon name="arrow_forward" />
      </NuxtLink>
    </div>

    <!-- Content Slot -->
    <div class="relative z-10">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    actionText?: string
    actionTo?: string
    blurColor?: string
    /** Id do elemento section (para âncoras) */
    id?: string
  }>(),
  {
    subtitle: undefined,
    actionText: undefined,
    actionTo: undefined,
    blurColor: 'bg-accent-purple/20',
    id: 'featured-section',
  }
)
const sectionId = computed(() => props.id ?? 'featured-section')
</script>
