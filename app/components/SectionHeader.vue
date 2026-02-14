<template>
  <div class="flex items-center justify-between mb-6">
    <div>
      <h3 class="text-2xl font-bold flex items-center gap-2">
        <BaseIcon v-if="icon" :name="icon" :class="iconColor" />
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-muted text-sm mt-1">
        {{ subtitle }}
      </p>
    </div>
    <NuxtLink
      v-if="actionText && actionTo"
      :to="actionTo"
      class="text-sm font-semibold text-muted hover:text-primary transition-colors hidden md:flex items-center gap-1"
    >
      {{ actionText }}
      <BaseIcon v-if="actionIcon" :name="actionIcon" size="md" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: string
    iconColor?: string
    actionText?: string
    actionTo?: string
    actionIcon?: string
  }>(),
  {
    subtitle: undefined,
    icon: undefined,
    iconColor: 'text-primary',
    actionText: undefined,
    actionTo: undefined,
    actionIcon: undefined,
  }
)
</script>
