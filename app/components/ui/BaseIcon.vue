<template>
  <span
    class="material-symbols-outlined select-none leading-none inline-flex items-center justify-center"
    :class="[sizeMap[size], filled ? 'filled-icon' : '']"
    aria-hidden="true"
  >{{ name }}</span>
</template>

<script setup lang="ts">
const sizeMap: Record<string, string> = {
  xs: 'text-[14px]',
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[28px]',
  '2xl': 'text-[36px]',
  '3xl': 'text-[48px]',
}

withDefaults(
  defineProps<{
    name: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    filled?: boolean
  }>(),
  {
    size: 'lg',
    filled: false,
  }
)
</script>

<style scoped>
.filled-icon {
  font-variation-settings: 'FILL' 1;
}
</style>
