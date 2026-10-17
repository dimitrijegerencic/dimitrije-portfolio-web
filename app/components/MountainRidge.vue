<script setup lang="ts">
// Contour lines of a stylised ridge: low valley on one side, peaks on the other.
// Deterministic so server and client render the same SVG.
const props = withDefaults(defineProps<{
  /** Peaks on the left instead of the right */
  mirror?: boolean
  /** Wait until the ridge scrolls into view before drawing it */
  drawOnView?: boolean
  /** Shift the contour layers slightly with the pointer */
  parallax?: boolean
  /** viewBox height; lower values give a flatter, wider ridge */
  height?: number
}>(), {
  mirror: false,
  drawOnView: false,
  parallax: false,
  height: 640
})

const W = 1600
const H = props.height
const LAYERS = 10

const keyPoints: [number, number][] = [
  [0, 0.02], [0.1, 0.035], [0.18, 0.025], [0.26, 0.05], [0.32, 0.04],
  [0.4, 0.09], [0.45, 0.12], [0.5, 0.3], [0.55, 0.3], [0.6, 0.52],
  [0.64, 0.44], [0.69, 0.7], [0.72, 0.62], [0.76, 0.94], [0.79, 0.78],
  [0.82, 0.85], [0.86, 0.6], [0.9, 0.67], [0.94, 0.46], [0.97, 0.52],
  [1, 0.4]
]

function elevation(t: number) {
  const i = keyPoints.findIndex(([x]) => x >= t)
  if (i <= 0) return keyPoints[0]![1]
  const [x0, y0] = keyPoints[i - 1]!
  const [x1, y1] = keyPoints[i]!
  const base = y0 + ((t - x0) / (x1 - x0)) * (y1 - y0)
  const grain = 0.012 * Math.sin(t * 140) + 0.008 * Math.sin(t * 370 + 1)
  return Math.max(0, base + grain * base)
}

// The flat valley runs on past the viewBox so wide screens never show an edge
const EXTEND = 1200
const start = props.mirror ? 0 : -EXTEND
const end = props.mirror ? W + EXTEND : W

const lines = Array.from({ length: LAYERS }, (_, layer) => {
  const scale = 1 - layer / LAYERS
  let d = ''
  for (let x = start; x <= end; x += 8) {
    const t = props.mirror ? 1 - x / W : x / W
    const y = H - elevation(t) * scale * H * 0.92
    d += `${x === start ? 'M' : 'L'}${x} ${y.toFixed(1)}`
  }
  return { d, layer }
})

const root = ref<HTMLDivElement>()
const svg = ref<SVGSVGElement>()
const waiting = ref(props.drawOnView)

let observer: IntersectionObserver | undefined
let frame = 0

function onPointerMove(event: PointerEvent) {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const shift = (event.clientX / window.innerWidth - 0.5) * 2
    svg.value?.style.setProperty('--shift', shift.toFixed(3))
  })
}

onMounted(() => {
  if (props.drawOnView && root.value) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        waiting.value = false
        observer?.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(root.value)
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (props.parallax && !reduce) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <div
    ref="root"
    class="relative overflow-hidden"
  >
    <!-- Sized by height and pinned to the peak side, so the summit is never cropped -->
    <svg
      ref="svg"
      :viewBox="`0 0 ${W} ${H}`"
      :data-waiting="waiting || undefined"
      aria-hidden="true"
      class="absolute bottom-0 h-full w-auto max-w-none overflow-visible text-primary"
      :class="mirror ? 'left-0' : 'right-0'"
      :style="{ aspectRatio: `${W} / ${H}` }"
    >
      <path
        :d="`${lines[0]!.d}L${end} ${H}L${start} ${H}Z`"
        data-fill
        stroke="none"
      />
      <path
        v-for="line in lines"
        :key="line.layer"
        :d="line.d"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        stroke-linejoin="round"
        :stroke-width="line.layer === 0 ? 2.5 : 1.25"
        :style="{ '--layer': line.layer, 'opacity': line.layer === 0 ? 1 : 0.75 - line.layer * 0.06 }"
      />
    </svg>
  </div>
</template>

<style scoped>
path[data-fill] {
  fill: color-mix(in oklab, var(--ui-primary) 7%, var(--ui-bg));
}

/* Deeper layers move further, so the ridge reads as layered terrain */
path:not([data-fill]) {
  transform: translateX(calc(var(--shift, 0) * (var(--layer) + 1) * 3px));
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: no-preference) {
  path[data-fill] {
    opacity: 0;
  }

  path:not([data-fill]) {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
  }

  svg:not([data-waiting]) path[data-fill] {
    animation: rise 1.2s ease-out 1.1s forwards;
  }

  svg:not([data-waiting]) path:not([data-fill]) {
    animation: draw 2.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
    animation-delay: calc(0.15s + var(--layer) * 0.11s);
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes rise {
  to {
    opacity: 1;
  }
}
</style>
