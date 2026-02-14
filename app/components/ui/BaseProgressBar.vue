<template>
  <div class="w-full">
    <div v-if="label || showValue" class="flex justify-between items-center mb-2">
      <span v-if="label" class="text-sm font-medium text-text-secondary">{{ label }}</span>
      <span v-if="showValue" class="text-sm font-bold text-primary">{{ clampedValue }}%</span>
    </div>
    <div
      class="w-full rounded-full overflow-hidden relative"
      :class="trackClass"
    >
      <div
        class="absolute top-0 left-0 h-full rounded-full transition-[width] duration-300"
        :class="barClass"
        :style="{ width: `${clampedValue}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type ProgressVariant = 'primary' | 'white' | 'neon'

const props = withDefaults(
  defineProps<{
    value: number
    variant?: ProgressVariant
    size?: 'sm' | 'md'
    label?: string
    showValue?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    label: undefined,
    showValue: false,
  }
)

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))

const trackClass = computed(() => ({
  sm: 'h-1.5 bg-background-dark',
  md: 'h-2 bg-black',
}[props.size]))

const barClass = computed(() => ({
  primary: 'bg-primary',
  white: 'bg-white',
  neon: 'bg-primary shadow-neon',
}[props.variant]))
</script>
