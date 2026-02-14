<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col rounded-xl overflow-hidden bg-black/40 hover:bg-white/5 border border-transparent hover:border-border-subtle transition-colors cursor-pointer"
  >
    <!-- Imagem do DJ (quadrada, cantos arredondados) -->
    <div class="relative aspect-square w-full overflow-hidden rounded-t-xl">
      <img
        v-if="avatarUrl"
        :alt="nome"
        class="size-full object-cover"
        :src="avatarUrl"
      />
      <div
        v-else
        class="size-full bg-surface-dark flex items-center justify-center text-4xl font-bold text-primary"
      >
        {{ nome.charAt(0).toUpperCase() }}
      </div>

      <!-- Badge de posição (#1, #2, #3) - canto superior esquerdo -->
      <div
        v-if="rank && rank >= 1 && rank <= 3"
        class="absolute top-2 left-2 z-10 flex size-8 items-center justify-center rounded-full text-sm font-bold shadow-md"
        :class="rankBadgeClass"
      >
        {{ rank }}
      </div>

      <!-- Ícone de música - canto superior direito -->
      <div
        class="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-[#eab308] text-black shadow-md"
        aria-hidden
      >
        <span class="material-symbols-outlined text-[18px]">music_note</span>
      </div>
    </div>

    <!-- Nome e estatísticas -->
    <div class="flex flex-1 flex-col gap-2 p-3">
      <h4 class="font-bold text-white truncate text-base leading-tight">
        {{ nome }}
      </h4>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-green">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">album</span>
          <span class="text-white">{{ cdCount }} CDs</span>
        </span>
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">play_arrow</span>
          <span class="text-white">{{ formattedPlays }}</span>
        </span>
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">download</span>
          <span class="text-white">{{ formattedDownloads }}</span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCompactNumber } from '~/utils/formatCompactNumber'

const props = withDefaults(
  defineProps<{
    id: string
    nome: string
    avatarUrl?: string | null
    cdCount: number
    playsCount: number
    downloadsCount: number
    to?: string
    /** Posição no ranking (1 = primeiro). Exibe badge apenas para 1, 2 e 3. */
    rank?: number
  }>(),
  { to: '#' }
)

const formattedPlays = computed(() => formatCompactNumber(props.playsCount))
const formattedDownloads = computed(() => formatCompactNumber(props.downloadsCount))

const rankBadgeClass = computed(() => {
  if (!props.rank || props.rank < 1 || props.rank > 3) return ''
  switch (props.rank) {
    case 1:
      return 'bg-[#eab308] text-[#0a0a0a]'
    case 2:
      return 'bg-white text-[#0a0a0a]'
    case 3:
      return 'bg-blue-500 text-white'
    default:
      return ''
  }
})
</script>
