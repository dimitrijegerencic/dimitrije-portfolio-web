<script setup lang="ts">
const { t, tm, rt } = useI18n()

const items = computed(() => (tm('now.items') as unknown as { label: string, value: string }[]).map(item => ({
  label: rt(item.label),
  value: rt(item.value)
})))
</script>

<template>
  <section
    id="now"
    aria-labelledby="now-title"
    class="scroll-mt-20 pb-24 sm:pb-32"
  >
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
      <h2
        id="now-title"
        class="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] font-extrabold text-balance text-highlighted uppercase"
      >
        {{ t('now.title') }}
      </h2>

      <dl class="mt-10 border-t border-default">
        <div
          v-for="item in items"
          :key="item.label"
          class="grid gap-2 border-b border-default py-6 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-8"
        >
          <dt class="text-sm text-muted">
            {{ item.label }}
          </dt>
          <dd class="font-display text-2xl leading-snug font-bold text-highlighted sm:text-3xl">
            {{ item.value }}
          </dd>
        </div>
      </dl>

      <p class="mt-4 text-sm text-muted">
        {{ t('now.updated') }}
      </p>
    </div>
  </section>
</template>
