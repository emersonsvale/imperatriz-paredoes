<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <BaseIcon v-if="iconLeft" :name="iconLeft" :size="iconSize" />
    <slot />
    <BaseIcon v-if="iconRight" :name="iconRight" :size="iconSize" />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <BaseIcon v-if="iconLeft" :name="iconLeft" :size="iconSize" />
    <slot />
    <BaseIcon v-if="iconRight" :name="iconRight" :size="iconSize" />
  </button>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

type ButtonVariant = 'primary' | 'primary-light' | 'secondary' | 'ghost' | 'outline' | 'surface'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    rounded?: 'default' | 'full'
    to?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    fullWidth?: boolean
    iconLeft?: string
    iconRight?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    rounded: 'default',
    to: undefined,
    type: 'button',
    disabled: false,
    fullWidth: false,
    iconLeft: undefined,
    iconRight: undefined,
  }
)

const variantMap: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-background-dark hover:shadow-primary-glow',
  'primary-light': 'bg-primary hover:bg-primary-hover text-white hover:shadow-primary-glow',
  secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10',
  ghost: 'text-muted hover:text-white hover:bg-white/5',
  outline: 'border border-white/20 text-white hover:bg-white/5',
  surface: 'bg-surface hover:bg-surface-hover text-white',
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-base px-8 py-3.5',
  'icon-sm': 'size-8',
  'icon-md': 'size-10',
  'icon-lg': 'size-12',
}

const iconSizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg' | 'xl'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  'icon-sm': 'md',
  'icon-md': 'lg',
  'icon-lg': 'xl',
}

const iconSize = computed(() => iconSizeMap[props.size])

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 font-bold transition-all',
  variantMap[props.variant],
  sizeMap[props.size],
  props.rounded === 'full' ? 'rounded-full' : 'rounded-xl',
  props.fullWidth ? 'w-full' : '',
  props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
])
</script>
