<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      :for="textareaId"
      class="block text-sm font-medium text-text-secondary mb-1.5"
    >
      {{ label }}
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-gray-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      :class="error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''"
      @input="onInput"
    />
    <p v-if="error" class="mt-1 text-xs text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    error?: string
    id?: string
  }>(),
  {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    rows: 3,
    disabled: false,
    error: undefined,
    id: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const textareaId = computed(() => props.id ?? generatedId)

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
