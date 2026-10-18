<script setup lang="ts">
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const links = computed(() => [
  { label: t('nav.about'), to: '#about' },
  { label: t('nav.work'), to: '#work' },
  { label: t('nav.reviews'), to: '#reviews' },
  { label: t('nav.contact'), to: '#contact' }
])

// Once the page moves, the bar lifts off into a floating glass panel
const scrolled = ref(false)

// On phones the links live in a dock at the bottom, within reach of the thumb.
// It slides in once the hero is behind you, since the hero has its own buttons.
const docked = ref(false)

// Scroll spy: the link for the section crossing the middle of the screen is marked active.
// Sections say which link they belong to with data-spy (the stack section keeps About lit),
// since some ids sit on centred jump targets rather than on the sections themselves.
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
  for (const section of document.querySelectorAll<HTMLElement>('[data-spy]')) {
    const rect = section.getBoundingClientRect()
    if (rect.top <= middle && rect.bottom > middle) current = section.dataset.spy
  }
  active.value = current
}

// Which dock slot the sliding highlight sits under
const activeIndex = computed(() => links.value.findIndex(link => link.to === active.value))

function onScroll() {
  scrolled.value = window.scrollY > 24
  docked.value = window.scrollY > window.innerHeight * 0.6
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
      :class="scrolled ? 'mt-3 h-16 max-w-6xl' : 'h-24'"
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

  <nav
    :aria-label="t('nav.label')"
    data-dock
    :data-shown="docked || undefined"
    class="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 sm:hidden"
  >
    <div
      data-dock-panel
      class="relative grid w-full max-w-sm grid-cols-4 rounded-full p-1.5"
    >
      <!-- Slides under the active link; hidden while no section is active -->
      <span
        aria-hidden="true"
        data-dock-pill
        class="absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/4)] rounded-full bg-primary"
        :style="{ '--slot': Math.max(activeIndex, 0), 'opacity': activeIndex < 0 ? 0 : 1 }"
      />
      <a
        v-for="link in links"
        :key="link.to"
        :href="link.to"
        :aria-current="active === link.to ? 'location' : undefined"
        :tabindex="docked ? undefined : -1"
        class="relative rounded-full py-2.5 text-center text-sm font-medium text-toned transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[current]:text-white"
        @click="onNavClick(link.to)"
      >
        {{ link.label }}
      </a>
    </div>
  </nav>
</template>

<style scoped>
/*
 * Every property has a matching "off" value of the same shape (transparent shadows
 * with the same layer count), so the glass fades out smoothly instead of snapping
 * at the end. The panel is always rounded; at the top it is invisible anyway.
 */
[data-glass] {
  position: relative;
  /* Own stacking context, so the frosted layer can sit behind the links */
  z-index: 0;
  border: 1px solid transparent;
  border-radius: 1rem;
  box-shadow:
    inset 0 1px 0 transparent,
    inset 0 -1px 0 transparent,
    0 12px 32px -12px transparent,
    0 2px 6px -2px transparent;
  transition-property: height, margin, max-width, border-color, box-shadow;
}

/*
 * The frost lives on its own layer and only its opacity animates. Chrome can drop
 * the blur when backdrop-filter itself is transitioned, leaving the page sharp
 * behind a merely tinted panel.
 */
[data-glass]::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  background-color: color-mix(in oklab, var(--ui-bg) 65%, transparent);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  backdrop-filter: blur(24px) saturate(1.8);
  opacity: 0;
  /* Same pace as the panel's duration-500 ease-out */
  transition: opacity 500ms cubic-bezier(0, 0, 0.2, 1);
  pointer-events: none;
}

/* Liquid glass: frosted, slightly saturated backdrop with a lit top edge */
[data-glass][data-scrolled] {
  border-color: color-mix(in oklab, var(--ui-text) 10%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 35%, transparent),
    inset 0 -1px 0 color-mix(in oklab, var(--ui-text) 4%, transparent),
    0 12px 32px -12px rgb(0 0 0 / 0.28),
    0 2px 6px -2px rgb(0 0 0 / 0.08);
}

[data-glass][data-scrolled]::before {
  opacity: 1;
}

:root.dark [data-glass][data-scrolled] {
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 14%, transparent),
    inset 0 -1px 0 transparent,
    0 12px 32px -12px rgb(0 0 0 / 0.8),
    0 2px 6px -2px transparent;
}

/* Phone dock: the same frosted glass, floating above the home indicator */
[data-dock] {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  transform: translateY(calc(100% + 1rem));
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

[data-dock][data-shown] {
  transform: none;
}

[data-dock-panel] {
  pointer-events: auto;
  border: 1px solid color-mix(in oklab, var(--ui-text) 10%, transparent);
  background-color: color-mix(in oklab, var(--ui-bg) 70%, transparent);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  backdrop-filter: blur(24px) saturate(1.8);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 35%, transparent),
    0 12px 32px -12px rgb(0 0 0 / 0.35);
}

:root.dark [data-dock-panel] {
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, white 14%, transparent),
    0 12px 32px -12px rgb(0 0 0 / 0.8);
}

[data-dock-pill] {
  transform: translateX(calc(var(--slot) * 100%));
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease;
}

@media (prefers-reduced-motion: reduce) {
  [data-glass],
  [data-glass]::before,
  [data-dock],
  [data-dock-pill] {
    transition: none;
  }
}
</style>
