<script setup lang="ts">
const { t, te, tm, rt, locale } = useI18n()

interface Feature {
  name: string
  description: string
}

interface Project {
  // Language-neutral id, used to find the project's mark
  key?: string
  name: string
  description: string
  tech: string[]
  // Notable parts of a project, shown nested under it
  features: Feature[]
}

interface Entry {
  key: string
  company: string
  url: string
  logo: string
  start: number
  end: number | null
  // Optional exact months (1–12), shown under the years
  startMonth?: number
  endMonth?: number
}

// Newest first, so where I am now is the first thing you see. Text lives in the locale files; logos and dates live here.
const entries: Entry[] = [
  { key: 'codeus', company: 'Codeus', url: 'https://codeus.me', logo: '/logos/codeus.svg', start: 2023, end: null, startMonth: 4 },
  { key: 'amplitudo', company: 'Amplitudo', url: 'https://amplitudo.me', logo: '/logos/amplitudo.svg', start: 2022, end: 2023, startMonth: 7, endMonth: 1 },
  { key: 'ucg', company: 'University of Montenegro', url: 'https://www.ucg.ac.me', logo: '/logos/ucg.svg', start: 2019, end: 2022 }
]

// Marks for projects that have one, keyed by the project's key in the locale files.
// Shown in place of the peak bullet, in the text colour with their own colours on hover,
// and never linked to the client's site. A mark is either an icon with a hover colour or
// a logo image; a logo whose detail is white on a solid shape gets a separate cut-out
// mask, so that detail still shows when the mark is drawn in the text colour.
interface ProjectMark {
  // Either an icon with its hover colour...
  icon?: string
  brand?: string
  // ...or a logo image
  src?: string
  mask?: string
}

const projectMarks: Record<string, ProjectMark> = {
  'healthcare': { icon: 'i-lucide-stethoscope', brand: '#16A34A' },
  'precise': { src: '/logos/precise.png', mask: '/logos/precise-mask.png' },
  'equate': { src: '/logos/equate.png' },
  'codeus-site': { src: '/logos/codeus.svg' },
  'vjeronauka': { src: '/logos/vjeronauka.svg' }
}

function markOf(project: Project): ProjectMark | undefined {
  return project.key ? projectMarks[project.key] : undefined
}

const roles = computed(() => entries.map(entry => ({
  ...entry,
  current: entry.end === null,
  // A translated name wins where one exists (e.g. the university)
  company: te(`work.roles.${entry.key}.company`) ? t(`work.roles.${entry.key}.company`) : entry.company,
  role: t(`work.roles.${entry.key}.role`),
  summary: t(`work.roles.${entry.key}.summary`),
  projects: (tm(`work.roles.${entry.key}.projects`) as unknown as Record<keyof Project, unknown>[]).map(p => ({
    key: p.key ? rt(p.key as string) : undefined,
    name: rt(p.name as string),
    description: rt(p.description as string),
    tech: (p.tech as string[]).map(item => rt(item)),
    features: ((p.features ?? []) as Record<keyof Feature, string>[]).map(f => ({
      name: rt(f.name),
      description: rt(f.description)
    }))
  })) as Project[]
})))

// On phones each project folds down to its name, so the timeline reads as a list
// you can scan and open, instead of one very long scroll. Wider screens show everything.
const narrow = ref(false)
const opened = ref(new Set<string>())

function projectId(roleKey: string, project: Project) {
  return `project-${roleKey}-${project.key ?? project.name.toLowerCase().replace(/\W+/g, '-')}`
}

