<script setup lang="ts">
const { t, locale } = useI18n()

const links = computed(() => [
  { label: t('nav.work'), to: '#work' },
  { label: t('nav.about'), to: '#about' },
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
  <footer class="relative overflow-hidden bg-garnet-800 text-white dark:bg-garnet-950">
    <div class="mx-auto grid max-w-7xl gap-12 px-4 pt-20 pb-16 sm:grid-cols-3 sm:px-8 sm:pt-28 sm:pb-20">
      <div>
        <p class="text-sm text-white/65">
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
          class="mt-3 flex items-center gap-2.5 text-sm text-white/80"
        >
          <span
            aria-hidden="true"
            class="relative flex size-2"
          >
            <span
              v-if="status === 'desk'"
              class="absolute inset-0 animate-ping rounded-full bg-white/70 motion-reduce:animate-none"
            />
            <span
              class="relative size-2 rounded-full"
              :class="status === 'desk' ? 'bg-white' : 'bg-white/35'"
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
          class="w-fit rounded-sm text-lg font-medium text-white/80 underline-offset-8 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex sm:justify-end">
        <button
          type="button"
          class="group flex h-fit items-center gap-3 rounded-full border border-white/30 py-2 pr-2 pl-5 text-base font-medium transition-colors hover:border-white hover:bg-white hover:text-garnet-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white dark:hover:text-garnet-950"
          @click="scrollToTop"
        >
          {{ t('footer.backToTop') }}
          <span class="grid size-9 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-garnet-800/10 motion-reduce:transition-none">
            <UIcon
              name="i-lucide-arrow-up"
              class="size-5"
            />
          </span>
        </button>
      </div>
    </div>

    <div class="mx-auto flex max-w-7xl flex-wrap justify-between gap-x-6 gap-y-5 border-t border-white/15 px-4 py-8 text-sm text-white/65 sm:px-8">
      <p>© {{ year }} Dimitrije Gerenčić</p>
      <p>{{ t('footer.made') }}</p>
    </div>
  </footer>
</template>
