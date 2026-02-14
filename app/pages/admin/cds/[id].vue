<template>
  <div class="bg-background-dark font-display text-white overflow-hidden h-full flex flex-1 min-h-0">
    <AdminSidebar />
    <main class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <div class="md:hidden flex items-center justify-between p-4 bg-card-dark border-b border-border-dark shrink-0">
        <NuxtLink to="/" class="font-bold text-primary">IMPERATRIZ</NuxtLink>
        <button type="button" class="text-white material-symbols-outlined" aria-label="Menu">menu</button>
      </div>
      <div class="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 pb-32">
        <div class="mb-6 flex items-center gap-4">
          <NuxtLink to="/admin/cds" class="text-text-secondary hover:text-white flex items-center gap-1">
            <span class="material-symbols-outlined">arrow_back</span> Voltar
          </NuxtLink>
        </div>
        <p v-if="loadError" class="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{{ loadError }}</p>
        <div v-if="loading" class="py-12 text-text-secondary">Carregando...</div>
        <template v-else-if="cd">
          <div class="flex flex-wrap gap-6 mb-8">
            <div
              class="w-32 h-32 rounded-xl bg-background-dark border border-border-dark bg-cover bg-center shrink-0"
              :style="{ backgroundImage: cd.capa_url ? `url('${cd.capa_url}')` : undefined }"
            />
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-white">{{ cd.titulo }}</h1>
              <p class="text-text-secondary">{{ artistaNome }}</p>
              <p class="text-sm text-text-secondary mt-1">{{ cd.plays_count ?? 0 }} plays · {{ cd.downloads_count ?? 0 }} downloads</p>
              <div class="mt-4 flex gap-2">
                <BaseButton variant="ghost" size="sm" @click="openEditCd">Editar CD</BaseButton>
                <BaseButton variant="ghost" size="sm" class="text-red-400 hover:bg-red-500/10" @click="confirmDeleteCd">Excluir CD</BaseButton>
              </div>
            </div>
          </div>
          <div class="bg-card-dark border border-border-dark rounded-2xl overflow-hidden">
            <div class="px-4 py-3 border-b border-border-dark flex items-center justify-between">
              <h2 class="font-bold text-white">Faixas</h2>
              <BaseButton variant="primary" size="sm" @click="openAddFaixa">
                <span class="material-symbols-outlined text-lg mr-1">add</span>
                Faixa
              </BaseButton>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-background-dark/80 border-b border-border-dark">
                  <tr>
                    <th class="px-4 py-2 text-xs font-bold text-text-secondary w-10">#</th>
                    <th class="px-4 py-2 text-xs font-bold text-text-secondary">Título</th>
                    <th class="px-4 py-2 text-xs font-bold text-text-secondary">Artista</th>
                    <th class="px-4 py-2 text-xs font-bold text-text-secondary">Duração</th>
                    <th class="px-4 py-2 text-xs font-bold text-text-secondary w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(f, i) in faixas"
                    :key="f.id"
                    class="border-b border-border-dark last:border-0 hover:bg-white/5"
                  >
                    <td class="px-4 py-2 text-text-secondary">{{ i + 1 }}</td>
                    <td class="px-4 py-2 text-white">{{ f.titulo }}</td>
                    <td class="px-4 py-2 text-text-secondary text-sm">{{ f.artista ?? '—' }}</td>
                    <td class="px-4 py-2 text-text-secondary text-sm">{{ f.duracao ?? '—' }}</td>
                    <td class="px-4 py-2">
                      <button type="button" class="p-1.5 rounded text-text-secondary hover:bg-primary/10 hover:text-primary mr-1" aria-label="Editar" @click="openEditFaixa(f)">
                        <span class="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button type="button" class="p-1.5 rounded text-text-secondary hover:bg-red-500/10 hover:text-red-400" aria-label="Excluir" @click="confirmDeleteFaixa(f)">
                        <span class="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="!faixas.length" class="px-4 py-8 text-center text-text-secondary text-sm">
              Nenhuma faixa. Clique em Faixa para adicionar.
            </div>
          </div>
        </template>
        <div v-else-if="!loading">CD não encontrado.</div>

        <!-- Modal Editar CD -->
        <div v-if="editCdModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="editCdModal = false">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-lg font-bold text-white mb-4">Editar CD</h2>
            <form class="space-y-4" @submit.prevent="saveCd">
              <BaseInput v-model="editCdForm.titulo" label="Título" required />
              <BaseTextarea v-model="editCdForm.descricao" label="Descrição" :rows="2" />
              <BaseInput v-model="editCdForm.capa_url" label="URL da capa" />
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton variant="ghost" type="button" @click="editCdModal = false">Cancelar</BaseButton>
                <BaseButton variant="primary" type="submit" :disabled="saving">Salvar</BaseButton>
              </div>
            </form>
          </div>
        </div>
        <!-- Modal Adicionar/Editar Faixa -->
        <div v-if="faixaModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="closeFaixaModal">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-lg font-bold text-white mb-4">{{ editingFaixaId ? 'Editar faixa' : 'Nova faixa' }}</h2>
            <form class="space-y-4" @submit.prevent="saveFaixa">
              <BaseInput v-model="faixaForm.titulo" label="Título" required />
              <BaseInput v-model="faixaForm.artista" label="Artista" />
              <BaseInput v-model="faixaForm.duracao" label="Duração" placeholder="Ex: 3:45" />
              <BaseInput v-model.number="faixaForm.ordem" label="Ordem" type="number" />
              <BaseInput v-model="faixaForm.arquivo_url" label="URL do áudio" placeholder="https://..." />
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton variant="ghost" type="button" @click="closeFaixaModal">Cancelar</BaseButton>
                <BaseButton variant="primary" type="submit" :disabled="saving">Salvar</BaseButton>
              </div>
            </form>
          </div>
        </div>
        <!-- Confirmar exclusões -->
        <div v-if="deleteCdConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="deleteCdConfirm = false">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 max-w-sm shadow-xl">
            <p class="text-white mb-4">Excluir o CD <strong>{{ cd?.titulo }}</strong> e todas as faixas?</p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="deleteCdConfirm = false">Cancelar</BaseButton>
              <BaseButton variant="primary" class="bg-red-600 hover:bg-red-700" @click="doDeleteCd">Excluir</BaseButton>
            </div>
          </div>
        </div>
        <div v-if="deleteFaixaConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="deleteFaixaConfirm = null">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 max-w-sm shadow-xl">
            <p class="text-white mb-4">Excluir a faixa <strong>{{ deleteFaixaConfirm?.titulo }}</strong>?</p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="deleteFaixaConfirm = null">Cancelar</BaseButton>
              <BaseButton variant="primary" class="bg-red-600 hover:bg-red-700" @click="doDeleteFaixa">Excluir</BaseButton>
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
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import type { Tables } from '~~/shared/types/database.types'