function toggle(id: string) {
  const next = new Set(opened.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  opened.value = next
}

function isShown(id: string) {
  return !narrow.value || opened.value.has(id)
}

let query: MediaQueryList | undefined
const onQuery = () => {
  narrow.value = !!query?.matches
}

onMounted(() => {
  // Below Tailwind's md breakpoint
  query = window.matchMedia('(max-width: 47.99rem)')
  onQuery()
  query.addEventListener('change', onQuery)
})

onBeforeUnmount(() => query?.removeEventListener('change', onQuery))

// "2023 – now", "2022" for a single year, "2020 – 2022" for a range
function period(start: number, end: number | null) {
  if (end === null) return { from: start, to: t('work.now') }
  return start === end ? { from: start, to: null } : { from: start, to: end }
}

// "Jul 2022 – Jan 2023", with month names in the page language
function months(entry: Entry) {
  if (!entry.startMonth) return null
  const format = (year: number, month: number) => new Intl.DateTimeFormat(locale.value === 'me' ? 'sr-Latn-ME' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
  const from = format(entry.start, entry.startMonth)
  const to = entry.end !== null && entry.endMonth ? format(entry.end, entry.endMonth) : t('work.now')
  return `${from} – ${to}`
}
</script>

<template>
  <section
    id="work"
    data-spy="#work"
    aria-labelledby="work-title"
    class="scroll-mt-20 pb-24 sm:pb-32"
  >
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
      <h2
        id="work-title"
        class="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.92] font-extrabold text-balance text-highlighted uppercase max-sm:text-center"
      >
        {{ t('work.title') }}
      </h2>

      <ol class="mt-12">
        <li
          v-for="item in roles"
          :key="item.key"
          class="relative grid gap-6 pb-16 pl-8 last:pb-4 lg:grid-cols-[14rem_1fr] lg:gap-12 lg:pl-0"
        >
          <!-- Timeline rail: lit at the current role, cooling and fading into the past -->
          <span
            aria-hidden="true"
            class="absolute top-3 bottom-0 left-[5px] w-px bg-linear-to-b to-transparent lg:left-[calc(14rem+1.5rem-0.5px)]"
            :class="item.current ? 'from-primary to-accented!' : 'from-accented'"
          />
          <span
            aria-hidden="true"
            class="absolute top-1.5 left-0 flex size-[11px] lg:left-[calc(14rem+1.5rem-5.5px)]"
          >
            <span
              class="relative size-full rounded-full border-2"
              :class="item.current ? 'border-primary bg-primary' : 'border-accented bg-default'"
            />
          </span>

          <div>
            <p class="flex items-center gap-3 font-display text-3xl leading-none font-bold text-highlighted tabular-nums sm:text-4xl">
              <!-- Pulses before the current period, like an "I'm here" marker -->
              <span
                v-if="item.current"
                aria-hidden="true"
                class="relative hidden size-2.5 shrink-0 lg:inline-flex"
              >
                <span class="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
                <span class="relative size-full rounded-full bg-primary" />
              </span>
              <span>
                {{ period(item.start, item.end).from }}<template v-if="period(item.start, item.end).to !== null">
                  <span class="text-muted"> – </span>{{ period(item.start, item.end).to }}
                </template>
              </span>
            </p>
            <p
              v-if="months(item)"
              class="mt-2 text-sm text-muted"
              :class="item.current && 'lg:pl-5.5'"
            >
              {{ months(item) }}
            </p>
          </div>

          <div class="lg:pl-12">
            <a
              :href="item.url"
              target="_blank"
              rel="noopener"
              data-company
              class="group inline-flex items-center gap-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <!-- Mark drawn in the text colour; its own colours fade in on hover -->
              <span class="relative block h-9 w-12 shrink-0">
                <span
                  aria-hidden="true"
                  class="absolute inset-0 bg-current text-highlighted transition-opacity duration-300 group-hover:opacity-0"
                  :style="{ maskImage: `url(${item.logo})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }"
                />
                <img
                  :src="item.logo"
                  alt=""
                  class="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
              </span>
              <span class="font-display text-4xl leading-none font-extrabold text-highlighted sm:text-5xl">
                {{ item.company }}
              </span>
            </a>

            <p class="mt-4 text-lg font-medium text-highlighted">
              {{ item.role }}
            </p>
            <p class="mt-1 max-w-2xl text-lg leading-relaxed text-muted">
              {{ item.summary }}
            </p>

            <ul
              v-if="item.projects.length"
              class="mt-8 border-t border-default"
            >
              <li
                v-for="project in item.projects"
                :key="project.name"
                class="grid gap-3 border-b border-default py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8 md:py-10"
              >
                <h3 class="font-display text-2xl leading-tight font-bold text-highlighted sm:text-3xl">
                  <!-- A button on phones, where the project folds; plain text everywhere else -->
                  <component
                    :is="narrow ? 'button' : 'span'"
                    :type="narrow ? 'button' : undefined"
                    :aria-expanded="narrow ? opened.has(projectId(item.key, project)) : undefined"
                    :aria-controls="narrow ? `${projectId(item.key, project)}-body` : undefined"
                    class="group flex w-full gap-3 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    :class="narrow && 'cursor-pointer'"
                    @click="narrow && toggle(projectId(item.key, project))"
                  >
                    <!-- The project's mark in the text colour, its own colours on hover, like the company logos -->
                    <UIcon
                      v-if="markOf(project)?.icon"
                      :name="markOf(project)!.icon!"
                      :style="{ '--brand': markOf(project)!.brand }"
                      aria-hidden="true"
                      class="mt-[0.05em] size-7 shrink-0 transition-colors duration-300 group-hover:text-(--brand) sm:size-8"
                    />
                    <span
                      v-else-if="markOf(project)?.src"
                      aria-hidden="true"
                      class="relative mt-[0.05em] block size-7 shrink-0 sm:size-8"
                    >
                      <span
                        class="absolute inset-0 bg-current transition-opacity duration-300 group-hover:opacity-0"
                        :style="{ maskImage: `url(${markOf(project)!.mask ?? markOf(project)!.src})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }"
                      />
                      <img
                        :src="markOf(project)!.src"
                        alt=""
                        class="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                    </span>
                    <!-- Otherwise a small peak, echoing the ridge, marks where each project starts -->
                    <span
                      v-else
                      aria-hidden="true"
                      class="mt-[0.3em] size-3 shrink-0 bg-primary [clip-path:polygon(50%_0,100%_100%,0_100%)] sm:size-3.5"
                    />
                    <span class="grow">{{ project.name }}</span>
                    <UIcon
                      v-if="narrow"
                      name="i-lucide-chevron-down"
                      aria-hidden="true"
                      class="mt-[0.15em] size-6 shrink-0 text-muted transition-transform duration-300 motion-reduce:transition-none"
                      :class="opened.has(projectId(item.key, project)) && 'rotate-180 text-primary'"
                    />
                  </component>
                </h3>
                <div
                  v-show="isShown(projectId(item.key, project))"
                  :id="`${projectId(item.key, project)}-body`"
                >
                  <!-- A blank line in the description starts a new paragraph -->
                  <p
                    v-for="(paragraph, i) in project.description.split('\n\n')"
                    :key="i"
                    class="text-base leading-relaxed text-muted not-first:mt-3 sm:text-lg"
                  >
                    {{ paragraph }}
                  </p>
                  <ul
                    v-if="project.tech.length"
                    class="mt-3 flex flex-wrap gap-2"
                  >
                    <li
                      v-for="tech in project.tech"
                      :key="tech"
                      class="rounded-full border border-default px-3 py-0.5 text-sm text-toned"
                    >
                      {{ tech }}
                    </li>
                  </ul>
                </div>

                <!-- Highlights span the full project width, side by side -->
                <div
                  v-if="project.features.length"
                  v-show="isShown(projectId(item.key, project))"
                  class="mt-3 grid gap-6 sm:grid-cols-2 md:col-span-2 md:mt-4 md:gap-8"
                >
                  <div
                    v-for="feature in project.features"
                    :key="feature.name"
                    class="border-l-2 border-primary pl-4"
                  >
                    <h4 class="font-display text-xl leading-tight font-bold text-highlighted sm:text-2xl">
                      {{ feature.name }}
                    </h4>
                    <p class="mt-1 text-base leading-relaxed text-muted">
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
