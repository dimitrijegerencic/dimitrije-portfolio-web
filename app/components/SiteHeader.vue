<script setup lang="ts">
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const links = computed(() => [
  { label: t('nav.work'), to: '#work' },
  { label: t('nav.about'), to: '#about' },
  { label: t('nav.contact'), to: '#contact' }
])
</script>

<template>
  <header class="relative z-10">
    <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
      <NuxtLink
        :to="localePath('/')"
        class="rounded-sm font-display text-2xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {{ t('nav.home') }}
      </NuxtLink>

      <nav
        :aria-label="t('nav.label')"
        class="flex items-center gap-1 sm:gap-6"
      >
        <a
          v-for="link in links"
          :key="link.to"
          :href="link.to"
          class="hidden rounded-sm text-sm font-medium text-muted transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:inline"
        >
          {{ link.label }}
        </a>

        <div
          role="group"
          :aria-label="t('nav.language')"
          class="flex items-center text-sm font-semibold"
        >
          <NuxtLink
            v-for="(l, i) in locales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            :lang="l.language"
            :aria-label="l.name"
            :aria-current="l.code === locale ? 'true' : undefined"
            class="rounded-sm px-1.5 py-1 uppercase transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            :class="[
              l.code === locale ? 'text-primary' : 'text-muted hover:text-highlighted',
              i > 0 && 'border-l border-default'
            ]"
          >
            {{ l.code }}
          </NuxtLink>
        </div>

        <UColorModeButton
          color="neutral"
          variant="ghost"
        />
      </nav>
    </div>
  </header>
</template>
