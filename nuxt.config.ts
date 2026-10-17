// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Follow the visitor's OS theme until they pick one with the toggle
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  runtimeConfig: {
    // Set via NUXT_RESEND_API_KEY, NUXT_CONTACT_TO, NUXT_CONTACT_FROM
    resendApiKey: '',
    contactTo: '',
    contactFrom: ''
  },

  routeRules: {
    '/': { prerender: true },
    '/me': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'me', language: 'sr-Latn-ME', name: 'Crnogorski', file: 'me.json' }
    ]
  }
})
