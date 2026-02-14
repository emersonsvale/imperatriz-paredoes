<template>
  <div
    id="stat-card"
    class="bg-card-dark border border-border-dark rounded-xl p-5 flex items-start justify-between hover:border-primary/50 transition-colors group"
  >
    <div>
      <p class="text-text-secondary text-sm mb-1">
        {{ label }}
      </p>
      <h3 class="text-2xl font-black text-white group-hover:text-primary transition-colors">
        {{ value }}
      </h3>
      <p
        v-if="subtitle"
        class="text-xs mt-1 flex items-center gap-1"
        :class="subtitleColor"
      >
        <BaseIcon v-if="subtitleIcon" :name="subtitleIcon" size="xs" />
        {{ subtitle }}
      </p>
    </div>
    <div v-if="icon" class="p-2 bg-white/5 rounded-lg text-primary">
      <BaseIcon :name="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    subtitle?: string
    subtitleIcon?: string
    subtitleColor?: string
    icon?: string
  }>(),
  {
    subtitle: undefined,
    subtitleIcon: undefined,
    subtitleColor: 'text-text-secondary',
    icon: undefined,
  }
)
</script>
