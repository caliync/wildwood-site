<script setup>
// A number that counts up from 0 the first time it scrolls into view.
// Server-rendered with the final value, so it reads right without JavaScript.
import { ref } from 'vue'

const props = defineProps({
  /** The number to count up to. */
  to: { type: Number, required: true },
})

const el = ref(null)
/** @type {import('vue').Ref<number>} */
const shown = ref(props.to)

useGsapContext(el, (gsap) => {
  const o = { v: 0 }
  shown.value = 0
  gsap.to(o, {
    v: props.to,
    duration: 1.4,
    ease: 'power2.out',
    scrollTrigger: { trigger: el.value, start: 'top 90%', once: true },
    onUpdate: () => { shown.value = Math.round(o.v) },
  })
})
</script>

<template>
  <strong ref="el">{{ shown }}</strong>
</template>
