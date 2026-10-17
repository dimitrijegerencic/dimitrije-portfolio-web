<script setup lang="ts">
const { t } = useI18n()

const words = computed(() => t('hero.tagline').split(' '))
</script>

<template>
  <section
    aria-labelledby="hero-title"
    class="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden"
  >
    <div class="relative z-10 mx-auto w-full max-w-7xl px-4 pt-10 sm:px-8 sm:pt-14 lg:pt-16">
      <div class="max-w-xl lg:max-w-2xl">
        <h1
          id="hero-title"
          class="font-display text-highlighted"
        >
          <i18n-t
            keypath="hero.greeting"
            tag="span"
            scope="global"
            data-greeting
            class="block text-[clamp(2rem,4.5vw,3.5rem)] leading-none font-semibold"
          >
            <template #name>
              <span class="text-primary">Dimitrije</span>
            </template>
          </i18n-t>

          <span class="sr-only">{{ t('hero.tagline') }}</span>
          <span
            :key="t('hero.tagline')"
            aria-hidden="true"
            class="mt-4 block text-[clamp(3.25rem,9vw,7.75rem)] leading-[0.88] font-extrabold tracking-[-0.01em] text-balance uppercase"
          >
            <template
              v-for="(word, i) in words"
              :key="i"
            >
              <span data-word-mask><span
                data-word
                :style="{ '--i': i }"
              >{{ word }}</span></span>{{ ' ' }}
            </template>
          </span>
        </h1>

        <p class="mt-8 max-w-136 text-lg leading-relaxed text-muted sm:text-xl">
          <span class="block">{{ t('hero.role') }}</span>
          <span class="block">{{ t('hero.subtitle') }}</span>
        </p>

        <div class="mt-10 flex flex-wrap gap-3">
          <UButton
            to="#work"
            size="xl"
            class="rounded-lg px-6 text-white"
          >
            {{ t('hero.seeWork') }}
          </UButton>
          <UButton
            to="#contact"
            size="xl"
            color="neutral"
            variant="outline"
            class="rounded-lg px-6"
          >
            {{ t('hero.getInTouch') }}
          </UButton>
        </div>
      </div>
    </div>

    <div class="relative mt-12 h-68 w-full sm:h-88 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:h-[64%]">
      <MountainRidge class="size-full" />
    </div>
  </section>
</template>

<style scoped>
/* Each word rises out of its own line mask, one after another */
[data-word-mask] {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.06em;
  margin-bottom: -0.06em;
  vertical-align: top;
}

[data-word] {
  display: inline-block;
}

@media (prefers-reduced-motion: no-preference) {
  [data-greeting] {
    opacity: 0;
    animation: greet 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
  }

  [data-word] {
    transform: translateY(140%);
    animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: calc(0.45s + var(--i) * 0.08s);
  }
}

@keyframes greet {
  from {
    opacity: 0;
    transform: translateY(0.4em);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes rise {
  to {
    transform: translateY(0);
  }
}
</style>
