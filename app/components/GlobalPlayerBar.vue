<template>
  <div
    id="global-player-bar"
    class="fixed bottom-0 left-0 right-0 h-24 bg-background-player/80 backdrop-blur-xl border-t border-border-subtle z-50 flex items-center px-4 md:px-8 shadow-player-bar"
  >
    <!-- Track info (clique leva à página do CD) -->
    <div
      class="flex items-center gap-4 w-1/4 min-w-0"
      :class="{ 'cursor-pointer hover:opacity-90': currentTrack?.cdId }"
      role="link"
      :aria-label="currentTrack?.cdId ? `Ir para o CD: ${currentTrack.title}` : undefined"
      @click="goToCd"
    >
      <div class="size-14 rounded-lg overflow-hidden shrink-0 relative group">
        <img
          :alt="currentTrack ? `Capa: ${currentTrack.title}` : 'Capa da faixa'"
          class="h-full w-full object-cover"
          :src="currentTrack?.albumArt ?? placeholderCover"
        />
        <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
          <span class="material-symbols-outlined text-white text-xl">expand_less</span>
        </div>
      </div>
      <div class="hidden sm:block overflow-hidden min-w-0">
        <h4 class="text-sm font-bold text-white truncate">{{ currentTrack?.title ?? '—' }}</h4>
        <p class="text-xs text-muted-secondary truncate">{{ currentTrack?.artist ?? '—' }}</p>
      </div>
      <button
        type="button"
        class="text-muted hover:text-white sm:hidden shrink-0"
        aria-label="Favoritar"
        @click.stop
      >
        <span class="material-symbols-outlined">favorite_border</span>
      </button>
    </div>

    <!-- Controls & progress -->
    <div class="flex-1 flex flex-col items-center max-w-2xl mx-auto px-4">
      <div class="flex items-center gap-6 mb-2">
        <button
          type="button"
          class="transition-colors"
          :class="shuffleMode ? 'text-primary' : 'text-muted hover:text-white'"
          aria-label="Ordem aleatória"
          @click="emit('shuffle')"
        >
          <span class="material-symbols-outlined text-xl">shuffle</span>
        </button>
        <button
          type="button"
          class="text-white/90 hover:text-white transition-colors"
          aria-label="Anterior"
          @click="emit('previous')"
        >
          <span class="material-symbols-outlined text-2xl">skip_previous</span>
        </button>
        <button
          type="button"
          class="size-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary-hover hover:scale-105 transition-all shadow-primary-glow-sm"
          :aria-label="isPlaying ? 'Pausar' : 'Reproduzir'"
          @click="emit('play-pause')"
        >
          <span class="material-symbols-outlined text-2xl fill-white text-white">
            {{ isPlaying ? 'pause' : 'play_arrow' }}
          </span>
        </button>
        <button
          type="button"
          class="text-white/90 hover:text-white transition-colors"
          aria-label="Próxima"
          @click="emit('next')"
        >
          <span class="material-symbols-outlined text-2xl">skip_next</span>
        </button>
        <button
          type="button"
          class="transition-colors"
          :class="repeatMode ? 'text-primary' : 'text-muted hover:text-white'"
          :aria-label="repeatMode ? 'Desativar repetição' : 'Repetir'"
          @click="emit('repeat')"
        >
          <span class="material-symbols-outlined text-xl">repeat</span>
        </button>
      </div>
      <div class="w-full flex items-center gap-3 text-xs text-muted font-mono">
        <span>{{ currentTimeFormatted }}</span>
        <div
          class="flex-1 h-1.5 bg-white/15 rounded-full relative group cursor-pointer"
          @click="onProgressClick"
        >
          <div
            class="absolute top-0 left-0 h-full rounded-full relative transition-[width]"
            :class="progressPercent === 0 ? 'bg-white/50' : 'bg-white'"
            :style="{ width: `${progressPercent}%` }"
          >
            <div class="absolute -right-1.5 -top-1 size-3.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span>{{ durationFormatted }}</span>
      </div>
    </div>

    <!-- Volume & extra -->
    <div class="w-1/4 flex items-center justify-end gap-4">
      <button
        type="button"
        class="text-muted hover:text-white shrink-0"
        title="Fechar player e parar"
        aria-label="Fechar player"
        @click="emit('close')"
      >
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
      <button
        type="button"
        class="text-muted hover:text-white hidden lg:block"
        title="Letra"
        aria-label="Letra"
        @click="emit('lyrics-click')"
      >
        <span class="material-symbols-outlined text-xl">mic</span>
      </button>
      <div class="flex items-center gap-2 group">
        <button
          type="button"
          class="text-muted hover:text-white shrink-0"
          aria-label="Volume"
          @click.prevent
        >
          <span class="material-symbols-outlined text-xl">volume_up</span>
        </button>
        <div
          class="w-24 min-w-[6rem] h-2 bg-surface rounded-full cursor-pointer relative flex items-center"
          role="slider"
          aria-label="Volume"
          tabindex="0"
          @click="onVolumeClick"
        >
          <div
            class="absolute inset-0 h-full rounded-full transition-colors group-hover:bg-white/10 pointer-events-none"
          />
          <div
            class="h-full rounded-full transition-colors pointer-events-none absolute left-0 top-0 bottom-0"
            :style="{ width: `${volumePercent}%` }"
            :class="volumePercent > 0 ? 'bg-white' : 'bg-white/50'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NowPlayingTrack } from '~~/shared/types/Cd'

const props = withDefaults(
  defineProps<{
    currentTrack: NowPlayingTrack | null
    currentTime?: number
    duration?: number
    isPlaying?: boolean
    repeatMode?: boolean
    shuffleMode?: boolean
    volume?: number
  }>(),
  {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    repeatMode: false,
    shuffleMode: false,
    volume: 70,
  }
)

const emit = defineEmits<{
  'play-pause': []
  'previous': []
  'next': []
  'shuffle': []
  'repeat': []
  'close': []
  'progress-seek': [fraction: number]
  'volume-change': [percent: number]
  'volume-click': []
  'lyrics-click': []
}>()

const placeholderCover =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7UEIl1j0HKu85pM8C7qO4w66L_Px7-PMowRNs6KUJXUvVh4jzEp7paUq3Mdp1STPkSlf8pO3GTtJ4B0O4_CM6dqCLcMephC-IM33cLRAbP-l3WVp057xwSiQsAEXKHelOe0Fpfj94VRLKnSxPt3s7TvwJRbSNbzOTAf8PMBGbLG43wvhKEDCWOqxN7GFuH7z83v3i-VrSEXQ5yLqYJZsQO1Ji10VejsTq4cQIiD9BoUzPHx4Gthh4ehPenv-6iuu_5GfpekWr5Rs'

const progressPercent = computed(() => {
  const dur = props.duration || 1
  if (dur <= 0) return 0
  return Math.round((props.currentTime / dur) * 100)
})

const volumePercent = computed(() => Math.min(100, Math.max(0, props.volume ?? 0)))

const currentTimeFormatted = computed(() => formatSeconds(props.currentTime))
const durationFormatted = computed(() => {
  if (props.currentTrack?.duration) return props.currentTrack.duration
  return formatSeconds(props.duration)
})

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function onProgressClick(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  emit('progress-seek', fraction)
}

function onVolumeClick(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  emit('volume-change', Math.round(fraction * 100))
}

function goToCd() {
  if (props.currentTrack?.cdId) {
    navigateTo(`/cd/${props.currentTrack.cdId}`)
  }
}
</script>
