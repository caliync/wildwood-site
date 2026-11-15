<script setup>
// The field guide: pick a category, pick an item, spin it in 3D and read its stats.
import { computed, ref, watch } from 'vue'
import { CATALOG } from '~/data/catalog.js'

const cat = useShowcaseCategory()
usePersistedCategory(cat)

const index = ref(0)
/** Extra stat rows the 3D model reports (weapon ratings, building counts). */
const tally = ref({})
const items = ref(null)

const list = computed(() => CATALOG[cat.value])
const item = computed(() => list.value[index.value])

// A new category always opens on its first item.
watch(cat, () => { index.value = 0 })

/**
 * Moves through the list, wrapping at both ends.
 * @param {number} d  +1 or -1
 * @param {boolean} [focus=false]  Move keyboard focus to the new item
 */
function step(d, focus = false) {
  const n = list.value.length
  index.value = (index.value + d + n) % n
  items.value?.reveal(index.value, focus)
}
</script>

<template>
  <section id="showcase" class="block wrap" style="padding-top:0">
    <div class="show-head reveal">
      <div>
        <div class="label">Field guide</div>
        <h2 style="margin-bottom:0">Everything in the wild.</h2>
      </div>
      <ShowcaseTabs v-model="cat" />
    </div>
    <div id="showpanel" class="showcase reveal" role="tabpanel" :aria-labelledby="'tab-' + cat">
      <ShowcaseStage
        :item="item"
        :category="cat"
        :position="index"
        :total="list.length"
        @tally="tally = $event"
        @step="step"
      />
      <div class="side">
        <ShowcaseItems ref="items" v-model="index" :items="list" @step="step" />
        <ShowcaseInfo :item="item" :category="cat" :tally="tally" />
      </div>
    </div>
  </section>
</template>
