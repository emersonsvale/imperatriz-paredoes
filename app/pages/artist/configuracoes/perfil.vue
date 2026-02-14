<template>
  <div class="bg-background-dark font-display text-white overflow-hidden h-full flex flex-1 min-h-0">
    <ArtistSidebar />

    <main class="flex-1 flex flex-col h-full relative overflow-hidden">
      <div class="md:hidden flex items-center justify-between p-4 bg-card-dark border-b border-border-dark">
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

      <div class="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
        <h1 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 mb-8">
          <BaseIcon name="person" class="text-primary" />
          Configurações / Perfil
        </h1>

        <div class="max-w-2xl space-y-8">
          <div class="bg-card-dark border border-border-dark rounded-2xl p-6 md:p-8">
            <h2 class="text-lg font-bold text-white mb-6">
              Dados do perfil
            </h2>
            <div class="flex flex-col sm:flex-row gap-8">
              <div class="flex flex-col items-center gap-3 shrink-0">
                <div
                  class="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary bg-background-dark cursor-pointer group"
                  @click="triggerAvatarInput"
                >
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Foto do perfil"
                    class="w-full h-full object-cover"
                  >
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors"
                  >
                    <BaseIcon name="person" size="3xl" />
                  </div>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <BaseIcon name="photo_camera" class="text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  class="text-xs font-medium text-primary hover:underline"
                  @click="triggerAvatarInput"
                >
                  Alterar foto
                </button>
                <input
                  ref="avatarInputRef"
                  type="file"
                  accept="image/jpeg,image/png"
                  class="sr-only"
                  @change="onAvatarSelected"
                >
              </div>
              <div class="flex-1 space-y-4">
                <BaseInput
                  v-model="form.nomeArtistico"
                  label="Nome artístico"
                  placeholder="Ex: DJ Imperador"
                />
                <BaseInput
                  v-model="form.email"
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                />
                <BaseTextarea
                  v-model="form.bio"
                  label="Bio"
                  placeholder="Conte um pouco sobre você..."
                  :rows="4"
                />
                <BaseInput
                  v-model="form.cidade"
                  label="Cidade"
                  placeholder="Ex: Imperatriz, São Luís"
                />
              </div>
            </div>
            <div class="mt-8 border-t border-border-dark pt-8">
              <h3 class="text-base font-bold text-white mb-4">
                Redes sociais
              </h3>
              <p class="text-sm text-text-secondary mb-4">
                URLs completas ou @usuario (Instagram/Twitter). WhatsApp: número com DDI, ex: 5599988776655.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                  v-model="form.instagram"
                  label="Instagram"
                  placeholder="https://instagram.com/seuusuario ou @seuusuario"
                />
                <BaseInput
                  v-model="form.facebook"
                  label="Facebook"
                  placeholder="https://facebook.com/seuperfil"
                />
                <BaseInput
                  v-model="form.twitter"
                  label="X / Twitter"
                  placeholder="https://x.com/seuusuario ou @seuusuario"
                />
                <BaseInput
                  v-model="form.whatsapp"
                  label="WhatsApp"
                  placeholder="5599988776655 ou link wa.me"
                />
              </div>
            </div>
            <div class="mt-8 flex justify-end">
              <BaseButton
                variant="primary"
                size="md"
                :disabled="perfilLoading"
                @click="saveProfile"
              >
                {{ perfilLoading ? 'Salvando...' : 'Salvar alterações' }}
              </BaseButton>
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
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { usePerfil } from '~/composables/usePerfil'

const avatarInputRef = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarFile = ref<File | null>(null)

const { perfil, loading: perfilLoading, updatePerfil, fetchPerfil, getUserId } = usePerfil()
const supabase = useSupabaseClient()

const form = ref({
  nomeArtistico: '',
  email: '',
  bio: '',
  cidade: '',
  instagram: '',
  facebook: '',
  twitter: '',
  whatsapp: '',
})

onMounted(() => {
  fetchPerfil()
})

watch(
  perfil,
  (p) => {
    if (p) {
      form.value.nomeArtistico = p.nome ?? ''
      form.value.email = p.email ?? ''
      form.value.bio = p.bio ?? ''
      form.value.cidade = p.cidade ?? ''
      form.value.instagram = p.instagram ?? ''
      form.value.facebook = p.facebook ?? ''
      form.value.twitter = p.twitter ?? ''
      form.value.whatsapp = p.whatsapp ?? ''
      if (p.foto_perfil) avatarPreview.value = p.foto_perfil
    }
  },
  { immediate: true }
)

function triggerAvatarInput() {
  avatarInputRef.value?.click()
}

function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && file.type.startsWith('image/')) {
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
  }
  input.value = ''
}

async function saveProfile() {
  const userId = await getUserId()
  if (!userId) return

  let fotoUrl = perfil.value?.foto_perfil ?? null
  if (avatarFile.value) {
    const path = `${userId}/avatar.${avatarFile.value.name.split('.').pop()?.toLowerCase() || 'jpg'}`
    const { error: uploadErr } = await supabase.storage.from('capas').upload(path, avatarFile.value, { upsert: true })
    if (!uploadErr) {
      const { data } = supabase.storage.from('capas').getPublicUrl(path)
      fotoUrl = data.publicUrl
    }
    avatarFile.value = null
  }

  const { success } = await updatePerfil({
    nome: form.value.nomeArtistico.trim() || null,
    email: form.value.email.trim() || null,
    bio: form.value.bio.trim() || null,
    cidade: form.value.cidade.trim() || null,
    foto_perfil: fotoUrl,
    instagram: form.value.instagram.trim() || null,
    facebook: form.value.facebook.trim() || null,
    twitter: form.value.twitter.trim() || null,
    whatsapp: form.value.whatsapp.trim() || null,
  })
  if (success) await fetchPerfil()
}

useHead({
  title: 'Configurações / Perfil — Imperatriz Paredões',
})
</script>
