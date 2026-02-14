<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-text-secondary mb-1.5"
    >
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        class="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        :class="error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
        <BaseIcon name="expand_more" size="lg" />
      </div>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

export interface SelectOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    options: SelectOption[]
    disabled?: boolean
    error?: string
    id?: string
  }>(),
  {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    disabled: false,
    error: undefined,
    id: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const selectId = computed(() => props.id ?? generatedId)

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
