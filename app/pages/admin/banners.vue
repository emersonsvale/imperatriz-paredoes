<template>
  <div class="bg-background-dark font-display text-white overflow-hidden h-full flex flex-1 min-h-0">
    <AdminSidebar />
    <main class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <div class="md:hidden flex items-center justify-between p-4 bg-card-dark border-b border-border-dark shrink-0">
        <NuxtLink to="/" class="font-bold text-primary">IMPERATRIZ</NuxtLink>
        <button type="button" class="text-white material-symbols-outlined" aria-label="Menu">menu</button>
      </div>
      <div class="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 pb-32">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <BaseIcon name="campaign" class="text-primary" />
            Banners (Home)
          </h1>
          <BaseButton variant="primary" size="md" @click="openCreate">
            <span class="material-symbols-outlined mr-2">add</span>
            Novo banner
          </BaseButton>
        </div>
        <p v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{{ error }}</p>
        <div v-if="loading" class="py-12 text-text-secondary">Carregando...</div>
        <div v-else class="space-y-4">
          <div
            v-for="b in items"
            :key="b.id"
            class="bg-card-dark border border-border-dark rounded-2xl p-4 flex flex-wrap items-center gap-4"
          >
            <div class="w-24 h-14 rounded bg-background-dark overflow-hidden shrink-0 bg-cover bg-center" :style="{ backgroundImage: b.image_url ? `url('${b.image_url}')` : undefined }" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-text-secondary">Ordem: {{ b.ordem }}</p>
              <p v-if="b.link" class="text-xs text-primary truncate">Link: {{ b.link }}</p>
              <p v-else class="text-xs text-text-secondary">Sem link</p>
            </div>
            <div class="flex gap-2">
              <button type="button" class="p-2 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary" aria-label="Editar" @click="openEdit(b)">
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
              <button type="button" class="p-2 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400" aria-label="Excluir" @click="confirmDelete(b)">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
          <div v-if="!items.length && !loading" class="py-12 text-center text-text-secondary text-sm">
            Nenhum banner. Clique em Novo banner para adicionar.
          </div>
        </div>
        <!-- Modal Criar/Editar -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="closeModal">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-lg font-bold text-white mb-4">{{ editingId ? 'Editar banner' : 'Novo banner' }}</h2>
            <form class="space-y-4" @submit.prevent="saveBanner">
              <!-- Upload da imagem -->
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1.5">Imagem do banner</label>
                <div
                  class="border-2 border-dashed border-border-dark rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-background-dark/50 min-h-[140px] flex flex-col items-center justify-center"
                  @click="triggerImageInput"
                >
                  <input
                    ref="imageInputRef"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="sr-only"
                    @change="onImageSelected"
                  >
                  <template v-if="imagePreview">
                    <img
                      :src="imagePreview"
                      alt="Preview"
                      class="max-h-32 w-full object-contain rounded"
                    >
                    <p class="text-xs text-primary mt-2">Clique para trocar a imagem</p>
                  </template>
                  <template v-else>
                    <BaseIcon name="image" size="2xl" class="text-text-secondary mb-2" />
                    <p class="text-sm text-text-secondary">Clique para selecionar (JPG, PNG ou WebP)</p>
                    <p class="text-xs text-text-secondary mt-1">Tamanho recomendado: 1920×600 px</p>
                  </template>
                </div>
                <p v-if="!editingId && !imageFile" class="text-xs text-amber-400 mt-1">Obrigatório para novo banner. Tamanho recomendado: 1920×600 px.</p>
                <p v-else class="text-xs text-text-secondary mt-1">Tamanho recomendado: 1920×600 px.</p>
              </div>
              <p v-if="formError" class="text-sm text-red-400">{{ formError }}</p>
              <BaseInput v-model="form.image_alt" label="Texto alternativo" placeholder="Descrição da imagem (acessibilidade)" />
              <BaseInput v-model="form.link" label="Link ao clicar" placeholder="https:// ou /cd/..." />
              <BaseInput v-model.number="form.ordem" label="Ordem" type="number" />
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton variant="ghost" type="button" @click="closeModal">Cancelar</BaseButton>
                <BaseButton variant="primary" type="submit" :disabled="saving || (!form.image_url && !imageFile && !editingId)">
                  {{ saving ? 'Salvando...' : 'Salvar' }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
        <div v-if="deleting" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="deleting = null">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <p class="text-white mb-4">Excluir este banner?</p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="deleting = null">Cancelar</BaseButton>
              <BaseButton variant="primary" class="bg-red-600 hover:bg-red-700" @click="doDelete">Excluir</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-guard' })
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useAdminBanners } from '~/composables/useAdminBanners'
import type { BannerRow } from '~/composables/useAdminBanners'