const route = useRoute()
const { adminFetch } = useAdminApi()
const cdId = computed(() => route.params.id as string)
const cd = ref<Tables<'cd'> | null>(null)
const artistaNome = ref('—')
const faixas = ref<Tables<'faixa'>[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)
const saving = ref(false)
const editCdModal = ref(false)
const editCdForm = ref({ titulo: '', descricao: '', capa_url: '' })
const faixaModal = ref(false)
const editingFaixaId = ref<string | null>(null)
const faixaForm = ref({ titulo: '', artista: '', duracao: '', ordem: 0, arquivo_url: '' })
const deleteCdConfirm = ref(false)
const deleteFaixaConfirm = ref<Tables<'faixa'> | null>(null)

async function loadDetail() {
  loading.value = true
  loadError.value = null
  try {
    const res = await adminFetch<{ cd: Tables<'cd'>; faixas: Tables<'faixa'>[]; artista_nome: string }>(`/api/admin/cds/${cdId.value}`)
    cd.value = res.cd
    faixas.value = res.faixas ?? []
    artistaNome.value = res.artista_nome ?? '—'
    editCdForm.value = {
      titulo: res.cd.titulo,
      descricao: res.cd.descricao ?? '',
      capa_url: res.cd.capa_url ?? '',
    }
  } catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e && e.data && typeof (e.data as { message?: string }).message === 'string'
      ? (e.data as { message: string }).message
      : 'Erro ao carregar CD'
    loadError.value = msg
    cd.value = null
    faixas.value = []
  } finally {
    loading.value = false
  }
}

