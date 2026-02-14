<template>
  <div class="flex h-screen flex-col bg-background-page font-display text-white overflow-hidden selection:bg-primary selection:text-[#0a0a0a]">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <GlobalPlayerBar
      v-if="player.currentTrack.value"
      :current-track="player.currentTrack.value"
      :current-time="player.currentTime.value"
      :duration="player.duration.value"
      :is-playing="player.isPlaying.value"
      :repeat-mode="player.repeatMode.value"
      :shuffle-mode="player.shuffleMode.value"
      :volume="player.volume.value"
      @play-pause="player.playPause()"
      @previous="player.previous()"
      @next="player.next()"
      @shuffle="player.toggleShuffle()"
      @repeat="player.toggleRepeat()"
      @progress-seek="player.seek($event)"
      @volume-change="player.setVolume($event)"
      @close="player.close()"
    />
  </div>
</template>

<script setup lang="ts">
import GlobalPlayerBar from '~/components/GlobalPlayerBar.vue'
const player = useGlobalPlayer()
</script>
