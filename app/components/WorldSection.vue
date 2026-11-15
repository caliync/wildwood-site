<script setup>
// The world map and the panel describing the region you picked.
import { computed, ref } from 'vue'
import { REGIONS } from '~/data/regions.js'

const active = ref(0)
const region = computed(() => REGIONS[active.value])
</script>

<template>
  <section id="world" class="block wrap" style="padding-top:0">
    <div class="show-head reveal">
      <div>
        <div class="label">The world</div>
        <h2 style="margin-bottom:0">Six regions. One creek.</h2>
      </div>
    </div>
    <div class="world reveal">
      <WorldMap v-model="active" :regions="REGIONS" />
      <div class="region" aria-live="polite">
        <div class="label">{{ region.dir }}</div>
        <h3>{{ region.name }}</h3>
        <p>{{ region.desc }}</p>
        <ul><li v-for="line in region.list" :key="line">{{ line }}</li></ul>
      </div>
    </div>
  </section>
</template>
