<script setup>
// The 3D map with a clickable marker pinned over each region. Picking one
// flies the camera over to it.
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineProps({
  /** @type {import('vue').PropType<import('~/data/regions.js').Region[]>} */
  regions: { type: Array, required: true },
})
const active = defineModel({ type: Number, required: true })

const canvas = ref(null)
/** @type {HTMLElement[]} marker buttons in REGIONS order */
const markers = []

/** @type {import('~/lib/three/map.js').WorldMap|null} */
let map = null
let unmounted = false

/** @param {number} i */
function pick(i) {
  active.value = i
  map?.flyTo(i)
}

onMounted(async () => {
  try {
    const { createWorldMap } = await import('~/lib/three/map.js')
    if (unmounted) return
    map = createWorldMap(canvas.value)
    map.setMarkers(markers)
  } catch (err) {
    console.warn('Wildwood: 3D map unavailable', err)
  }
})

onBeforeUnmount(() => {
  unmounted = true
  map?.dispose()
  map = null
})
</script>

<template>
  <div class="mapstage">
    <canvas id="map" ref="canvas" role="img" aria-label="3D map of the Wildwood world" />
    <!-- Hidden until the map has placed them over their regions. -->
    <button
      v-for="(r, i) in regions"
      :key="r.id"
      :ref="(el) => { markers[i] = el }"
      class="marker"
      style="display:none"
      :aria-current="i === active ? 'true' : 'false'"
      @click="pick(i)"
    >{{ r.name }}</button>
  </div>
</template>
