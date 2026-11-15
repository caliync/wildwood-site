<script setup>
// The whole site is one page. Each section is its own component; this file
// wires up the page-wide scroll reveals.
import { onMounted, onBeforeUnmount, ref } from 'vue'

const main = ref(null)
const { ScrollTrigger } = useGsap()

// Fade and lift every `.reveal` block the first time it scrolls into view.
useGsapContext(main, (gsap) => {
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true }),
  })
})

// Fonts and images shift the layout after load, so re-measure triggers then.
const refresh = () => ScrollTrigger.refresh()
onMounted(() => {
  window.__wwMotion = true
  if (document.readyState === 'complete') refresh()
  else addEventListener('load', refresh, { once: true })
})
onBeforeUnmount(() => removeEventListener('load', refresh))
</script>

<template>
  <a class="skip" href="#story">Skip to content</a>
  <SiteNav />
  <HeroSection />
  <main ref="main">
    <StorySection />
    <RobloxSection />
    <ShowcaseSection />
    <WorldSection />
    <CtaSection />
  </main>
  <SiteFooter />
</template>
