<template>
  <div class="bg-background-dark font-display text-white overflow-hidden h-full flex flex-1 min-h-0">
    <AdminSidebar />
    <main class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <div class="md:hidden flex items-center justify-between p-4 bg-card-dark border-b border-border-dark shrink-0">
        <NuxtLink to="/" class="font-bold text-primary">IMPERATRIZ</NuxtLink>
        <button type="button" class="text-white material-symbols-outlined" aria-label="Menu">menu</button>
      </div>
      <div class="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 pb-32">
        <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 mb-8">
          <BaseIcon name="group" class="text-primary" />
          Usuários
        </h1>
        <p v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{{ error }}</p>
        <div v-if="loading" class="py-12 text-text-secondary">Carregando...</div>
        <div v-else class="bg-card-dark border border-border-dark rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-background-dark/80 border-b border-border-dark">
                <tr>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase">Nome</th>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase">E-mail</th>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase">Tipo</th>
                  <th class="px-4 py-3 text-xs font-bold text-text-secondary uppercase w-24">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="u in items"
                  :key="u.id"
                  class="border-b border-border-dark last:border-0 hover:bg-white/5"
                >
                  <td class="px-4 py-3 font-medium text-white">{{ u.nome ?? '—' }}</td>
                  <td class="px-4 py-3 text-text-secondary text-sm">{{ u.email ?? '—' }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="text-xs font-medium px-2 py-1 rounded"
                      :class="tipoBadgeClass(u.tipo_user)"
                    >
                      {{ u.tipo_user ?? 'Ouvinte' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <button
                      type="button"
                      class="p-2 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                      aria-label="Editar"
                      @click="openEdit(u)"
                    >
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!items.length && !loading" class="px-4 py-8 text-center text-text-secondary text-sm">
            Nenhum usuário encontrado.
          </div>
        </div>
        <!-- Modal Editar -->
        <div
          v-if="editingUser"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          @click.self="editingUser = null"
        >
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-lg font-bold text-white mb-4">Editar usuário</h2>
            <form class="space-y-4" @submit.prevent="saveUser">
              <BaseInput v-model="editForm.nome" label="Nome" placeholder="Nome" />
              <BaseInput v-model="editForm.email" label="E-mail" type="email" placeholder="E-mail" />
              <BaseSelect
                v-model="editForm.tipo_user"
                label="Tipo"
                :options="tipoOptions"
              />
              <div class="flex justify-end gap-3 pt-4">
                <BaseButton variant="ghost" type="button" @click="editingUser = null">Cancelar</BaseButton>
                <BaseButton variant="primary" type="submit" :disabled="saving">Salvar</BaseButton>
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
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import type { SelectOption } from '~/components/ui/BaseSelect.vue'
import { useAdminUsuarios } from '~/composables/useAdminUsuarios'
import type { PerfilAdmin } from '~/composables/useAdminUsuarios'

const { items, loading, error, fetchUsuarios, updateUsuario } = useAdminUsuarios()
const editingUser = ref<PerfilAdmin | null>(null)
const saving = ref(false)
const editForm = ref({ nome: '', email: '', tipo_user: 'Ouvinte' as 'Admin' | 'DJ' | 'Ouvinte' })

const tipoOptions: SelectOption[] = [
  { value: 'Ouvinte', label: 'Ouvinte' },
  { value: 'DJ', label: 'DJ' },
  { value: 'Admin', label: 'Admin' },
]

function tipoBadgeClass(tipo: string | null) {
  if (tipo === 'Admin') return 'bg-amber-500/20 text-amber-400'
  if (tipo === 'DJ') return 'bg-primary/20 text-primary'
  return 'bg-white/10 text-text-secondary'
}

function openEdit(u: PerfilAdmin) {
  editingUser.value = u
  editForm.value = {
    nome: u.nome ?? '',
    email: u.email ?? '',
    tipo_user: (u.tipo_user ?? 'Ouvinte') as 'Admin' | 'DJ' | 'Ouvinte',
  }
}

async function saveUser() {
  if (!editingUser.value) return
  saving.value = true
  try {
    await updateUsuario(editingUser.value.id, {
      nome: editForm.value.nome.trim() || null,
      email: editForm.value.email.trim() || null,
      tipo_user: editForm.value.tipo_user,
    })
    editingUser.value = null
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchUsuarios())
useHead({ title: 'Usuários — Admin — Imperatriz Paredões' })
</script>
