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
            <BaseIcon name="view_carousel" class="text-primary" />
            Destaques do Hero (Home)
          </h1>
          <BaseButton variant="primary" size="md" @click="openAddModal">
            <span class="material-symbols-outlined mr-2">add</span>
            Adicionar ao hero
          </BaseButton>
        </div>
        <p class="text-text-secondary text-sm mb-6">
          A ordem abaixo é a ordem em que os itens aparecem no slider da página inicial. Banners, CDs e DJs que você adicionar aqui serão exibidos no carrossel.
        </p>
        <p v-if="error" class="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{{ error }}</p>
        <div v-if="loading" class="py-12 text-text-secondary">Carregando...</div>
        <div v-else class="bg-card-dark border border-border-dark rounded-2xl overflow-hidden">
          <ul class="divide-y divide-border-dark">
            <li
              v-for="(item, index) in items"
              :key="item.id"
              class="flex items-center gap-4 px-4 py-3 hover:bg-white/5"
            >
              <span class="text-text-secondary text-sm w-8">{{ index + 1 }}.</span>
              <span
                class="text-xs font-medium px-2 py-1 rounded shrink-0"
                :class="typeBadgeClass(item.type)"
              >
                {{ typeLabel(item.type) }}
              </span>
              <span class="flex-1 text-white truncate">{{ item.label || '—' }}</span>
              <button
                type="button"
                class="p-2 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 shrink-0"
                aria-label="Remover do hero"
                @click="confirmRemove(item)"
              >
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </li>
          </ul>
          <div v-if="!items.length && !loading" class="px-4 py-8 text-center text-text-secondary text-sm">
            Nenhum item no hero. Clique em &quot;Adicionar ao hero&quot; para escolher banners, CDs ou DJs.
          </div>
        </div>

        <!-- Modal Adicionar -->
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="showAddModal = false">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto">
            <h2 class="text-lg font-bold text-white mb-4">Adicionar ao hero</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-2">Tipo</label>
                <div class="flex gap-2">
                  <button
                    v-for="t in ['banner', 'cd', 'dj']"
                    :key="t"
                    type="button"
                    class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    :class="addType === t ? 'bg-primary text-white' : 'bg-white/10 text-text-secondary hover:bg-white/20'"
                    @click="addType = t as 'banner' | 'cd' | 'dj'"
                  >
                    {{ typeLabel(t as 'banner' | 'cd' | 'dj') }}
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-2">Selecionar</label>
                <div class="max-h-60 overflow-y-auto border border-border-dark rounded-xl divide-y divide-border-dark">
                  <template v-if="addType === 'banner'">
                    <button
                      v-for="b in banners"
                      :key="b.id"
                      type="button"
                      class="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3"
                      @click="addItem(b.id)"
                    >
                      <div class="w-12 h-8 rounded bg-background-dark bg-cover bg-center shrink-0" :style="{ backgroundImage: b.image_url ? `url('${b.image_url}')` : undefined }" />
                      <span class="text-sm text-white truncate">{{ b.image_alt || 'Banner' }}</span>
                    </button>
                    <p v-if="!banners.length" class="px-4 py-6 text-text-secondary text-sm">Nenhum banner. Crie em Banners primeiro.</p>
                  </template>
                  <template v-else-if="addType === 'cd'">
                    <button
                      v-for="cd in cds"
                      :key="cd.id"
                      type="button"
                      class="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3"
                      @click="addItem(cd.id)"
                    >
                      <div class="w-10 h-10 rounded bg-background-dark bg-cover bg-center shrink-0" :style="{ backgroundImage: cd.capa_url ? `url('${cd.capa_url}')` : undefined }" />
                      <span class="text-sm text-white truncate">{{ cd.titulo }} — {{ cd.artista_nome }}</span>
                    </button>
                    <p v-if="!cds.length" class="px-4 py-6 text-text-secondary text-sm">Nenhum CD. Os artistas publicam em Meus CDs.</p>
                  </template>
                  <template v-else>
                    <button
                      v-for="u in djs"
                      :key="u.id"
                      type="button"
                      class="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3"
                      @click="addItem(u.id)"
                    >
                      <div class="w-10 h-10 rounded-full bg-background-dark bg-cover bg-center shrink-0" :style="{ backgroundImage: u.foto_perfil ? `url('${u.foto_perfil}')` : undefined }" />
                      <span class="text-sm text-white truncate">{{ u.nome || u.id }}</span>
                    </button>
                    <p v-if="!djs.length" class="px-4 py-6 text-text-secondary text-sm">Nenhum DJ (perfil com tipo DJ).</p>
                  </template>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <BaseButton variant="ghost" @click="showAddModal = false">Fechar</BaseButton>
            </div>
          </div>
        </div>

        <!-- Confirmar remoção -->
        <div v-if="removing" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="removing = null">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 max-w-sm shadow-xl">
            <p class="text-white mb-4">Remover &quot;{{ removing.label }}&quot; do hero?</p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="removing = null">Cancelar</BaseButton>
              <BaseButton variant="primary" class="bg-red-600 hover:bg-red-700" @click="doRemove">Remover</BaseButton>
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
import BaseButton from '~/components/ui/BaseButton.vue'
import { useAdminHero, type HeroSlideItem } from '~/composables/useAdminHero'
import { useAdminBanners } from '~/composables/useAdminBanners'
import { useAdminCds } from '~/composables/useAdminCds'
import { useAdminUsuarios } from '~/composables/useAdminUsuarios'

const { items, loading, error, fetchItems, addItem: addHeroItem, removeItem } = useAdminHero()
const { items: banners, fetchBanners } = useAdminBanners()
const { items: cds, fetchCds } = useAdminCds()
const { items: usuarios, fetchUsuarios } = useAdminUsuarios()

const showAddModal = ref(false)
const addType = ref<'banner' | 'cd' | 'dj'>('banner')
const removing = ref<HeroSlideItem | null>(null)

const djs = computed(() => usuarios.value.filter((u) => u.tipo_user === 'DJ'))

function typeLabel(t: 'banner' | 'cd' | 'dj') {
  return { banner: 'Banner', cd: 'CD / Álbum', dj: 'DJ' }[t]
}

function typeBadgeClass(t: string) {
  return { banner: 'bg-amber-500/20 text-amber-400', cd: 'bg-primary/20 text-primary', dj: 'bg-purple-500/20 text-purple-400' }[t] ?? 'bg-white/10 text-text-secondary'
}

function openAddModal() {
  addType.value = 'banner'
  showAddModal.value = true
  fetchBanners()
  fetchCds()
  fetchUsuarios()
}

async function addItem(referenceId: string) {
  await addHeroItem(addType.value, referenceId)
  showAddModal.value = false
}

function confirmRemove(item: HeroSlideItem) {
  removing.value = item
}

async function doRemove() {
  if (!removing.value) return
  await removeItem(removing.value.id)
  removing.value = null
}

onMounted(() => fetchItems())
useHead({ title: 'Destaques Hero — Admin — Imperatriz Paredões' })
</script>
