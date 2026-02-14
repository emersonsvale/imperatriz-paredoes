<template>
  <section
    id="hero-section"
    class="relative w-full rounded-2xl overflow-hidden bg-card-dark group min-h-[300px] md:min-h-[400px] flex items-center"
  >
    <!-- Contador de slides (ex.: 1/8) -->
    <div
      v-if="slides.length > 1"
      class="absolute top-4 right-4 z-30 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white tabular-nums"
      aria-hidden="true"
    >
      {{ currentIndex + 1 }}/{{ slides.length }}
    </div>

    <!-- Slides container -->
    <div class="absolute inset-0">
      <template v-for="(slide, index) in slides" :key="`slide-${index}`">
        <!-- CD slide: capa à esquerda + info à direita (como no layout de referência) -->
        <div
          v-if="slide.type === 'cd'"
          v-show="currentIndex === index"
          class="absolute inset-0 flex items-stretch transition-opacity duration-500 z-0"
          :class="[
            currentIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none',
            currentIndex === index ? 'hero-cd-active' : '',
          ]"
        >
          <!-- Background: mesma capa embaçada -->
          <div class="absolute inset-0 z-0 overflow-hidden hero-cd-bg">
            <img
              v-if="slide.coverUrl"
              :alt="''"
              aria-hidden="true"
              class="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-0 hero-cd-bg-img"
              :src="slide.coverUrl"
            >
            <div class="absolute inset-0 bg-background-page/70" />
          </div>
          <!-- Coluna esquerda: capa do álbum + botão play -->
          <div class="relative z-20 flex shrink-0 items-center justify-center p-4 md:p-6 min-w-[200px] w-[40vw] max-w-[320px] md:min-w-[260px] md:max-w-[400px] hero-cd-cover">
            <NuxtLink :to="slide.listenUrl" class="relative block w-full aspect-square max-h-[280px] md:max-h-[360px] rounded-xl overflow-hidden bg-card-dark shadow-2xl group/cover transition-transform duration-500 hover:scale-[1.02]">
              <img
                v-if="slide.coverUrl"
                :alt="slide.title"
                class="h-full w-full object-cover group-hover/cover:scale-105 transition-transform duration-500"
                :src="slide.coverUrl"
              >
              <span v-else class="flex h-full w-full items-center justify-center text-white/40">
                <BaseIcon name="album" size="3xl" />
              </span>
              <span class="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover/cover:bg-black/10">
                <span class="flex size-14 md:size-20 items-center justify-center rounded-full bg-primary text-[#0a0a0a] shadow-lg ring-4 ring-white/20 transition-transform duration-300 group-hover/cover:scale-110">
                  <BaseIcon name="play_arrow" size="3xl" class="ml-0.5" />
                </span>
              </span>
            </NuxtLink>
          </div>
          <!-- Coluna direita: textos e botões com entrada em sequência -->
          <div class="relative z-10 flex flex-1 flex-col justify-center min-w-0 bg-gradient-to-r from-background-page/80 via-background-page to-background-page pl-4 md:pl-8 pr-4 md:pr-8 py-6">
            <div class="hero-cd-tags flex flex-wrap items-center gap-2 mb-3">
              <span
                v-if="slide.isNew"
                class="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-[#0a0a0a]"
              >
                <BaseIcon name="new_releases" size="sm" />
                NOVO
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white">
                <BaseIcon name="play_circle" size="sm" />
                {{ slide.playsCount }} ouvintes
              </span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white">
                <BaseIcon name="download" size="sm" />
                {{ slide.downloadsCount }} downloads
              </span>
            </div>
            <h2 class="hero-cd-title text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-1 line-clamp-3">
              {{ slide.title }}
            </h2>
            <p class="hero-cd-artist text-white/90 text-lg md:text-xl mb-3">
              {{ slide.artist }}
            </p>
            <p class="hero-cd-meta flex items-center gap-2 text-sm text-white/70 mb-6">
              <BaseIcon name="schedule" size="sm" />
              {{ slide.date }}
              <span>{{ slide.tracksCount }} faixas</span>
            </p>
            <div class="hero-cd-buttons flex flex-wrap gap-3">
              <BaseButton
                variant="primary-light"
                icon-left="play_circle"
                size="lg"
                :to="slide.listenUrl"
                class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                OUVIR AGORA
              </BaseButton>
              <BaseButton
                variant="secondary"
                icon-left="download"
                size="lg"
                :to="slide.downloadUrl"
                class="transition-all duration-300 hover:scale-105"
              >
                Baixar
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Content slide (DJ ou conteúdo genérico) -->
        <div
          v-if="slide.type === 'content'"
          v-show="currentIndex === index"
          class="absolute inset-0 flex items-center transition-opacity duration-500 z-0"
          :class="currentIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-r from-background-page via-background-page/85 to-transparent z-10" />
            <img
              :alt="slide.imageAlt ?? ''"
              class="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              :src="slide.imageUrl"
            />
          </div>
          <div class="relative z-20 px-6 md:px-12 py-8 max-w-3xl">
            <BaseBadge
              v-if="slide.tag"
              :label="slide.tag"
              variant="purple-glow"
              size="md"
              :pulse="true"
              class="mb-4"
            />
            <h2 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              {{ slide.title }}
              <span
                v-if="slide.titleHighlight"
                class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple"
              >
                {{ slide.titleHighlight }}
              </span>
              <span v-if="slide.titleSuffix">
                {{ ` ${slide.titleSuffix}` }}
              </span>
            </h2>
            <p
              v-if="slide.description"
              class="text-muted text-lg mb-8 max-w-xl"
            >
              {{ slide.description }}
            </p>
            <div v-if="slide.listenUrl ?? slide.downloadUrl" class="flex flex-wrap gap-4">
              <BaseButton
                v-if="slide.listenUrl"
                variant="primary-light"
                icon-left="play_circle"
                size="lg"
                :to="slide.listenUrl"
              >
                Ouvir Agora
              </BaseButton>
              <BaseButton
                v-if="slide.downloadUrl"
                variant="secondary"
                icon-left="download"
                size="lg"
                :to="slide.downloadUrl"
              >
                Baixar CD
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Banner slide (apenas imagem, opcionalmente com link) -->
        <NuxtLink
          v-if="slide.type === 'banner' && slide.link"
          v-show="currentIndex === index"
          :to="slide.link"
          class="absolute inset-0 z-0 block transition-opacity duration-500"
          :class="currentIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <img
            :alt="slide.imageAlt ?? 'Banner'"
            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            :src="slide.imageUrl"
          />
        </NuxtLink>
        <div
          v-else-if="slide.type === 'banner'"
          v-show="currentIndex === index"
          class="absolute inset-0 z-0 transition-opacity duration-500"
          :class="currentIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <img
            :alt="slide.imageAlt ?? 'Banner'"
            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            :src="slide.imageUrl"
          />
        </div>
      </template>
    </div>

    <!-- Navigation: setas -->
    <button
      v-if="slides.length > 1"
      type="button"
      class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 size-10 md:size-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Slide anterior"
      @click="goPrev"
    >
      <BaseIcon name="chevron_left" size="2xl" />
    </button>
    <button
      v-if="slides.length > 1"
      type="button"
      class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 size-10 md:size-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Próximo slide"
      @click="goNext"
    >
      <BaseIcon name="chevron_right" size="2xl" />
    </button>

    <!-- Dots -->
    <div
      v-if="slides.length > 1"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2"
      role="tablist"
      aria-label="Slides do destaque"
    >
      <button
        v-for="(_, index) in slides"
        :key="`dot-${index}`"
        type="button"
        role="tab"
        :aria-selected="currentIndex === index"
        :aria-label="`Ir para slide ${index + 1}`"
        class="size-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-page"
        :class="currentIndex === index ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/70'"
        @click="currentIndex = index"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { HeroSlide } from '~~/shared/types/HeroSlide'

