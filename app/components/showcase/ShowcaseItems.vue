<script setup>
// The list of models in the open category. Arrow keys move through it.
import { nextTick } from 'vue'

defineProps({
  /** @type {import('vue').PropType<import('~/data/catalog.js').CatalogItem[]>} */
  items: { type: Array, required: true },
})
const current = defineModel({ type: Number, required: true })
const emit = defineEmits(['step'])

/** @type {HTMLButtonElement[]} buttons in list order */
const buttons = []

const KEYS = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }

/** @param {KeyboardEvent} e */
function onKey(e) {
  const d = KEYS[e.key]
  if (!d) return
  e.preventDefault()
  emit('step', d, true)
}

/**
 * Scrolls item `i` into view (the list scrolls sideways on phones) and
 * optionally focuses it.
 * @param {number} i
 * @param {boolean} focus
 */
async function reveal(i, focus) {
  await nextTick()
  const b = buttons[i]
  if (!b) return
  b.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  if (focus) b.focus()
}

defineExpose({ reveal })
</script>

<template>
  <nav class="items" aria-label="Models" @keydown="onKey">
    <button
      v-for="(it, i) in items"
      :key="it.name"
      :ref="(el) => { buttons[i] = el }"
      :aria-current="i === current ? 'true' : 'false'"
      @click="current = i"
    ><span>{{ it.name }}</span><small>{{ it.tag }}</small></button>
  </nav>
</template>
