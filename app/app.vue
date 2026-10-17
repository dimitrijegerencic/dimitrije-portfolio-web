<script setup lang="ts">
import { en, hr } from '@nuxt/ui/locale'

const { t, locale } = useI18n()
const i18nHead = useLocaleHead()

// Nuxt UI has no Montenegrin strings; Croatian is the closest Latin-script match
const uiLocale = computed(() => (locale.value === 'me' ? hr : en))

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: () => [
    { rel: 'icon', href: '/favicon.ico' },
    ...(i18nHead.value.link ?? [])
  ],
  htmlAttrs: {
    lang: computed(() => i18nHead.value.htmlAttrs?.lang)
  }
})

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description')
})
</script>

<template>
  <UApp :locale="uiLocale">
    <SiteHeader />

    <main>
      <NuxtPage />
    </main>
  </UApp>
</template>
