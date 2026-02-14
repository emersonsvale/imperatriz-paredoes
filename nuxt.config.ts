// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login', '/confirm', '/cadastro', '/cd/*', '/dj/*', '/top-downloads', '/djs', '/parceiros'],
      include: undefined,
      saveRedirectToCookie: true,
    },
    cookieOptions: {
      name: 'sb-auth-token',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    },
    types: './shared/types/database.types.ts',
  },
  app: {
    head: {
      htmlAttrs: { class: 'dark', lang: 'pt-BR' },
      link: [
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/LOGO%20IMPERATRIZ%203D%201.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '512x512', href: '/LOGO%20IMPERATRIZ%203D%201.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400..700,0..1,-50..200&display=swap',
        },
      ],
      title: 'Imperatriz Paredões - Som Automotivo',
    },
  },
  css: ['~/assets/css/theme.css'],
})