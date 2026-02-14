<template>
  <div class="bg-background-dark font-display text-white overflow-hidden h-full flex flex-1 min-h-0">
    <ArtistSidebar />

    <main class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <!-- Header Mobile -->
      <div class="md:hidden flex items-center justify-between p-4 bg-card-dark border-b border-border-dark shrink-0">
        <NuxtLink to="/" class="font-bold text-primary">
          IMPERATRIZ
        </NuxtLink>
        <button
          type="button"
          class="text-white material-symbols-outlined"
          aria-label="Menu"
        >
          menu
        </button>
      </div>

      <!-- Scrollable Area (min-h-0 evita segundo scroll no body) -->
      <div class="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 pb-32">
        <!-- Top Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :subtitle="stat.subtitle"
            :subtitle-icon="stat.subtitleIcon"
            :subtitle-color="stat.subtitleColor"
            :icon="stat.icon"
          />
        </div>

        <!-- Upload Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Form & Upload -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
              <BaseIcon name="cloud_upload" class="text-primary" />
              Lançar Novo CD
            </h2>
            <div class="bg-card-dark border border-border-dark rounded-2xl p-6 md:p-8 shadow-xl">
              <!-- Drag & Drop Zone -->
              <div
                class="relative group cursor-pointer mb-8"
                @click="triggerFileInput"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="onDrop"
              >
                <div class="absolute -inset-0.5 bg-gradient-to-r from-primary to-border-dark rounded-2xl opacity-20 group-hover:opacity-60 blur transition duration-500" />
                <div
                  class="relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-300 px-6 py-12"
                  :class="isDragging ? 'border-primary bg-primary/5' : 'border-border-dark group-hover:border-primary bg-background-dark/80 backdrop-blur-sm'"
                >
                  <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BaseIcon name="upload_file" size="2xl" class="text-primary animate-pulse-neon" />
                  </div>
                  <div class="text-center">
                    <p class="text-lg font-bold text-white mb-1">
                      Arraste suas faixas MP3 aqui
                    </p>
                    <p class="text-sm text-text-secondary">
                      ou <span class="text-primary underline">clique para selecionar</span> do computador
                    </p>
                    <p class="text-xs text-text-secondary mt-2 opacity-60">
                      Suporta MP3, WAV (Máx 200MB por faixa)
                    </p>
                  </div>
                </div>
                <input
                  ref="trackInputRef"
                  type="file"
                  accept="audio/*"
                  multiple
                  class="sr-only"
                  @change="onTrackFilesSelected"
                >
              </div>

              <!-- Lista do que será enviado: capa + faixas (com opção de remover) -->
              <div class="mb-6 rounded-xl bg-background-dark border border-border-dark overflow-hidden">
                <p class="text-sm font-medium text-text-secondary px-4 py-2 border-b border-border-dark flex items-center gap-2">
                  <BaseIcon name="list" class="text-primary" size="sm" />
                  O que será enviado
                </p>
                <div class="max-h-56 overflow-y-auto">
                  <!-- Capa (se houver) -->
                  <div
                    v-if="coverFile"
                    class="flex items-center gap-3 px-4 py-2.5 border-b border-border-dark group hover:bg-white/5"
                  >
                    <div class="w-10 h-10 rounded bg-background-dark border border-border-dark overflow-hidden shrink-0">
                      <img
                        v-if="coverPreview"
                        :src="coverPreview"
                        alt="Capa"
                        class="w-full h-full object-cover"
                      >
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <BaseIcon name="image" class="text-text-secondary" size="sm" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-white truncate">Capa do CD</p>
                      <p class="text-xs text-text-secondary">{{ coverFile.name }} · {{ formatFileSize(coverFile.size) }}</p>
                    </div>
                    <button
                      type="button"
                      class="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      aria-label="Remover capa"
                      @click.stop="removeCover"
                    >
                      <BaseIcon name="close" size="sm" />
                    </button>
                  </div>
                  <!-- Faixas -->
                  <div
                    v-for="(file, index) in trackFiles"
                    :key="`${file.name}-${file.size}-${index}`"
                    class="flex items-center gap-3 px-4 py-2.5 border-b border-border-dark last:border-b-0 group hover:bg-white/5"
                  >
                    <span class="text-primary font-medium w-6 shrink-0">{{ index + 1 }}.</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white truncate">{{ file.name }}</p>
                      <p class="text-xs text-text-secondary">{{ formatFileSize(file.size) }}</p>
                    </div>
                    <button
                      type="button"
                      class="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      :aria-label="`Remover faixa ${file.name}`"
                      @click.stop="removeTrack(index)"
                    >
                      <BaseIcon name="close" size="sm" />
                    </button>
                  </div>
                  <!-- Empty state da lista -->
                  <div
                    v-if="!coverFile && trackFiles.length === 0"
                    class="px-4 py-6 text-center text-text-secondary text-sm"
                  >
                    Nenhum arquivo adicionado. Arraste as faixas acima ou clique na área para selecionar.
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-border-dark flex items-center justify-between gap-2">
                  <span class="text-xs text-text-secondary">
                    <template v-if="coverFile && trackFiles.length > 0">
                      1 capa + {{ trackFiles.length }} {{ trackFiles.length === 1 ? 'faixa' : 'faixas' }}
                    </template>
                    <template v-else-if="coverFile">
                      1 capa
                    </template>
                    <template v-else-if="trackFiles.length > 0">
                      {{ trackFiles.length }} {{ trackFiles.length === 1 ? 'faixa' : 'faixas' }}
                    </template>
                    <template v-else>—</template>
                  </span>
                  <button
                    type="button"
                    class="text-xs text-primary hover:underline"
                    @click.stop="triggerFileInput"
                  >
                    Adicionar faixas
                  </button>
                </div>
              </div>

              <!-- Metadata Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <BaseInput
                    v-model="form.title"
                    label="Título do CD"
                    placeholder="Ex: Verão no Paredão Vol. 4"
                  />
                  <BaseTextarea
                    v-model="form.description"
                    label="Descrição"
                    placeholder="Conte um pouco sobre esse lançamento..."
                  />
                </div>
                <!-- Cover Art Upload -->
                <div class="flex flex-col">
                  <label class="block text-sm font-medium text-text-secondary mb-1.5">Capa do CD</label>
                  <div
                    class="flex-1 bg-background-dark border border-border-dark rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden group min-h-[180px]"
                    @click="triggerCoverInput"
                  >
                    <template v-if="coverPreview">
                      <img
                        :src="coverPreview"
                        alt="Preview da capa"
                        class="absolute inset-0 w-full h-full object-cover opacity-80"
                      >
                      <div class="absolute inset-0 bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
                        <span class="text-sm font-medium text-white">Trocar imagem</span>
                      </div>
                    </template>
                    <template v-else>
                      <BaseIcon name="image" size="2xl" class="text-text-secondary mb-2 group-hover:text-primary transition-colors" />
                      <p class="text-sm font-medium text-text-secondary group-hover:text-white">
                        Upload da Capa
                      </p>
                      <p class="text-[10px] text-gray-600 mt-1">
                        1000x1000px JPG/PNG
                      </p>
                    </template>
                    <input
                      ref="coverInputRef"
                      type="file"
                      accept="image/jpeg,image/png"
                      class="sr-only"
                      @change="onCoverSelected"
                    >
                  </div>
                </div>
              </div>

              <!-- Erro ao publicar -->
              <div v-if="publishError" class="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {{ publishError }}
              </div>
              <!-- Progress Bar -->
              <div v-if="uploadProgress > 0" class="mt-8 bg-background-dark rounded-xl p-4 border border-border-dark">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-3">
                    <BaseIcon name="music_note" class="text-primary" />
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-white">{{ uploadingFileName || 'Carregando...' }}</span>
                      <span class="text-xs text-text-secondary">{{ uploadProgress }}% — {{ uploadProgressLabel }}</span>
                    </div>
                  </div>
                  <span class="text-sm font-bold text-primary">{{ uploadProgress }}%</span>
                </div>
                <BaseProgressBar :value="uploadProgress" variant="neon" />
              </div>

              <!-- Actions -->
              <div class="mt-8 flex justify-end gap-3">
                <BaseButton variant="ghost" size="md" :disabled="publishLoading" @click="resetForm">
                  Cancelar
                </BaseButton>
                <BaseButton
                  variant="primary"
                  size="md"
                  class="shadow-neon hover:scale-105"
                  :disabled="publishLoading || !form.title.trim() || trackFiles.length === 0"
                  @click="publishCd"
                >
                  {{ publishLoading ? 'Publicando...' : 'Publicar CD' }}
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Sidebar Right: Recent Uploads -->
          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-white">
                Últimos Envios
              </h2>
              <NuxtLink to="/artist/cds" class="text-xs font-bold text-primary hover:underline">
                Ver Todos
              </NuxtLink>
            </div>
            <div class="bg-card-dark border border-border-dark rounded-2xl p-1 overflow-hidden">
              <div
                v-for="(item, index) in recentUploads"
                :key="`recent-${index}-${item.title}`"
                class="p-4 hover:bg-white/5 transition-colors flex items-center gap-3 group"
                :class="index < recentUploads.length - 1 ? 'border-b border-border-dark' : ''"
              >
                <div
                  v-if="item.coverUrl"
                  class="w-12 h-12 rounded bg-cover bg-center shrink-0"
                  :style="{ backgroundImage: `url('${item.coverUrl}')` }"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded bg-background-dark flex items-center justify-center border border-border-dark shrink-0"
                >
                  <BaseIcon name="hourglass_top" class="text-gray-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <BaseBadge :label="item.status" :variant="item.statusVariant" size="sm" />
                    <span v-if="item.date" class="text-[10px] text-text-secondary">{{ item.date }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-bold text-white">
                    {{ item.plays }}
                  </div>
                  <div class="text-[10px] text-text-secondary">
                    Plays
                  </div>
                </div>
              </div>
            </div>
            <!-- Quick Tips Card -->
            <div class="bg-gradient-to-br from-surface-dark to-card-dark border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
              <div class="relative z-10">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <BaseIcon name="lightbulb" size="sm" class="text-primary" />
                </div>
                <h4 class="text-white font-bold text-sm mb-1">
                  Dica de Sucesso
                </h4>
                <p class="text-xs text-text-secondary leading-relaxed">
                  Adicione tags precisas ao seu gênero para aparecer nas playlists de "Paredão da Semana". Capas de alta qualidade aumentam em 30% os cliques.
                </p>
              </div>
              <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'artist',
  middleware: 'artist-guard',
})
import ArtistSidebar from '~/components/artist/ArtistSidebar.vue'
import StatCard from '~/components/StatCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import BaseProgressBar from '~/components/ui/BaseProgressBar.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { useArtistCds } from '~/composables/useArtistCds'
import { usePerfil } from '~/composables/usePerfil'
import { usePublishCd } from '~/composables/usePublishCd'

