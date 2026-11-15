<script setup>
// The 3D stage: the model on a turntable, lighting presets, spin, prev/next.
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('~/data/catalog.js').CatalogItem>} */
  item: { type: Object, required: true },
  category: { type: String, required: true },
  /** 0-based position of `item` in its list, for the counter. */
  position: { type: Number, required: true },
  total: { type: Number, required: true },
})
const emit = defineEmits(['tally', 'step'])

const LIGHTS = [
  { id: 'day', label: 'Day' },
  { id: 'dusk', label: 'Dusk' },
  { id: 'night', label: 'Night' },
]

const canvas = ref(null)
/** @type {import('vue').Ref<'day'|'dusk'|'night'>} */
const light = ref('day')
const spin = ref(true)
const hint = ref('Drag to rotate · scroll to zoom')
const lightStore = useStoredChoice('ww-light')

const pad = (n) => String(n).padStart(2, '0')

/** @type {import('~/lib/three/viewer.js').Viewer|null} */
let viewer = null
let unmounted = false

function showCurrent() {
  if (viewer) emit('tally', viewer.show(props.item, props.category))
}

onMounted(async () => {
  if (matchMedia('(pointer: coarse)').matches || innerWidth < 700) hint.value = 'Swipe sideways to rotate · pinch to zoom'
  const saved = lightStore.read()
  if (LIGHTS.some((l) => l.id === saved)) light.value = saved
  spin.value = !prefersReducedMotion()
  try {
    const { createViewer } = await import('~/lib/three/viewer.js')
    if (unmounted) return
    viewer = createViewer(canvas.value, { light: light.value, spin: spin.value })
    showCurrent()
  } catch (err) {
    console.warn('Wildwood: 3D viewer unavailable', err)
  }
})

watch(() => props.item, showCurrent)
watch(light, (m) => { viewer?.setLight(m); lightStore.write(m) })
watch(spin, (on) => viewer?.setSpin(on))

onBeforeUnmount(() => {
  unmounted = true
  viewer?.dispose()
  viewer = null
})
</script>

<template>
  <div class="stage" :data-light="light">
    <canvas id="viewer" ref="canvas" role="img" aria-label="3D model viewer" />
    <div class="stage-tools">
      <div class="seg" role="group" aria-label="Lighting">
        <button
          v-for="l in LIGHTS"
          :key="l.id"
          type="button"
          :aria-pressed="light === l.id ? 'true' : 'false'"
          @click="light = l.id"
        >{{ l.label }}</button>
      </div>
      <button type="button" class="icon-btn" :aria-pressed="spin ? 'true' : 'false'" aria-label="Turntable" @click="spin = !spin">
        <svg class="pause" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" /><rect x="8.5" y="1" width="3.5" height="12" /></svg>
        <svg class="play" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1l10 6-10 6z" /></svg>
      </button>
      <button type="button" class="icon-btn" aria-label="Previous model" @click="emit('step', -1)">
        <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9.5 1L3.5 7l6 6 1.4-1.4L6.3 7l4.6-4.6z" /></svg>
      </button>
      <button type="button" class="icon-btn" aria-label="Next model" @click="emit('step', 1)">
        <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M4.5 1l6 6-6 6-1.4-1.4L7.7 7 3.1 2.4z" /></svg>
      </button>
    </div>
    <div class="count">{{ pad(position + 1) }} / {{ pad(total) }}</div>
    <div class="hint">{{ hint }}</div>
  </div>
</template>
