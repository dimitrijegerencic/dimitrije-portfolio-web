<script setup lang="ts">
const { t } = useI18n()

// Icons stay in the text colour and take on their brand colour on hover.
// Brand-less entries (no Simple Icons logo) use a generic Lucide icon and the site's red.
const groups = computed(() => [
  {
    label: t('stack.frontend'),
    items: [
      { name: 'Vue', icon: 'i-simple-icons-vuedotjs', brand: '#4FC08D' },
      { name: 'React', icon: 'i-simple-icons-react', brand: '#61DAFB' },
      { name: 'Nuxt', icon: 'i-simple-icons-nuxt', brand: '#00DC82' },
      { name: 'Vuetify', icon: 'i-simple-icons-vuetify', brand: '#1867C0' },
      { name: 'Nuxt UI', icon: 'i-lucide-blocks', brand: '#00DC82' },
      { name: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss', brand: '#06B6D4' },
      { name: 'TypeScript', icon: 'i-simple-icons-typescript', brand: '#3178C6' },
      { name: 'JavaScript', icon: 'i-simple-icons-javascript', brand: '#F7DF1E' }
    ]
  },
  {
    label: t('stack.state'),
    items: [
      { name: 'Pinia', icon: 'i-simple-icons-pinia', brand: '#FFD859' },
      { name: 'Redux', icon: 'i-simple-icons-redux', brand: '#764ABC' },
      { name: 'i18n', icon: 'i-lucide-languages', brand: 'var(--ui-primary)' }
    ]
  },
  {
    label: t('stack.backend'),
    items: [
      { name: 'Laravel', icon: 'i-simple-icons-laravel', brand: '#FF2D20' }
    ]
  },
  {
    label: t('stack.tooling'),
    items: [
      { name: 'Vite', icon: 'i-simple-icons-vite', brand: '#646CFF' },
      { name: 'Git', icon: 'i-simple-icons-git', brand: '#F05032' },
      { name: 'Figma', icon: 'i-simple-icons-figma', brand: '#F24E1E' },
      { name: 'Postman', icon: 'i-simple-icons-postman', brand: '#FF6C37' },
      { name: 'Jira', icon: 'i-simple-icons-jira', brand: '#0052CC' }
    ]
  }
])
</script>

<template>
  <section
    id="stack"
    data-spy="#about"
    aria-labelledby="stack-title"
    class="scroll-mt-20 pb-24 sm:pb-32"
  >
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
      <h2
        id="stack-title"
        class="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.92] font-extrabold text-balance text-highlighted uppercase"
      >
        {{ t('stack.title') }}
      </h2>

      <div class="mt-10 border-t border-default">
        <div
          v-for="group in groups"
          :key="group.label"
          class="grid gap-4 border-b border-default py-6 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-8"
        >
          <h3 class="text-sm text-muted">
            {{ group.label }}
          </h3>

          <ul class="flex flex-wrap gap-x-10 gap-y-5">
            <li
              v-for="item in group.items"
              :key="item.name"
              data-tech
              class="flex cursor-default items-center gap-3 select-none"
              :style="{ '--brand': item.brand }"
            >
              <UIcon
                :name="item.icon"
                class="size-8 shrink-0 text-highlighted transition-colors duration-300"
              />
              <span class="font-display text-2xl font-bold text-highlighted sm:text-3xl">
                {{ item.name }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
[data-tech]:hover :deep(.iconify) {
  color: var(--brand);
}
</style>
