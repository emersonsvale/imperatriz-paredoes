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
            <BaseIcon name="album" class="text-primary" />
            CDs e Faixas
          </h1>
          <BaseButton variant="primary" size="md" @click="openCreate">
            <span class="material-symbols-outlined mr-2">add</span>
            Novo CD
          </BaseButton>
        </div>
        <p v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{{ error }}</p>
        <div v-if="loading" class="py-12 text-text-secondary">Carregando...</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <NuxtLink
            v-for="cd in items"
            :key="cd.id"
            :to="`/admin/cds/${cd.id}`"
            class="bg-card-dark border border-border-dark rounded-2xl p-4 flex gap-4 hover:border-primary/50 transition-colors group"
          >
            <div
              class="w-16 h-16 rounded-lg bg-background-dark shrink-0 bg-cover bg-center"
              :style="{ backgroundImage: cd.capa_url ? `url('${cd.capa_url}')` : undefined }"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-white truncate group-hover:text-primary">{{ cd.titulo }}</h3>
              <p class="text-xs text-text-secondary">{{ cd.artista_nome }}</p>
              <p class="text-xs text-text-secondary mt-1">{{ cd.plays_count ?? 0 }} plays · {{ cd.downloads_count ?? 0 }} downloads</p>
            </div>
            <span class="material-symbols-outlined text-text-secondary self-center">chevron_right</span>
          </NuxtLink>
          <div v-if="!items.length && !loading" class="col-span-full py-12 text-center text-text-secondary text-sm">
            Nenhum CD. Clique em Novo CD para adicionar (ou os artistas publicam pelo painel deles).
          </div>
        </div>
        <!-- Modal Novo CD -->
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="showCreateModal = false">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-lg font-bold text-white mb-4">Novo CD</h2>
            <form class="space-y-4" @submit.prevent="createCd">
              <BaseSelect v-model="createForm.perfil_id" label="Artista (perfil)" :options="perfilOptions" required />
              <BaseInput v-model="createForm.titulo" label="Título do CD" placeholder="Ex: Verão no Paredão" required />
              <BaseTextarea v-model="createForm.descricao" label="Descrição" placeholder="Opcional" :rows="2" />
              <BaseInput v-model="createForm.capa_url" label="URL da capa" placeholder="https://..." />
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton variant="ghost" type="button" @click="showCreateModal = false">Cancelar</BaseButton>
                <BaseButton variant="primary" type="submit" :disabled="saving">Criar</BaseButton>
              </div>
            </form>
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
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import type { SelectOption } from '~/components/ui/BaseSelect.vue'
import { useAdminCds } from '~/composables/useAdminCds'
import { useAdminUsuarios } from '~/composables/useAdminUsuarios'

const { items, loading, error, fetchCds, createCd: createCdApi } = useAdminCds()
const { items: usuarios, fetchUsuarios } = useAdminUsuarios()
const showCreateModal = ref(false)
const saving = ref(false)
const createForm = ref({
  perfil_id: '',
  titulo: '',
  descricao: '',
  capa_url: '',
})

const perfilOptions = computed<SelectOption[]>(() =>
  usuarios.value.map((u) => ({ value: u.id, label: u.nome ? `${u.nome} (${u.tipo_user ?? 'Ouvinte'})` : u.id }))
)

function openCreate() {
  createForm.value = { perfil_id: '', titulo: '', descricao: '', capa_url: '' }
  showCreateModal.value = true
}

async function createCd() {
  if (!createForm.value.perfil_id || !createForm.value.titulo.trim()) return
  saving.value = true
  try {
    await createCdApi({
      perfil_id: createForm.value.perfil_id,
      titulo: createForm.value.titulo.trim(),
      descricao: createForm.value.descricao.trim() || null,
      capa_url: createForm.value.capa_url.trim() || null,
    })
    showCreateModal.value = false
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCds()
  fetchUsuarios()
})
useHead({ title: 'CDs — Admin — Imperatriz Paredões' })
</script>
