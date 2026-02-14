<template>
  <div class="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="whitespace-nowrap px-6 py-2 rounded-full text-sm transition-all hover:scale-105"
      :class="
        modelValue === tab.id
          ? 'bg-primary text-white font-bold hover:bg-primary-hover'
          : 'bg-card-dark hover:bg-card-hover border border-border-subtle text-muted hover:text-white font-medium'
      "
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface CategoryTab {
  id: string
  label: string
}

defineProps<{
  tabs: CategoryTab[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
