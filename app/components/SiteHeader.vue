<script setup lang="ts">
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const links = computed(() => [
  { label: t('nav.about'), to: '#about' },
  { label: t('nav.work'), to: '#work' },
  { label: t('nav.contact'), to: '#contact' }
])

// Once the page moves, the bar lifts off into a floating glass panel
const scrolled = ref(false)

// Scroll spy: the link for the section crossing the middle of the screen is marked active.
// The stack section belongs to About, so it keeps About lit.
const sectionToLink: Record<string, string> = {
  about: '#about',
  stack: '#about',
  work: '#work',
  contact: '#contact'
}
const active = ref<string>()

// After a nav click the target stays lit while the page glides there,
// so sections passed on the way (e.g. About on the way to Work) don't flash active
let locked = false
let unlockTimer: ReturnType<typeof setTimeout> | undefined

function scheduleUnlock() {
  clearTimeout(unlockTimer)
  unlockTimer = setTimeout(() => {
    locked = false
    updateActive()
  }, 150)
}

function updateActive() {
  if (locked) return
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom) {
    active.value = '#contact'
    return
  }
  const middle = window.innerHeight / 2
  let current: string | undefined
  for (const id of Object.keys(sectionToLink)) {
    const rect = document.getElementById(id)?.getBoundingClientRect()
    if (rect && rect.top <= middle && rect.bottom > middle) current = sectionToLink[id]
  }
  active.value = current
}

function onScroll() {
  scrolled.value = window.scrollY > 24
  if (locked) scheduleUnlock()
  else updateActive()
}

function onNavClick(to: string) {
  active.value = to
  locked = true
  // Unlocks once scrolling settles, or right away if the page didn't need to move
  scheduleUnlock()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateActive, { passive: true })
})

onBeforeUnmount(() => {
  clearTimeout(unlockTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateActive)
})
</script>

<template>
  <!-- Fixed height so the page never jumps when the bar changes shape -->
  <header class="pointer-events-none sticky top-0 z-50 flex h-24 flex-col px-2 sm:px-4">
    <div
      data-glass
      :data-scrolled="scrolled || undefined"
      class="pointer-events-auto mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 duration-500 ease-out sm:px-8"
      :class="scrolled ? 'mt-3 h-16 max-w-6xl rounded-2xl' : 'h-24'"
    >
      <NuxtLink
        :to="localePath('/')"
        :aria-label="t('nav.home')"
        class="justify-self-start rounded-sm font-display text-3xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        @click="scrollToTop"
      >
        DG
      </NuxtLink>

      <nav
        :aria-label="t('nav.label')"
        class="hidden items-center gap-10 sm:flex"
      >
        <a
          v-for="link in links"
          :key="link.to"
          :href="link.to"
          :aria-current="active === link.to ? 'location' : undefined"
          class="relative rounded-sm py-1 text-base font-medium text-muted transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:text-highlighted hover:after:origin-left hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:after:transition-none aria-[current]:text-highlighted aria-[current]:after:scale-x-100"
          @click="onNavClick(link.to)"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="col-start-3 flex items-center justify-self-end gap-2 sm:gap-5">
        <div
          role="group"
          :aria-label="t('nav.language')"
          class="flex items-center text-base font-semibold"
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
          size="lg"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
[data-glass] {
  border: 1px solid transparent;
  transition-property: height, margin, max-width, border-radius, background-color, border-color, box-shadow, backdrop-filter;
}

/* Liquid glass: frosted, slightly saturated backdrop with a lit top edge */
[data-glass][data-scrolled] {
  background-color: color-mix(in oklab, var(--ui-bg) 55%, transparent);
  border-color: color-mix(in oklab, var(--ui-text) 10%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 35%, transparent),
    inset 0 -1px 0 color-mix(in oklab, var(--ui-text) 4%, transparent),
    0 12px 32px -12px rgb(0 0 0 / 0.28),
    0 2px 6px -2px rgb(0 0 0 / 0.08);
  backdrop-filter: blur(18px) saturate(1.8);
}

:root.dark [data-glass][data-scrolled] {
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 14%, transparent),
    0 12px 32px -12px rgb(0 0 0 / 0.8);
}

@media (prefers-reduced-motion: reduce) {
  [data-glass] {
    transition: none;
  }
}
</style>
