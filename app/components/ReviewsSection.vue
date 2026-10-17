<script setup lang="ts">
const { t, tm, rt } = useI18n()

interface Review {
  name: string
  role: string
  text: string
}

const reviews = computed(() => (tm('reviews.items') as unknown as Record<keyof Review, string>[]).map(r => ({
  name: rt(r.name),
  role: rt(r.role),
  text: rt(r.text)
})))

// Start in the middle so there is a card on each side of the focused one
const active = ref(Math.floor(reviews.value.length / 2))

function go(index: number) {
  active.value = Math.min(Math.max(index, 0), reviews.value.length - 1)
}

function initials(name: string) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') go(active.value - 1)
  if (event.key === 'ArrowRight') go(active.value + 1)
}

// Swipe on touch screens
let startX: number | null = null

function onPointerDown(event: PointerEvent) {
  if (event.pointerType !== 'mouse') startX = event.clientX
}

function onPointerUp(event: PointerEvent) {
  if (startX === null) return
  const dx = event.clientX - startX
  if (Math.abs(dx) > 40) go(active.value + (dx < 0 ? 1 : -1))
  startX = null
}
</script>

<template>
  <section
    id="reviews"
    aria-labelledby="reviews-title"
    class="scroll-mt-20 overflow-hidden pb-24 sm:pb-32"
  >
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
      <h2
        id="reviews-title"
        class="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] font-extrabold text-balance text-highlighted uppercase"
      >
        {{ t('reviews.title') }}
      </h2>
      <p class="mt-4 max-w-xl text-lg text-muted">
        {{ t('reviews.intro') }}
      </p>
    </div>

    <!-- Carousel: the focused review sits in the middle, its neighbours peek in on each side -->
    <div
      role="region"
      aria-roledescription="carousel"
      :aria-label="t('reviews.title')"
      tabindex="0"
      data-carousel
      class="relative z-10 mt-12 touch-pan-y focus-visible:outline-none"
      @keydown="onKeydown"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    >
      <ol
        data-track
        class="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        :style="{ '--active': active }"
      >
        <li
          v-for="(review, i) in reviews"
          :key="i"
          role="group"
          aria-roledescription="slide"
          :aria-label="t('reviews.slide', { n: i + 1, total: reviews.length })"
          :aria-hidden="i !== active || undefined"
          data-slide
          class="shrink-0 transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none"
          :class="i === active ? 'scale-100 opacity-100' : 'scale-[0.92] cursor-pointer opacity-40 hover:opacity-60'"
          @click="go(i)"
        >
          <article class="flex h-full flex-col rounded-2xl border border-default bg-[color-mix(in_oklab,var(--ui-primary)_4%,var(--ui-bg))] p-6 sm:p-8">
            <header class="flex items-center gap-3">
              <span
                aria-hidden="true"
                class="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-bold text-white"
              >
                {{ initials(review.name) }}
              </span>
              <p class="text-sm leading-snug text-muted">
                <span class="font-semibold text-highlighted">{{ review.name }}</span>
                {{ t('reviews.approved') }}
                <span class="block">{{ review.role }}</span>
              </p>
            </header>

            <blockquote class="mt-6 grow font-display text-2xl leading-snug font-medium text-highlighted sm:text-[1.65rem]">
              “{{ review.text }}”
            </blockquote>

            <footer class="mt-6 flex items-center gap-2 border-t border-default pt-4 text-sm font-medium text-[#2DA44E]">
              <UIcon
                name="i-lucide-circle-check"
                class="size-5"
              />
              {{ t('reviews.badge') }}
            </footer>
          </article>
        </li>
      </ol>
    </div>

    <div class="relative z-10 mx-auto mt-8 flex max-w-7xl items-center justify-center gap-6 px-4 sm:px-8">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="outline"
        size="lg"
        class="cursor-pointer rounded-full"
        :aria-label="t('reviews.prev')"
        :disabled="active === 0"
        @click="go(active - 1)"
      />

      <div class="flex gap-2">
        <button
          v-for="(_, i) in reviews"
          :key="i"
          type="button"
          class="h-2 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="i === active ? 'w-6 bg-primary' : 'w-2 bg-accented hover:bg-primary/50'"
          :aria-label="t('reviews.slide', { n: i + 1, total: reviews.length })"
          :aria-current="i === active || undefined"
          @click="go(i)"
        />
      </div>

      <UButton
        icon="i-lucide-arrow-right"
        color="neutral"
        variant="outline"
        size="lg"
        class="cursor-pointer rounded-full"
        :aria-label="t('reviews.next')"
        :disabled="active === reviews.length - 1"
        @click="go(active + 1)"
      />
    </div>
  </section>
</template>

<style scoped>
[data-carousel] {
  --slide: min(76vw, 30rem);
  --gap: 1rem;
}

/* Track starts at the viewport centre, then shifts so the active slide's centre lands there */
[data-track] {
  gap: var(--gap);
  margin-left: 50%;
  transform: translateX(calc(-1 * (var(--active) * (var(--slide) + var(--gap)) + var(--slide) / 2)));
}

[data-slide] {
  width: var(--slide);
}

@media (min-width: 640px) {
  [data-carousel] {
    --gap: 1.5rem;
  }
}
</style>
