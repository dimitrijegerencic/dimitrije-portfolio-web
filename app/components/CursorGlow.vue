<script setup lang="ts">
// A soft garnet light that trails the pointer. It sits above the ridges but below the
// content layers (z-10), so it lights the mountains and never the photo or text.
// Mouse and trackpad only.
const glow = ref<HTMLDivElement>()
const visible = ref(false)

let target = { x: 0, y: 0 }
let current = { x: 0, y: 0 }
let frame = 0
let reduce = false

function render() {
  // Ease towards the pointer so the light lags a little behind it
  const ease = reduce ? 1 : 0.14
  current.x += (target.x - current.x) * ease
  current.y += (target.y - current.y) * ease
  glow.value?.style.setProperty('--x', `${current.x}px`)
  glow.value?.style.setProperty('--y', `${current.y}px`)

  const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5
  frame = settled ? 0 : requestAnimationFrame(render)
}

function onMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  target = { x: event.clientX, y: event.clientY }
  if (!visible.value) {
    // Start at the pointer instead of sliding in from the corner
    current = { ...target }
    visible.value = true
  }
  if (!frame) frame = requestAnimationFrame(render)
}

function onLeave() {
  visible.value = false
}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <div
    ref="glow"
    aria-hidden="true"
    data-glow
    :data-visible="visible || undefined"
    class="pointer-events-none fixed inset-0 z-1"
  />
</template>

<style scoped>
[data-glow] {
  opacity: 0;
  transition: opacity 0.6s ease;
  background: radial-gradient(
    560px circle at var(--x, 50%) var(--y, 50%),
    /* The brighter garnet tints white cleanly; the dark one turns muddy under multiply */
    color-mix(in oklab, var(--color-garnet-400) 13%, transparent),
    transparent 65%
  );
  mix-blend-mode: multiply;
}

:root.dark [data-glow] {
  background: radial-gradient(
    560px circle at var(--x, 50%) var(--y, 50%),
    color-mix(in oklab, var(--ui-primary) 22%, transparent),
    transparent 65%
  );
  mix-blend-mode: screen;
}

[data-glow][data-visible] {
  opacity: 1;
}
</style>
