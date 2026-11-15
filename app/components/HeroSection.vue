<script setup>
// Full-screen forest hero. The 3D scene loads after the page is interactive;
// once its first frame is up, the loader fades and the title comes in.
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { PLAY_URL } from '~/data/site.js'

const TITLE = 'WILDWOOD'

const { gsap } = useGsap()
const root = ref(null)
const canvas = ref(null)
const loaderText = ref('ENTERING THE FOREST')
const loaderDone = ref(false)
/** Film grain is a random noise tile drawn once on the client. */
const grainStyle = ref({})

/** Scroll progress through the hero (0 to 1), read by the scene to push the camera in. */
const push = { v: 0 }

const motion = useGsapContext(root, () => {
  gsap.to(push, { v: 1, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: 0.6 } })
})

let introDone = false
function intro() {
  if (introDone) return
  introDone = true
  motion.add(() => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.hero-copy .label', { opacity: 1, duration: 0.8 }, 0.2)
      .to('.title .ch', { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.3)
      .to('.tagline', { opacity: 1, duration: 0.9 }, 0.9)
      .to('.hero-cta', { opacity: 1, duration: 0.9 }, 1.15)
  })
}

function drawGrain() {
  const c = document.createElement('canvas')
  c.width = c.height = 160
  const x = c.getContext('2d')
  const d = x.createImageData(160, 160)
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v
    d.data[i + 3] = 255
  }
  x.putImageData(d, 0, 0)
  try { grainStyle.value = { backgroundImage: `url(${c.toDataURL()})` } } catch { /* canvas blocked */ }
}

/** @type {(() => void)|null} */
let dispose = null
let unmounted = false
let fallback = 0
let failTimer = 0

function ready() {
  loaderDone.value = true
  intro()
}

onMounted(async () => {
  drawGrain()
  // If the scene is slow or never draws, still show the title.
  fallback = setTimeout(intro, 6000)
  try {
    const { createHeroScene } = await import('~/lib/three/hero.js')
    if (unmounted) return
    dispose = createHeroScene(canvas.value, { push, onFirstFrame: ready })
  } catch (err) {
    console.warn('Wildwood: 3D forest unavailable', err)
    loaderText.value = '3D VIEW UNAVAILABLE'
    failTimer = setTimeout(ready, 1500)
  }
})

onBeforeUnmount(() => {
  unmounted = true
  clearTimeout(fallback)
  clearTimeout(failTimer)
  dispose?.()
})
</script>

<template>
  <header id="top" ref="root" class="hero">
    <canvas id="hero" ref="canvas" role="img" aria-label="A misty pine forest at dusk with a campfire burning in a clearing" />
    <div class="grain" :style="grainStyle" aria-hidden="true" />
    <div class="hero-copy">
      <div class="wrap">
        <div class="label">Wildwood Farm · A cozy survival taming game</div>
        <h1 class="title" aria-label="Wildwood">
          <span aria-hidden="true"><span v-for="(ch, i) in TITLE" :key="i" class="ch">{{ ch }}</span></span>
        </h1>
        <p class="tagline">Befriend forest animals, grow your farm, and survive the night.</p>
        <div class="hero-cta">
          <a class="btn primary" :href="PLAY_URL" target="_blank" rel="noopener">Play the demo</a>
          <a class="btn" href="#showcase">See the world</a>
        </div>
      </div>
    </div>
    <div class="scroll">Scroll</div>
    <div class="loader" :class="{ done: loaderDone }" role="status"><span>{{ loaderText }}</span></div>
  </header>
</template>