const props = withDefaults(
  defineProps<{
    slides: HeroSlide[]
    /** Intervalo de autoplay em ms; 0 desativa */
    autoplayInterval?: number
  }>(),
  {
    autoplayInterval: 6000,
  }
)

const currentIndex = ref(0)

function goNext() {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

function goPrev() {
  currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length
}

let autoplayTimer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
  if (props.autoplayInterval <= 0 || props.slides.length <= 1) return
  autoplayTimer = setInterval(goNext, props.autoplayInterval)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

watch(
  () => props.slides.length,
  () => {
    if (currentIndex.value >= props.slides.length) {
      currentIndex.value = 0
    }
  }
)
</script>

<style scoped>
@keyframes hero-cd-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-cd-fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes hero-cd-bg-fade {
  to {
    opacity: 0.5;
  }
}

.hero-cd-active .hero-cd-bg-img {
  animation: hero-cd-bg-fade 0.6s ease-out forwards;
}

.hero-cd-active .hero-cd-cover {
  animation: hero-cd-fade-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-cd-active .hero-cd-tags {
  opacity: 0;
  animation: hero-cd-fade-in-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
}

.hero-cd-active .hero-cd-title {
  opacity: 0;
  animation: hero-cd-fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
}

.hero-cd-active .hero-cd-artist {
  opacity: 0;
  animation: hero-cd-fade-in-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
}

.hero-cd-active .hero-cd-meta {
  opacity: 0;
  animation: hero-cd-fade-in-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
}

.hero-cd-active .hero-cd-buttons {
  opacity: 0;
  animation: hero-cd-fade-in-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.6s forwards;
}
</style>