const { cds, fetchCds, toCdCardData } = useArtistCds()
const { perfil } = usePerfil()
const artistName = computed(() => perfil.value?.nome ?? 'Artista')

/* ─── Stats Data (CDs reais) ─── */
const stats = computed(() => [
  {
    label: 'CDs Lançados',
    value: String(cds.value.length),
    subtitle: cds.value[0] ? `Último: "${cds.value[0].titulo}"` : 'Nenhum CD ainda',
    subtitleIcon: undefined as string | undefined,
    subtitleColor: 'text-text-secondary',
    icon: 'album',
  },
  {
    label: 'Total de Plays',
    value: String(cds.value.reduce((acc, cd) => acc + (cd.plays_count ?? 0), 0)),
    subtitle: `${cds.value.reduce((acc, cd) => acc + (cd.downloads_count ?? 0), 0)} downloads`,
    subtitleIcon: 'trending_up',
    subtitleColor: 'text-primary',
    icon: 'equalizer',
  },
])

/* ─── Recent Uploads (últimos 3 CDs do Supabase) ─── */
const recentUploads = computed(() =>
  cds.value.slice(0, 3).map((cd) => {
    const card = toCdCardData(cd, artistName.value)
    return {
      title: card.title,
      coverUrl: card.coverUrl || null,
      status: 'NO AR' as const,
      statusVariant: 'success' as const,
      date: null as string | null,
      plays: cd.plays_count ?? 0,
    }
  })
)

