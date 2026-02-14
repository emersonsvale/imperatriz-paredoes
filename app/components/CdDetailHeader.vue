<template>
  <header
    class="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-nav-border bg-background-page/95 px-6 py-3 backdrop-blur-md lg:px-10"
  >
    <div class="flex items-center gap-6 lg:gap-8">
      <NuxtLink
        to="/"
        class="flex shrink-0 items-center gap-3 text-white"
      >
        <img
          src="/LOGO%20IMPERATRIZ%203D%201.png"
          alt="Imperatriz Paredões"
          class="h-8 w-auto max-h-10 object-contain object-left md:h-10 md:max-h-12"
          width="120"
          height="40"
        />
        <h2 class="text-lg font-bold leading-tight tracking-[-0.015em] text-white">
          Imperatriz Paredões
        </h2>
      </NuxtLink>
      <nav class="hidden items-center gap-9 lg:flex">
        <NuxtLink
          to="/"
          class="text-sm font-medium leading-normal text-white/80 transition-colors hover:text-primary"
        >
          Início
        </NuxtLink>
        <NuxtLink
          to="/cd/1"
          class="text-sm font-medium leading-normal text-white"
        >
          CDs
        </NuxtLink>
        <a
          href="#"
          class="text-sm font-medium leading-normal text-white/80 transition-colors hover:text-primary"
        >
          DJs
        </a>
        <a
          href="#"
          class="text-sm font-medium leading-normal text-white/80 transition-colors hover:text-primary"
        >
          Paredões
        </a>
        <a
          href="#"
          class="text-sm font-medium leading-normal text-white/80 transition-colors hover:text-primary"
        >
          Eventos
        </a>
      </nav>
    </div>
    <div class="flex flex-1 items-center justify-end gap-6">
      <label class="!h-10 hidden min-w-40 max-w-64 flex-col md:block">
        <div
          class="flex h-full w-full flex-1 items-stretch rounded-xl border border-nav-border bg-nav-border/50 transition-colors focus-within:border-primary"
        >
          <div class="flex items-center justify-center rounded-l-xl border-r-0 pl-4 text-muted-green">
            <span class="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            v-model="searchQuery"
            class="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-transparent pl-2 text-sm font-normal leading-normal text-white placeholder-muted-green focus:border-none focus:outline-none focus:ring-0 rounded-l-none border-l-0 px-4"
            placeholder="Buscar CDs, DJs..."
          />
        </div>
      </label>
      <button
        type="button"
        class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 px-4 text-sm font-bold leading-normal bg-primary text-background-dark transition-colors hover:bg-primary-hover"
      >
        <span class="truncate">Entrar</span>
      </button>
      <div
        class="size-10 rounded-full border-2 border-nav-border bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${avatarUrl})` }"
        role="img"
        :aria-label="avatarAlt"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
const searchQuery = ref('')

const avatarUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuABdC5v1A9_tQ5zAmDgQj-Ak9ntc2pNwqhn2ZdKbzBMjRqHpAsLhw7Z32sgWzdTTpluM5ZH3qklELl5Wq7iMcuR2PvoKf7lSRFFRM1SvhQPkyM8gBKiNkp_FdeicLBsdAy1iljwIpFaXih5sWv6ZEmotx9MFvprySMeiaorcbNblSBoyKXMsJuWxwGLdxcoOCsNNLxZLNsohtCCnj1DaIeRDOlVhGScVmEOQSiIfltmrt89zOsyOoZ5_MgkPpb_M8BQzYm3qHNyXfM'

const avatarAlt = 'Avatar do usuário'
</script>
