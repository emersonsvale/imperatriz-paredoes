<template>
  <div class="flex flex-col gap-6">
    <!-- Album Art -->
    <div
      class="group relative aspect-square w-full overflow-hidden rounded-xl shadow-2xl shadow-primary/10"
    >
      <div
        class="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      />
      <img
        :alt="`Capa do CD ${album.title}`"
        class="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        :src="album.coverUrl"
      />
      <div
        class="absolute bottom-4 left-4 z-20 flex gap-2"
      >
        <span
          v-for="tag in album.tags"
          :key="tag"
          class="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold uppercase text-white backdrop-blur-md"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Metadata -->
    <div class="flex flex-col gap-2">
      <h1 class="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
        {{ album.title }}
        <br />
        <span class="text-primary">{{ album.subtitle }}</span>
      </h1>
      <div class="mt-1 flex items-center gap-2 text-sm text-muted-green">
        <span class="material-symbols-outlined text-[18px]">calendar_month</span>
        <span>{{ album.releaseDate }}</span>
        <span class="mx-1">•</span>
        <span class="material-symbols-outlined text-[18px]">queue_music</span>
        <span>{{ album.trackCount }} Faixas</span>
        <span class="mx-1">•</span>
        <span class="material-symbols-outlined text-[18px]">schedule</span>
        <span>{{ album.totalDuration }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-2 flex flex-col gap-3">
      <a
        v-if="cdId"
        :href="`/api/cds/${cdId}/download`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary px-6 text-lg font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-primary/40"
      >
        <span class="material-symbols-outlined text-[28px] fill-current">download</span>
        <span>BAIXAR CD COMPLETO (ZIP)</span>
      </a>
      <button
        v-else
        type="button"
        disabled
        class="flex h-14 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-white/10 px-6 text-lg font-bold text-white/50"
      >
        <span class="material-symbols-outlined text-[28px] fill-current">download</span>
        <span>BAIXAR CD COMPLETO (ZIP)</span>
      </button>
      <div class="flex gap-3">
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface-dark px-4 py-3 text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          :class="{ 'cursor-pointer': canPlayAll }"
          :disabled="!canPlayAll"
          title="Ouvir Tudo"
          @click="onOuvirTudo"
        >
          <span class="material-symbols-outlined text-[24px] text-primary">play_circle</span>
          <span class="font-semibold">Ouvir Tudo</span>
        </button>
        <button
          type="button"
          class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface-dark px-4 py-3 text-white transition-colors hover:bg-white/5"
        >
          <span class="material-symbols-outlined text-[24px]">favorite</span>
          <span class="font-semibold">Favoritar</span>
        </button>
        <button
          type="button"
          class="flex size-12 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-surface-dark text-white transition-colors hover:bg-white/5"
        >
          <span class="material-symbols-outlined text-[24px]">share</span>
        </button>
      </div>
    </div>

    <!-- DJ Card -->
    <div class="mt-4 rounded-xl border border-white/5 bg-surface-dark p-5">
      <div class="mb-4 flex items-center gap-4">
        <div class="size-16 overflow-hidden rounded-full border-2 border-primary">
          <img
            :alt="dj.name"
            class="size-full object-cover"
            :src="dj.avatarUrl"
          />
        </div>
        <div>
          <p class="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-green">
            Artista
          </p>
          <h3 class="cursor-pointer text-xl font-bold text-white transition-colors hover:text-primary">
            {{ dj.name }}
          </h3>
          <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            <a
              v-if="dj.instagram"
              :href="instagramHref"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/60 transition-colors hover:text-[#E1306C]"
            >
              Instagram
            </a>
            <a
              v-if="dj.facebook"
              :href="facebookHref"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/60 transition-colors hover:text-[#1877F2]"
            >
              Facebook
            </a>
            <a
              v-if="dj.twitter"
              :href="twitterHref"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/60 transition-colors hover:text-[#1DA1F2]"
            >
              X / Twitter
            </a>
            <a
              v-if="dj.whatsapp"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/60 transition-colors hover:text-[#25D366]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <p class="mb-4 text-sm leading-relaxed text-white/70">
        {{ dj.bio }}
      </p>
      <NuxtLink
        v-if="dj.id"
        :to="`/dj/${dj.id}`"
        class="block w-full rounded-lg border border-white/20 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-white/5"
      >
        Ver Perfil Completo
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlbumDetail, Track } from '~~/shared/types/Cd'
import type { ArtistProfile } from '~~/shared/types/Artist'
import { instagramUrl, facebookUrl, twitterUrl, whatsappUrl } from '~/utils/socialLinks'

const props = defineProps<{
  album: AlbumDetail
  dj: ArtistProfile
  /** ID do CD (necessário para o botão de download ZIP) */
  cdId?: string
  /** Lista de faixas (para o botão Ouvir Tudo) */
  tracks?: Track[]
}>()

const player = useGlobalPlayer()

const instagramHref = computed(() =>
  props.dj.instagram ? instagramUrl(props.dj.instagram) : ''
)
const facebookHref = computed(() =>
  props.dj.facebook ? facebookUrl(props.dj.facebook) : ''
)
const twitterHref = computed(() =>
  props.dj.twitter ? twitterUrl(props.dj.twitter) : ''
)
const whatsappHref = computed(() =>
  props.dj.whatsapp ? whatsappUrl(props.dj.whatsapp) : ''
)

const canPlayAll = computed(() => {
  if (!props.tracks?.length) return false
  return props.tracks.some((t) => t.audioUrl)
})

function onOuvirTudo() {
  if (!canPlayAll.value || !props.tracks) return
  const list = props.tracks
    .filter((t): t is Track & { audioUrl: string } => Boolean(t.audioUrl))
    .map((t) => ({
      title: t.title,
      artist: t.artist,
      duration: t.duration,
      albumArt: props.album.coverUrl,
      audioUrl: t.audioUrl,
      cdId: props.cdId,
      faixaId: t.id,
    }))
  const first = list[0]
  if (!first) return
  player.playTrack(first, { trackList: list, currentIndex: 0 })
}
</script>
