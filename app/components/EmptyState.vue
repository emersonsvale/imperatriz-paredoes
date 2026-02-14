<template>
  <div
    id="empty-state"
    class="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-surface-dark/50 py-16 px-6 text-center"
  >
    <BaseIcon v-if="icon" :name="icon" size="3xl" class="mb-4 text-muted-green" />
    <h2 class="text-xl font-bold text-white mb-2">
      {{ title }}
    </h2>
    <p v-if="description" class="text-muted-green text-sm mb-6 max-w-sm">
      {{ description }}
    </p>
    <BaseButton
      v-if="actionLabel"
      :to="actionTo"
      variant="primary"
      :icon-left="actionIcon"
      size="md"
    >
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
    actionLabel?: string
    actionTo?: string
    actionIcon?: string
  }>(),
  {
    icon: undefined,
    description: undefined,
    actionLabel: undefined,
    actionTo: undefined,
    actionIcon: undefined,
  }
)
</script>
