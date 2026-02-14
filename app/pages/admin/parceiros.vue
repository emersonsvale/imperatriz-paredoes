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
            <BaseIcon name="handshake" class="text-primary" />
            Parceiros
          </h1>
          <BaseButton variant="primary" size="md" @click="openCreate">
            <span class="material-symbols-outlined mr-2">add</span>
            Novo parceiro
          </BaseButton>
        </div>
        <p v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{{ error }}</p>
        <div v-if="loading" class="py-12 text-text-secondary">Carregando...</div>
        <div v-else class="bg-card-dark border border-border-dark rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-background-dark/80 border-b border-border-dark">
                <tr>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase">Ordem</th>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase">Nome</th>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase">Logo / Link</th>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase w-28">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in items"
                  :key="p.id"
                  class="border-b border-border-dark last:border-0 hover:bg-white/5"
                >
                  <td class="px-4 py-3 text-text-secondary">{{ p.ordem }}</td>
                  <td class="px-4 py-3 font-medium text-white">{{ p.nome }}</td>
                  <td class="px-4 py-3 text-sm text-text-secondary">
                    <span v-if="p.logo_url" class="inline-block w-8 h-8 rounded bg-white/10 bg-cover bg-center" :style="{ backgroundImage: `url('${p.logo_url}')` }" />
                    {{ p.href ? 'Link' : '—' }}
                  </td>
                  <td class="px-4 py-3 flex gap-1">
                    <button type="button" class="p-2 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary" aria-label="Editar" @click="openEdit(p)">
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button type="button" class="p-2 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400" aria-label="Excluir" @click="confirmDelete(p)">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!items.length && !loading" class="px-4 py-8 text-center text-text-secondary text-sm">
            Nenhum parceiro. Clique em Novo parceiro para adicionar.
          </div>
        </div>
        <!-- Modal Criar/Editar -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="closeModal">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-lg font-bold text-white mb-4">{{ editingId ? 'Editar parceiro' : 'Novo parceiro' }}</h2>
            <form class="space-y-4" @submit.prevent="saveParceiro">
              <BaseInput v-model="form.nome" label="Nome" placeholder="Nome do parceiro" required />
              <!-- Upload do logo -->
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1.5">Logo do parceiro</label>
                <div
                  class="border-2 border-dashed border-border-dark rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-background-dark/50 min-h-[120px] flex flex-col items-center justify-center"
                  @click="triggerLogoInput"
                >
                  <input
                    ref="logoInputRef"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    class="sr-only"
                    @change="onLogoSelected"
                  >
                  <template v-if="logoPreview">
                    <img
                      :src="logoPreview"
                      alt="Preview do logo"
                      class="max-h-20 w-full object-contain rounded"
                    >
                    <p class="text-xs text-primary mt-2">Clique para trocar o logo</p>
                  </template>
                  <template v-else>
                    <BaseIcon name="image" size="2xl" class="text-text-secondary mb-2" />
                    <p class="text-sm text-text-secondary">Clique para selecionar (JPG, PNG, WebP ou SVG)</p>
                  </template>
                </div>
              </div>
              <BaseInput v-model="form.href" label="Link" placeholder="https://..." />
              <BaseInput v-model.number="form.ordem" label="Ordem" type="number" />
              <p v-if="formError" class="text-sm text-red-400">{{ formError }}</p>
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton variant="ghost" type="button" @click="closeModal">Cancelar</BaseButton>
                <BaseButton variant="primary" type="submit" :disabled="saving">Salvar</BaseButton>
              </div>
            </form>
          </div>
        </div>
        <!-- Confirmar exclusão -->
        <div v-if="deleting" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="deleting = null">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <p class="text-white mb-4">Excluir o parceiro <strong>{{ deleting.nome }}</strong>?</p>
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
import { useAdminParceiros } from '~/composables/useAdminParceiros'
import type { ParceiroRow } from '~/composables/useAdminParceiros'

const supabase = useSupabaseClient()
const { items, loading, error, fetchParceiros, createParceiro, updateParceiro, deleteParceiro } = useAdminParceiros()
const showModal = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const deleting = ref<ParceiroRow | null>(null)
const formError = ref<string | null>(null)
const form = ref({ nome: '', href: '', ordem: 0 })
const logoInputRef = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

function triggerLogoInput() {
  logoInputRef.value?.click()
}

function onLogoSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml')) {
    if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
    logoFile.value = file
    logoPreview.value = URL.createObjectURL(file)
  }
  input.value = ''
}

function getLogoExt(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'svg') return 'svg'
  if (ext === 'jpeg' || ext === 'jpg') return 'jpg'
  if (ext === 'png') return 'png'
  if (ext === 'webp') return 'webp'
  return 'png'
}

async function uploadLogo(file: File, parceiroId: string | null): Promise<string> {
  const ext = getLogoExt(file)
  const path = parceiroId
    ? `parceiros/${parceiroId}.${ext}`
    : `parceiros/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`
  const { error: uploadErr } = await supabase.storage.from('capas').upload(path, file, { upsert: true })
  if (uploadErr) throw new Error(`Upload do logo: ${uploadErr.message}`)
  const { data } = supabase.storage.from('capas').getPublicUrl(path)
  return data.publicUrl
}

function openCreate() {
  editingId.value = null
  form.value = { nome: '', href: '', ordem: items.value.length }
  logoFile.value = null
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoPreview.value = null
  formError.value = null
  showModal.value = true
}

function openEdit(p: ParceiroRow) {
  editingId.value = p.id
  form.value = { nome: p.nome, href: p.href ?? '', ordem: p.ordem }
  logoFile.value = null
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoPreview.value = p.logo_url || null
  formError.value = null
  showModal.value = true
}

function closeModal() {
  formError.value = null
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoPreview.value = null
  logoFile.value = null
  showModal.value = false
  editingId.value = null
}

async function saveParceiro() {
  if (!form.value.nome.trim()) return
  formError.value = null
  saving.value = true
  try {
    let logoUrl: string | null = null
    if (logoFile.value) {
      logoUrl = await uploadLogo(logoFile.value, editingId.value)
    } else if (editingId.value) {
      const current = items.value.find((p) => p.id === editingId.value)
      logoUrl = current?.logo_url ?? null
    }
    if (editingId.value) {
      await updateParceiro(editingId.value, {
        nome: form.value.nome.trim(),
        logo_url: logoUrl,
        href: form.value.href.trim() || null,
        ordem: form.value.ordem,
      })
    } else {
      await createParceiro({
        nome: form.value.nome.trim(),
        logo_url: logoUrl,
        href: form.value.href.trim() || null,
        ordem: form.value.ordem,
      })
    }
    closeModal()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Erro ao salvar parceiro'
  } finally {
    saving.value = false
  }
}

function confirmDelete(p: ParceiroRow) {
  deleting.value = p
}

async function doDelete() {
  if (!deleting.value) return
  await deleteParceiro(deleting.value.id)
  deleting.value = null
}

onMounted(() => fetchParceiros())
useHead({ title: 'Parceiros — Admin — Imperatriz Paredões' })
</script>
