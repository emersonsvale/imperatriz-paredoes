<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">
        Faixas
      </h2>
      <div class="text-sm text-muted-green">
        Total: {{ tracks.length }} músicas
      </div>
    </div>

    <div
      class="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-dark/50"
    >
      <!-- Table Header -->
      <div
        class="grid grid-cols-[auto_1fr_auto] gap-4 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-green md:grid-cols-[48px_1fr_120px_80px_60px]"
      >
        <div class="text-center">#</div>
        <div class="pl-2">Título</div>
        <div class="hidden text-right md:block">Artista</div>
        <div class="hidden text-right md:block">Duração</div>
        <div class="text-center">Ações</div>
      </div>

      <!-- Track Rows -->
      <div class="flex flex-col divide-y divide-white/5">
        <div
          v-for="(track, index) in visibleTracks"
          :key="track.id"
          class="group grid grid-cols-[auto_1fr_auto] cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5 md:grid-cols-[48px_1fr_120px_80px_60px]"
          :class="{ 'bg-white/5': isTrackActive(track) }"
          @click="onTrackClick(track)"
        >
          <div class="flex w-full items-center justify-center">
            <template v-if="isTrackActive(track)">
              <span class="material-symbols-outlined text-[20px] animate-pulse text-primary">
                equalizer
              </span>
            </template>
            <template v-else>
              <span class="text-sm font-medium text-white/50 group-hover:hidden">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="material-symbols-outlined hidden text-[24px] text-white group-hover:block">
                play_arrow
              </span>
            </template>
          </div>
          <div class="min-w-0 pl-2">
            <p
              class="truncate font-medium"
              :class="isTrackActive(track) ? 'text-primary font-bold' : 'text-white'"
            >
              {{ track.title }}
            </p>
            <p class="truncate text-xs text-white/40 md:hidden">
              {{ track.artist }}
            </p>
          </div>
          <div class="hidden truncate text-right text-sm text-white/60 md:block">
            {{ track.artist }}
          </div>
          <div class="hidden text-right text-sm text-white/60 md:block">
            {{ track.duration }}
          </div>
          <div
            class="flex items-center justify-center gap-3"
            :class="isTrackActive(track) ? '' : 'opacity-0 transition-opacity group-hover:opacity-100'"
          >
            <button
              type="button"
              class="text-white/40 transition-colors hover:text-white"
              title="Adicionar à Playlist"
              @click.stop
            >
              <span class="material-symbols-outlined text-[20px]">playlist_add</span>
            </button>
            <a
              v-if="cdId && track.audioUrl"
              :href="`/api/cds/${cdId}/faixa/${track.id}/download`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/40 transition-colors hover:text-primary"
              title="Baixar Faixa"
              @click.stop
            >
              <span class="material-symbols-outlined text-[20px]">download</span>
            </a>
            <span
              v-else
              class="cursor-not-allowed text-white/20"
              title="Download indisponível"
            >
              <span class="material-symbols-outlined text-[20px]">download</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="hasMoreTracks"
      type="button"
      class="mt-4 w-full rounded-xl border border-dashed border-white/10 py-3 text-sm font-semibold text-muted-green transition-colors hover:bg-white/5 hover:text-white"
      @click="showAll = true"
    >
      Mostrar mais {{ tracks.length - initialVisible }} faixas
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Track } from '~~/shared/types/Cd'

const props = withDefaults(
  defineProps<{
    tracks: Track[]
    initialVisible?: number
    /** URL da capa do álbum (para o player) */
    albumCoverUrl?: string
    /** ID do CD (necessário para download de faixa) */
    cdId?: string
  }>(),
  { initialVisible: 6, albumCoverUrl: '', cdId: '' },
)

const player = useGlobalPlayer()
const showAll = ref(false)

const visibleTracks = computed(() => {
  if (props.tracks.length <= props.initialVisible || showAll.value) {
    return props.tracks
  }
  return props.tracks.slice(0, props.initialVisible)
})

const hasMoreTracks = computed(
  () => props.tracks.length > props.initialVisible && !showAll.value,
)

function isTrackActive(track: Track): boolean {
  const current = player.currentTrack.value
  if (!current) return false
  return current.audioUrl === track.audioUrl || (current.title === track.title && current.artist === track.artist)
}

function onTrackClick(track: Track) {
  if (!track.audioUrl) return
  const list = props.tracks.map((t) => ({
    title: t.title,
    artist: t.artist,
    duration: t.duration,
    albumArt: props.albumCoverUrl,
    audioUrl: t.audioUrl,
    cdId: props.cdId,
    faixaId: t.id,
  })).filter((t) => t.audioUrl)
  const index = props.tracks.findIndex((t) => t.audioUrl === track.audioUrl)
  player.playTrack(
    {
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      albumArt: props.albumCoverUrl,
      audioUrl: track.audioUrl,
      cdId: props.cdId,
      faixaId: track.id,
    },
    { trackList: list, currentIndex: index >= 0 ? index : 0 }
  )
}
</script>
