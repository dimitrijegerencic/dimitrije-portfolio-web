<script setup lang="ts">
const { t } = useI18n()
const years = useExperienceYears()

const facts = computed(() => [
  { label: t('about.facts.basedLabel'), value: t('about.facts.based') },
  { label: t('about.facts.experienceLabel'), value: t('about.facts.experience', years) },
  { label: t('about.facts.focusLabel'), value: t('about.facts.focus') },
  { label: t('about.facts.filmsLabel'), value: t('about.facts.films'), note: t('about.facts.filmsNote') }
])
</script>

<template>
  <section
    id="about"
    data-spy="#about"
    aria-labelledby="about-title"
    class="scroll-mt-20 py-24 sm:py-32"
  >
    <div class="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
      <!-- The photo has no hard edge: it dissolves into the page over a faint garnet glow -->
      <div class="relative mx-auto w-full max-w-md lg:max-w-none">
        <div
          aria-hidden="true"
          class="absolute inset-[8%] rounded-full bg-primary opacity-[0.07] blur-3xl dark:opacity-30"
        />
        <img
          src="/dimitrije.webp"
          :alt="t('portrait.alt')"
          width="1200"
          height="1440"
          loading="lazy"
          data-melt
          class="relative block w-full"
        >
      </div>

      <div>
        <h2
          id="about-title"
          class="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] font-extrabold text-balance text-highlighted uppercase max-sm:text-center"
        >
          {{ t('about.title') }}
        </h2>

        <div class="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-muted sm:text-xl">
          <!-- The only place the full name appears in the page itself -->
          <i18n-t
            keypath="about.intro"
            tag="p"
            scope="global"
            class="font-medium text-highlighted"
          >
            <template #name>
              <span class="text-primary">Dimitrije Gerenčić</span>
            </template>
          </i18n-t>
          <p
            v-for="key in ['p1', 'p2', 'p3', 'p4']"
            :key="key"
          >
            {{ t(`about.${key}`) }}
          </p>
        </div>

        <dl class="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-default pt-6 sm:grid-cols-4">
          <div
            v-for="fact in facts"
            :key="fact.label"
          >
            <dt class="text-sm text-muted">
              {{ fact.label }}
            </dt>
            <dd class="mt-1 font-display text-2xl font-bold text-highlighted sm:text-3xl">
              {{ fact.value }}
            </dd>
            <dd
              v-if="fact.note"
              class="mt-1 text-xs text-muted"
            >
              {{ fact.note }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Soft masks multiplied: an oval vignette, a fade on each side and a long one at the bottom */
[data-melt] {
  mask-image:
    radial-gradient(ellipse 68% 64% at 50% 42%, #000 55%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 12%, #000 62%, transparent 98%),
    linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%);
  mask-composite: intersect;
}

/* On white the fade reads as a haze, so the light theme keeps a shorter melt */
:root:not(.dark) [data-melt] {
  mask-image:
    radial-gradient(ellipse 78% 74% at 50% 42%, #000 68%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 6%, #000 74%, transparent 100%),
    linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
}
</style>