const supabase = useSupabaseClient()
const { items, loading, error, fetchBanners, createBanner, updateBanner, deleteBanner } = useAdminBanners()
const showModal = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const deleting = ref<BannerRow | null>(null)
const form = ref({ image_url: '', image_alt: '', link: '', ordem: 0 })
const imageInputRef = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const formError = ref<string | null>(null)

function triggerImageInput() {
  imageInputRef.value?.click()
}

function onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && file.type.startsWith('image/')) {
    if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
  input.value = ''
}

function openCreate() {
  editingId.value = null
  form.value = { image_url: '', image_alt: '', link: '', ordem: items.value.length }
  imageFile.value = null
  if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = null
  showModal.value = true
}

function openEdit(b: BannerRow) {
  editingId.value = b.id
  form.value = {
    image_url: b.image_url,
    image_alt: b.image_alt ?? '',
    link: b.link ?? '',
    ordem: b.ordem,
  }
  imageFile.value = null
  if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = b.image_url || null
  showModal.value = true
}

function closeModal() {
  formError.value = null
  if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = null
  imageFile.value = null
  showModal.value = false
  editingId.value = null
}

function getImageExt(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'jpeg' || ext === 'jpg' ? 'jpg' : ext === 'png' ? 'png' : ext === 'webp' ? 'webp' : 'jpg'
}

async function uploadBannerImage(file: File, bannerId: string | null): Promise<string> {
  const ext = getImageExt(file)
  const path = bannerId
    ? `banners/${bannerId}.${ext}`
    : `banners/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`
  const { error: uploadErr } = await supabase.storage.from('capas').upload(path, file, { upsert: true })
  if (uploadErr) throw new Error(`Upload da imagem: ${uploadErr.message}`)
  const { data } = supabase.storage.from('capas').getPublicUrl(path)
  return data.publicUrl
}

async function saveBanner() {
  const imageUrlToSave = form.value.image_url.trim()
  if (!editingId.value && !imageFile.value && !imageUrlToSave) return
  formError.value = null
  saving.value = true
  try {
    let finalImageUrl = imageUrlToSave
    if (imageFile.value) {
      finalImageUrl = await uploadBannerImage(imageFile.value, editingId.value)
    }
    if (!finalImageUrl) {
      formError.value = 'Selecione uma imagem para o banner.'
      return
    }
    if (editingId.value) {
      await updateBanner(editingId.value, {
        image_url: finalImageUrl,
        image_alt: form.value.image_alt.trim() || null,
        link: form.value.link.trim() || null,
        ordem: form.value.ordem,
      })
    } else {
      await createBanner({
        image_url: finalImageUrl,
        image_alt: form.value.image_alt.trim() || null,
        link: form.value.link.trim() || null,
        ordem: form.value.ordem,
      })
    }
    closeModal()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Erro ao salvar banner'
  } finally {
    saving.value = false
  }
}

function confirmDelete(b: BannerRow) {
  deleting.value = b
}

async function doDelete() {
  if (!deleting.value) return
  await deleteBanner(deleting.value.id)
  deleting.value = null
}

onMounted(() => fetchBanners())
useHead({ title: 'Banners — Admin — Imperatriz Paredões' })
</script>
