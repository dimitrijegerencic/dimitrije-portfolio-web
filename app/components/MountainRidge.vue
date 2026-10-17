<script setup lang="ts">
// Contour lines of a stylised ridge: low valley on the left, peaks on the right.
// Deterministic so server and client render the same SVG.
const W = 1600
const H = 640
const LAYERS = 10

const keyPoints: [number, number][] = [
  [0, 0.02], [0.1, 0.035], [0.18, 0.025], [0.26, 0.05], [0.32, 0.04],
  [0.4, 0.09], [0.45, 0.12], [0.5, 0.3], [0.55, 0.3], [0.6, 0.52],
  [0.64, 0.44], [0.69, 0.7], [0.72, 0.62], [0.76, 0.94], [0.79, 0.78],
  [0.82, 0.85], [0.86, 0.6], [0.9, 0.67], [0.94, 0.46], [0.97, 0.52],
  [1, 0.4]
]

function height(t: number) {
  const i = keyPoints.findIndex(([x]) => x >= t)
  if (i <= 0) return keyPoints[0]![1]
  const [x0, y0] = keyPoints[i - 1]!
  const [x1, y1] = keyPoints[i]!
  const base = y0 + ((t - x0) / (x1 - x0)) * (y1 - y0)
  const grain = 0.012 * Math.sin(t * 140) + 0.008 * Math.sin(t * 370 + 1)
  return Math.max(0, base + grain * base)
}

const lines = Array.from({ length: LAYERS }, (_, layer) => {
  const scale = 1 - layer / LAYERS
  let d = ''
  for (let x = 0; x <= W; x += 8) {
    const y = H - height(x / W) * scale * H * 0.92
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`
  }
  return { d, layer }
})
</script>

<template>
  <svg
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="xMaxYMax slice"
    aria-hidden="true"
    class="text-primary"
  >
    <path
      :d="`${lines[0]!.d}L${W} ${H}L0 ${H}Z`"
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
</template>

<style scoped>
path[data-fill] {
  fill: color-mix(in oklab, var(--ui-primary) 7%, var(--ui-bg));
}

@media (prefers-reduced-motion: no-preference) {
  path[data-fill] {
    opacity: 0;
    animation: rise 1.2s ease-out 1.1s forwards;
  }

  path:not([data-fill]) {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
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