function openEditCd() {
  if (cd.value) {
    editCdForm.value = {
      titulo: cd.value.titulo,
      descricao: cd.value.descricao ?? '',
      capa_url: cd.value.capa_url ?? '',
    }
    editCdModal.value = true
  }
}

async function saveCd() {
  if (!cd.value) return
  saving.value = true
  try {
    await adminFetch(`/api/admin/cds/${cd.value.id}`, {
      method: 'PUT',
      body: {
        titulo: editCdForm.value.titulo.trim(),
        descricao: editCdForm.value.descricao.trim() || null,
        capa_url: editCdForm.value.capa_url.trim() || null,
      },
    })
    await loadDetail()
    editCdModal.value = false
  } finally {
    saving.value = false
  }
}

function confirmDeleteCd() {
  deleteCdConfirm.value = true
}

async function doDeleteCd() {
  if (!cd.value) return
  await adminFetch(`/api/admin/cds/${cd.value.id}`, { method: 'DELETE' })
  await navigateTo('/admin/cds')
}

function openAddFaixa() {
  editingFaixaId.value = null
  faixaForm.value = { titulo: '', artista: '', duracao: '', ordem: faixas.value.length, arquivo_url: '' }
  faixaModal.value = true
}

function openEditFaixa(f: Tables<'faixa'>) {
  editingFaixaId.value = f.id
  faixaForm.value = {
    titulo: f.titulo,
    artista: f.artista ?? '',
    duracao: f.duracao ?? '',
    ordem: f.ordem,
    arquivo_url: f.arquivo_url ?? '',
  }
  faixaModal.value = true
}

function closeFaixaModal() {
  faixaModal.value = false
  editingFaixaId.value = null
}

async function saveFaixa() {
  if (!cd.value || !faixaForm.value.titulo.trim()) return
  saving.value = true
  try {
    if (editingFaixaId.value) {
      await adminFetch(`/api/admin/cds/${cd.value.id}/faixas/${editingFaixaId.value}`, {
        method: 'PUT',
        body: {
          titulo: faixaForm.value.titulo.trim(),
          artista: faixaForm.value.artista.trim() || null,
          duracao: faixaForm.value.duracao.trim() || null,
          ordem: faixaForm.value.ordem,
          arquivo_url: faixaForm.value.arquivo_url.trim() || null,
        },
      })
    } else {
      await adminFetch(`/api/admin/cds/${cd.value.id}/faixas`, {
        method: 'POST',
        body: {
          titulo: faixaForm.value.titulo.trim(),
          artista: faixaForm.value.artista.trim() || null,
          duracao: faixaForm.value.duracao.trim() || null,
          ordem: faixaForm.value.ordem,
          arquivo_url: faixaForm.value.arquivo_url.trim() || null,
        },
      })
    }
    await loadDetail()
    closeFaixaModal()
  } finally {
    saving.value = false
  }
}

function confirmDeleteFaixa(f: Tables<'faixa'>) {
  deleteFaixaConfirm.value = f
}

async function doDeleteFaixa() {
  if (!cd.value || !deleteFaixaConfirm.value) return
  await adminFetch(`/api/admin/cds/${cd.value.id}/faixas/${deleteFaixaConfirm.value.id}`, { method: 'DELETE' })
  await loadDetail()
  deleteFaixaConfirm.value = null
}

onMounted(() => loadDetail())
watch(cdId, () => loadDetail())
useHead({ title: () => (cd.value ? `${cd.value.titulo} — Admin — Imperatriz Paredões` : 'CD — Admin — Imperatriz Paredões') })
</script>
