<template>
  <NuxtLink :to="`/cd/${id}`" class="flex flex-col gap-2 group cursor-pointer">
    <div class="relative overflow-hidden rounded-xl aspect-square">
      <img
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        :alt="`Capa: ${title}`"
        :src="coverUrl"
      />
      <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      <span
        v-if="isNew"
        class="absolute top-2 right-2 bg-accent-purple-bright text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"
      >
        NOVO!
      </span>
    </div>
    <div>
      <h5 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
        {{ title }}
      </h5>
      <p class="text-xs text-muted-secondary">{{ date }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  id: string | number
  title: string
  date: string
  coverUrl: string
  isNew?: boolean
}>()
</script>
