/**
 * Player global: estado da faixa em reprodução e controle de áudio.
 * Um único elemento <audio> é compartilhado em todo o app (variável no módulo).
 */
import type { NowPlayingTrack } from '~~/shared/types/Cd'

/** Único elemento de áudio compartilhado por todas as chamadas do composable */
let sharedAudio: HTMLAudioElement | null = null

export interface PlayTrackOptions {
  trackList?: NowPlayingTrack[]
  currentIndex?: number
}

export function useGlobalPlayer() {
  const currentTrack = useState<NowPlayingTrack | null>('global-player-track', () => null)
  const isPlaying = useState('global-player-playing', () => false)
  const currentTime = useState('global-player-current-time', () => 0)
  const duration = useState('global-player-duration', () => 0)
  const volume = useState('global-player-volume', () => 70)
  const trackList = useState<NowPlayingTrack[]>('global-player-track-list', () => [])
  const currentIndex = useState('global-player-current-index', () => 0)
  const repeatMode = useState('global-player-repeat', () => false)
  const shuffleMode = useState('global-player-shuffle', () => false)

  function getAudio(): HTMLAudioElement | null {
    if (import.meta.server) return null
    if (!sharedAudio) {
      sharedAudio = new Audio()
      sharedAudio.addEventListener('loadedmetadata', () => {
        if (sharedAudio) duration.value = Math.floor(sharedAudio.duration)
      })
      sharedAudio.addEventListener('timeupdate', () => {
        if (sharedAudio) currentTime.value = Math.floor(sharedAudio.currentTime)
      })
      sharedAudio.addEventListener('ended', onAudioEnded)
    }
    return sharedAudio
  }

  function onAudioEnded() {
    isPlaying.value = false
    currentTime.value = duration.value
    if (repeatMode.value && currentTrack.value) {
      const audio = getAudio()
      if (audio) audio.play().then(() => { isPlaying.value = true }).catch(() => {})
      return
    }
    next()
  }

  function setTrack(track: NowPlayingTrack | null) {
    const audio = getAudio()
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    currentTrack.value = track
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    if (!track) return
    if (track.audioUrl && audio) {
      audio.src = track.audioUrl
      audio.load()
    }
  }

  function playTrack(track: NowPlayingTrack, options?: PlayTrackOptions) {
    const list = options?.trackList ?? [track]
    const idx = options?.currentIndex ?? list.findIndex((t) => t.audioUrl === track.audioUrl)
    trackList.value = list
    currentIndex.value = idx >= 0 ? idx : 0
    setTrack(track)
    const audio = getAudio()
    if (track.audioUrl && audio) {
      audio.volume = (volume.value ?? 70) / 100
      audio.play().then(() => {
        isPlaying.value = true
        if (import.meta.client && track.cdId && track.faixaId) {
          $fetch(`/api/cds/${track.cdId}/faixa/${track.faixaId}/play`, { method: 'POST' }).catch(() => {})
        }
      }).catch(() => {})
    }
  }

  function playIndex(index: number) {
    const list = trackList.value
    if (index < 0 || index >= list.length) return
    const track = list[index]
    currentIndex.value = index
    const audio = getAudio()
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    currentTrack.value = track
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    if (track.audioUrl && audio) {
      audio.volume = (volume.value ?? 70) / 100
      audio.src = track.audioUrl
      audio.load()
      audio.play().then(() => {
        isPlaying.value = true
        if (import.meta.client && track.cdId && track.faixaId) {
          $fetch(`/api/cds/${track.cdId}/faixa/${track.faixaId}/play`, { method: 'POST' }).catch(() => {})
        }
      }).catch(() => {})
    }
  }

  function next() {
    const list = trackList.value
    if (list.length <= 1) return
    let nextIdx = currentIndex.value + 1
    if (shuffleMode.value) {
      nextIdx = Math.floor(Math.random() * list.length)
    }
    if (nextIdx >= list.length) nextIdx = 0
    playIndex(nextIdx)
  }

  function previous() {
    const list = trackList.value
    const audio = getAudio()
    if (currentTime.value > 3 && audio) {
      audio.currentTime = 0
      currentTime.value = 0
      return
    }
    if (list.length <= 1) return
    let prevIdx = currentIndex.value - 1
    if (prevIdx < 0) prevIdx = list.length - 1
    playIndex(prevIdx)
  }

  function playPause() {
    if (!currentTrack.value) return
    const audio = getAudio()
    if (!audio) return
    if (isPlaying.value) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    isPlaying.value = !isPlaying.value
  }

  function seek(fraction: number) {
    const audio = getAudio()
    if (!audio || !currentTrack.value) return
    const sec = fraction * (duration.value || 1)
    audio.currentTime = Math.max(0, sec)
    currentTime.value = Math.floor(audio.currentTime)
  }

  function setVolume(value: number) {
    const v = Math.max(0, Math.min(100, value))
    volume.value = v
    const audio = getAudio()
    if (audio) audio.volume = v / 100
  }

  function toggleRepeat() {
    repeatMode.value = !repeatMode.value
  }

  function toggleShuffle() {
    shuffleMode.value = !shuffleMode.value
  }

  /** Para a reprodução e fecha o player (limpa a faixa atual). */
  function close() {
    setTrack(null)
    trackList.value = []
    currentIndex.value = 0
  }

  return {
    currentTrack: readonly(currentTrack),
    isPlaying: readonly(isPlaying),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    volume: readonly(volume),
    repeatMode: readonly(repeatMode),
    shuffleMode: readonly(shuffleMode),
    setTrack,
    playTrack,
    playPause,
    next,
    previous,
    seek,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    close,
  }
}
