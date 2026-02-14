<template>
  <span :class="classes">
    <span v-if="pulse" class="size-2 rounded-full animate-pulse" :class="dotColorMap[variant]" />
    <BaseIcon v-if="icon" :name="icon" size="xs" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

type BadgeVariant = 'primary' | 'purple' | 'purple-glow' | 'success' | 'warning' | 'white' | 'outline'

const props = withDefaults(
  defineProps<{
    label: string
    variant?: BadgeVariant
    size?: 'sm' | 'md'
    icon?: string
    pulse?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'sm',
    icon: undefined,
    pulse: false,
  }
)

const variantMap: Record<BadgeVariant, string> = {
  primary: 'bg-primary/20 text-primary border border-primary/30',
  purple: 'bg-accent-purple/15 text-accent-purple-bright border border-accent-purple/40',
  'purple-glow': 'bg-accent-purple/15 text-accent-purple-bright border border-accent-purple/40',
  success: 'bg-green-900/40 text-green-400 border border-green-900',
  warning: 'bg-yellow-900/40 text-yellow-400 border border-yellow-900',
  white: 'bg-white text-[#0a0a0a] shadow-lg border-none',
  outline: 'bg-black/60 text-white border border-white/10 backdrop-blur-md',
}

const dotColorMap: Record<BadgeVariant, string> = {
  primary: 'bg-primary',
  purple: 'bg-accent-purple',
  'purple-glow': 'bg-accent-purple',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  white: 'bg-[#0a0a0a]',
  outline: 'bg-white',
}

const sizeMap: Record<string, string> = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-3 py-1',
}

const classes = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider',
  variantMap[props.variant],
  sizeMap[props.size],
])
</script>
