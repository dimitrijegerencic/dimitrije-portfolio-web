<script setup lang="ts">
const { t, locale } = useI18n()

const links = computed(() => [
  { label: t('nav.about'), to: '#about' },
  { label: t('nav.work'), to: '#work' },
  { label: t('nav.reviews'), to: '#reviews' },
  { label: t('nav.contact'), to: '#contact' }
])

// Podgorica time, so visitors in other time zones know when I'm around.
// Filled in on the client only, so the prerendered page never shows a stale time.
const time = ref('')
const status = ref<'desk' | 'evening' | 'weekend' | 'night'>()
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  const now = new Date()
  time.value = new Intl.DateTimeFormat(locale.value === 'me' ? 'sr-Latn-ME' : 'en-GB', {
    timeZone: 'Europe/Podgorica',
    hour: '2-digit',
    minute: '2-digit'
  }).format(now)

  // Read the hour and weekday as they are in Podgorica, not in the visitor's zone
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Podgorica',
    hour: 'numeric',
    hourCycle: 'h23',
    weekday: 'short'
  }).formatToParts(now)
  const hour = Number(parts.find(p => p.type === 'hour')?.value)
  const day = parts.find(p => p.type === 'weekday')?.value
  // Friday evening already counts as the weekend: the next reply comes on Monday
  const weekend = day === 'Sat' || day === 'Sun' || (day === 'Fri' && hour >= 17)

  if (hour >= 23 || hour < 7) status.value = 'night'
  else if (weekend) status.value = 'weekend'
  else if (hour >= 9 && hour < 17) status.value = 'desk'
  else status.value = 'evening'
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 15_000)
})

watch(locale, tick)
onBeforeUnmount(() => clearInterval(timer))

const year = new Date().getFullYear()
</script>

<template>
  <!-- Same tint as the ridge fill, so the mountains stand on the footer like on ground.
       No z-index: the cursor glow lights it like the ridges. -->
  <footer class="relative overflow-hidden bg-[color-mix(in_oklab,var(--ui-primary)_7%,var(--ui-bg))] text-highlighted">
    <div class="mx-auto grid max-w-7xl gap-12 px-4 pt-20 pb-16 sm:grid-cols-3 sm:px-8 sm:pt-28 sm:pb-20">
      <div>
        <p class="text-sm text-muted">
          {{ t('footer.localTime') }}
        </p>
        <p class="mt-1 font-display text-5xl font-bold tabular-nums">
          <time v-if="time">{{ time }}</time>
          <span
            v-else
            aria-hidden="true"
          >--:--</span>
        </p>
        <p
          v-if="status"
          class="mt-3 flex items-center gap-2.5 text-sm text-toned"
        >
          <span
            aria-hidden="true"
            class="relative flex size-2"
          >
            <span
              v-if="status === 'desk'"
              class="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none"
            />
            <span
              class="relative size-2 rounded-full"
              :class="status === 'desk' ? 'bg-primary' : 'bg-accented'"
            />
          </span>
          {{ t(`footer.status.${status}`) }}
        </p>
      </div>

      <nav
        :aria-label="t('footer.nav')"
        class="flex flex-col gap-3 sm:items-center"
      >
        <a
          v-for="link in links"
          :key="link.to"
          :href="link.to"
          class="w-fit rounded-sm text-lg font-medium text-toned underline-offset-8 transition-colors hover:text-highlighted hover:underline hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex sm:justify-end">
        <button
          type="button"
          class="group flex h-fit cursor-pointer items-center gap-3 rounded-full border border-accented py-2 pr-2 pl-5 text-base font-medium transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          @click="scrollToTop"
        >
          {{ t('footer.backToTop') }}
          <span class="grid size-9 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/15 group-hover:text-white motion-reduce:transition-none">
            <UIcon
              name="i-lucide-arrow-up"
              class="size-5"
            />
          </span>
        </button>
      </div>
    </div>

    <div class="mx-auto flex max-w-7xl flex-wrap justify-between gap-x-6 gap-y-5 border-t border-default px-4 py-8 text-sm text-muted sm:px-8">
      <div class="flex items-center gap-5">
        <p>© {{ year }} Dimitrije Gerenčić</p>
        <a
          v-for="social in socials"
          :key="social.to"
          :href="social.to"
          target="_blank"
          rel="noopener me"
          :aria-label="social.label"
          :style="{ '--brand': social.brand }"
          class="rounded-sm transition-colors hover:text-(--brand) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <UIcon
            :name="social.icon"
            class="block size-5"
          />
        </a>
      </div>
      <p>{{ t('footer.made') }}</p>
    </div>
  </footer>
</template>