/* ─── Form State ─── */
const form = ref({
  title: '',
  description: '',
})
const coverPreview = ref<string | null>(null)
const coverFile = ref<File | null>(null)
const trackFiles = ref<File[]>([])
const trackInputRef = ref<HTMLInputElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const { publish, loading: publishLoading, progress: uploadProgress, progressLabel: uploadProgressLabel, error: publishError } = usePublishCd()
const uploadingFileName = computed(() => (trackFiles.value[0]?.name ?? '') || (uploadProgressLabel.value || ''))

/* ─── Actions ─── */
function triggerFileInput() {
  trackInputRef.value?.click()
}

function triggerCoverInput() {
  coverInputRef.value?.click()
}

function onTrackFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files?.length) {
    trackFiles.value = Array.from(files)
  }
  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files?.length) {
    trackFiles.value = Array.from(files)
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function removeTrack(index: number) {
  trackFiles.value = trackFiles.value.filter((_, i) => i !== index)
}

function removeCover() {
  if (coverPreview.value?.startsWith('blob:')) URL.revokeObjectURL(coverPreview.value)
  coverPreview.value = null
  coverFile.value = null
}

function onCoverSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && file.type.startsWith('image/')) {
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
  input.value = ''
}

function resetForm() {
  if (coverPreview.value?.startsWith('blob:')) URL.revokeObjectURL(coverPreview.value)
  form.value = { title: '', description: '' }
  coverPreview.value = null
  coverFile.value = null
  trackFiles.value = []
}

async function publishCd() {
  const result = await publish({
    titulo: form.value.title,
    descricao: form.value.description,
    coverFile: coverFile.value,
    trackFiles: trackFiles.value,
  })
  if (result.success) {
    resetForm()
    await fetchCds()
  }
}

useHead({
  title: 'Painel do Artista — Imperatriz Paredões',
})
</script>
