<script setup>
// Weapons / Animals / Structures tabs, with arrow-key, Home and End support.
import { CATEGORIES } from '~/data/catalog.js'

const cat = defineModel({ type: String, required: true })
/** @type {HTMLButtonElement[]} tabs in CATEGORIES order */
const tabs = []

const LABELS = { weapons: 'Weapons', animals: 'Animals', structures: 'Structures' }

/**
 * @param {KeyboardEvent} e
 * @param {number} i index of the focused tab
 */
function onKey(e, i) {
  const n = CATEGORIES.length
  const j = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
  if (j === undefined) return
  e.preventDefault()
  tabs[j]?.focus()
  cat.value = CATEGORIES[j]
}
</script>

<template>
  <div class="tabs" role="tablist" aria-label="Showcase category">
    <button
      v-for="(c, i) in CATEGORIES"
      :id="'tab-' + c"
      :key="c"
      :ref="(el) => { tabs[i] = el }"
      role="tab"
      :aria-selected="c === cat ? 'true' : 'false'"
      aria-controls="showpanel"
      :tabindex="c === cat ? 0 : -1"
      @click="cat = c"
      @keydown="onKey($event, i)"
    >{{ LABELS[c] }}</button>
  </div>
</template>
