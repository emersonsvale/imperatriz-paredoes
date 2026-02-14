<template>
  <section
    id="hero-section"
    class="relative w-full rounded-2xl overflow-hidden bg-card-dark group min-h-[300px] md:min-h-[400px] flex items-center"
  >
    <!-- Slides container -->
    <div class="absolute inset-0">
      <template v-for="(slide, index) in slides" :key="`slide-${index}`">
        <!-- Content slide -->
        <div
          v-show="currentIndex === index"
          class="absolute inset-0 flex items-center transition-opacity duration-500"
          :class="currentIndex === index ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'"
        >
          <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-r from-background-page via-background-page/85 to-transparent z-10" />
            <img
              :alt="slide.type === 'content' ? (slide.imageAlt ?? '') : (slide.imageAlt ?? 'Banner')"
              class="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              :src="slide.imageUrl"
            />
          </div>
          <div class="relative z-20 px-6 md:px-12 py-8 max-w-3xl">
            <BaseBadge
              v-if="slide.type === 'content' && slide.tag"
              :label="slide.tag"
              variant="purple-glow"
              size="md"
              :pulse="true"
              class="mb-4"
            />
            <h2 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              {{ slide.type === 'content' ? slide.title : '' }}
              <span
                v-if="slide.type === 'content' && slide.titleHighlight"
                class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple"
              >
                {{ slide.titleHighlight }}
              </span>
              <span v-if="slide.type === 'content' && slide.titleSuffix">
                {{ ` ${slide.titleSuffix}` }}
              </span>
            </h2>
            <p
              v-if="slide.type === 'content' && slide.description"
              class="text-muted text-lg mb-8 max-w-xl"
            >
              {{ slide.description }}
            </p>
            <div v-if="slide.type === 'content' && (slide.listenUrl ?? slide.downloadUrl)" class="flex flex-wrap gap-4">
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
