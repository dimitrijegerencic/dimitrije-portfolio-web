<script setup lang="ts">
import { en, hr } from '@nuxt/ui/locale'

const { t, locale } = useI18n()
const years = useExperienceYears()
const i18nHead = useLocaleHead()

// Nuxt UI has no Montenegrin strings; Croatian is the closest Latin-script match
const uiLocale = computed(() => (locale.value === 'me' ? hr : en))

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: () => [
    // SVG follows the browser's light/dark theme; the ICO is the fallback for browsers without SVG icons
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ...(i18nHead.value.link ?? [])
  ],
  htmlAttrs: {
    lang: computed(() => i18nHead.value.htmlAttrs?.lang)
  }
})

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description', years),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description', years),
  ogImage: 'https://dimitrije.io/og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Dimitrije Gerenčić, frontend developer from Podgorica, Montenegro',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :locale="uiLocale">
    <SiteHeader />

    <main>
      <NuxtPage />
    </main>

    <SiteFooter />

    <CursorGlow />
  </UApp>
</template>
