import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
  ],
  css: ['./app/assets/css/main.css'],
  
  nitro: {
    compressPublicAssets: true,
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  // Optimisations SEO
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#3AF24B' },
        { name: 'description', content: 'Commandez vos repas préférés en ligne avec Grosmino\'s' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },
  i18n: {
    locales: [
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json'
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'fr',
    strategy: 'no_prefix',
    compilation: {
      strictMessage: false,
    },
  },
})
