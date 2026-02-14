<template>
  <div
    class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    :class="{ 'pb-24': hasPlayerBar }"
  >
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useGlobalPlayer } from '~/composables/useGlobalPlayer'
import { computed } from 'vue'

const player = useGlobalPlayer()
const hasPlayerBar = computed(() => !!player.currentTrack.value)
</script>
