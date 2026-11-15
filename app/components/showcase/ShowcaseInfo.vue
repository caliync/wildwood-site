<script setup>
// Name, tag, description and stats for the model on screen.
import { computed } from 'vue'
import { wRate } from '~/data/weapons.js'

const props = defineProps({
  /** @type {import('vue').PropType<import('~/data/catalog.js').CatalogItem>} */
  item: { type: Object, required: true },
  category: { type: String, required: true },
  /** Extra rows the 3D model reports for animals and buildings. */
  tally: { type: Object, default: () => ({}) },
})

/** Orange for late tiers and legendaries, red for anything that bites. */
const pillClass = computed(() => {
  const t = props.item.tag
  if (t === 'Legendary' || /^Tier [45]/.test(t)) return 'planned'
  if (/Boss|Hostile|Weather/.test(t)) return 'boss'
  return ''
})

// Weapons get 1 to 5 ratings, drawn as bars. They come from the game data, so
// they show even if 3D is unavailable.
const ratings = computed(() => (props.category === 'weapons' ? Object.entries(wRate(props.item.model, props.item.variant)) : []))
const extras = computed(() => (props.category === 'weapons' ? [] : Object.entries(props.tally).map(([k, v]) => [k, String(v)])))
</script>

<template>
  <div class="info" aria-live="polite">
    <span class="pill" :class="pillClass">{{ item.tag }}</span>
    <h3>{{ item.name }}</h3>
    <p>{{ item.desc }}</p>
    <dl class="stats">
      <template v-for="[k, v] in item.stats" :key="'s' + k">
        <dt>{{ k }}</dt><dd>{{ v }}</dd>
      </template>
      <template v-for="[k, v] in ratings" :key="'r' + k">
        <dt>{{ k }}</dt>
        <dd>
          <div class="bar-row">
            <div class="bar" role="img" :aria-label="v + ' out of 5'"><i v-for="n in 5" :key="n" :class="{ on: n <= v }" /></div>
            <span class="bar-v" aria-hidden="true">{{ v }}/5</span>
          </div>
        </dd>
      </template>
      <template v-for="[k, v] in extras" :key="'t' + k">
        <dt>{{ k }}</dt><dd>{{ v }}</dd>
      </template>
    </dl>
  </div>
</template>
