<script setup lang="ts">
const { t } = useI18n()

const topics = ['project', 'job', 'other'] as const
type Topic = typeof topics[number]

const form = reactive({
  name: '',
  email: '',
  topic: 'project' as Topic,
  message: '',
  // Honeypot: people never see it, bots tend to fill it in
  website: ''
})

const errors = reactive<{ name?: string, email?: string }>({})
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const sentTo = ref('')

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = form.name.trim() ? undefined : t('contact.errors.name')
  const email = form.email.trim()
  errors.email = !email
    ? t('contact.errors.email')
    : EMAIL.test(email) ? undefined : t('contact.errors.emailInvalid')
  return !errors.name && !errors.email
}

async function submit() {
  if (!validate()) {
    document.getElementById(errors.name ? 'contact-name' : 'contact-email')?.focus()
    return
  }

  status.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    sentTo.value = form.email.trim()
    status.value = 'sent'
    Object.assign(form, { name: '', email: '', topic: 'project', message: '' })
  } catch {
    status.value = 'error'
  }
}

const blank = 'mr-0.5 ml-1.5 inline-block min-w-[5ch] border-b-2 border-dashed border-accented bg-transparent px-1 text-primary transition-colors [field-sizing:content] placeholder:text-dimmed focus:border-solid focus:border-primary focus:outline-none aria-invalid:border-error'
</script>

<template>
  <section
    aria-labelledby="contact-title"
    class="relative overflow-hidden pt-24 sm:pt-32"
  >
    <div class="relative z-10 mx-auto max-w-5xl px-4 sm:px-8">
      <!--
        Jump target for #contact links. On large screens it sits in the middle of the
        heading and letter, so the browser lands with the whole block centred below
        the floating header. On small screens the block is taller than the viewport,
        so it lands at the top instead.
      -->
      <span
        id="contact"
        aria-hidden="true"
        class="pointer-events-none absolute top-0 scroll-mt-24 lg:top-1/2 lg:scroll-mt-[calc(50svh+2.375rem)]"
      />
      <div class="text-center">
        <h2
          id="contact-title"
          class="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] font-extrabold text-balance text-highlighted uppercase"
        >
          {{ t('contact.title') }}
        </h2>
        <p class="mt-4 text-lg text-muted">
          {{ t('contact.intro') }}
        </p>
      </div>

      <form
        novalidate
        class="relative mt-12 rounded-2xl border border-default bg-[color-mix(in_oklab,var(--ui-primary)_4%,var(--ui-bg))] p-6 sm:p-10"
        @submit.prevent="submit"
      >
        <div class="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.9] font-medium text-highlighted">
          <p>{{ t('contact.greeting') }}</p>
          <p class="mt-2">
            {{ t('contact.namePrefix') }}
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="name"
              :placeholder="t('contact.namePlaceholder')"
              :aria-label="t('contact.nameLabel')"
              :aria-invalid="!!errors.name || undefined"
              aria-describedby="contact-errors"
              :class="blank"
            >
            {{ t('contact.topicPrefix') }}
            <span
              role="radiogroup"
              :aria-label="t('contact.topicLabel')"
              class="mr-0.5 ml-1.5 inline-flex flex-wrap gap-2 align-middle"
            >
              <label
                v-for="topic in topics"
                :key="topic"
                class="cursor-pointer rounded-full border px-3.5 py-0.5 font-sans text-[0.55em] leading-normal font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
                :class="form.topic === topic
                  ? 'border-primary bg-primary text-white'
                  : 'border-accented text-muted hover:border-primary hover:text-highlighted'"
              >
                <input
                  v-model="form.topic"
                  type="radio"
                  name="topic"
                  :value="topic"
                  class="sr-only"
                >
                {{ t(`contact.topics.${topic}`) }}
              </label>
            </span>.
            {{ t('contact.emailPrefix') }}
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              name="email"
              autocomplete="email"
              inputmode="email"
              :placeholder="t('contact.emailPlaceholder')"
              :aria-label="t('contact.emailLabel')"
              :aria-invalid="!!errors.email || undefined"
              aria-describedby="contact-errors"
              :class="blank"
            >.
          </p>
        </div>

        <div
          id="contact-errors"
          aria-live="polite"
          class="mt-2 min-h-6 text-base text-error"
        >
          {{ errors.name || errors.email }}
        </div>

        <label
          for="contact-message"
          class="sr-only"
        >
          {{ t('contact.messageLabel') }}
        </label>
        <textarea
          id="contact-message"
          v-model="form.message"
          name="message"
          rows="5"
          :placeholder="t('contact.messagePlaceholder')"
          class="mt-6 block w-full resize-y rounded-xl border-2 border-accented bg-default px-5 py-4 text-lg leading-relaxed text-highlighted transition-colors placeholder:text-dimmed focus:border-primary focus:outline-none"
        />

        <input
          v-model="form.website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          class="absolute -left-[9999px] size-px opacity-0"
        >

        <div class="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div aria-hidden="true">
            <p class="text-base text-muted">
              {{ t('contact.signoff') }}
            </p>
            <p
              class="font-display text-[2rem] leading-tight font-semibold"
              :class="form.name.trim() ? 'text-primary' : 'text-dimmed'"
            >
              {{ form.name.trim() || t('contact.namePlaceholder') }}
            </p>
          </div>

          <UButton
            type="submit"
            size="xl"
            :loading="status === 'sending'"
            class="rounded-lg px-8 text-white"
          >
            {{ status === 'sending' ? t('contact.sending') : t('contact.send') }}
          </UButton>
        </div>

        <p
          role="status"
          class="mt-4 text-right text-base empty:hidden"
          :class="status === 'error' ? 'text-error' : 'text-muted'"
        >
          <template v-if="status === 'sent'">
            {{ t('contact.sent', { email: sentTo }) }}
          </template>
          <template v-else-if="status === 'error'">
            {{ t('contact.error') }}
          </template>
        </p>
      </form>
    </div>

    <div class="relative mt-20 h-64 w-full sm:mt-28 sm:h-80 lg:h-104">
      <MountainRidge
        :height="440"
        mirror
        draw-on-view
        parallax
        class="size-full"
      />
    </div>
  </section>
</template>
