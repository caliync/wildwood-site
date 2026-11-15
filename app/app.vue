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

/**
 * Lands on the section named in the URL (#world, #showcase...). The browser's own
 * jump gets interrupted while the app starts and ScrollTrigger measures, so the
 * page used to stop near the top instead.
 */
function jumpToHash() {
  let id = location.hash.slice(1)
  try { id = decodeURIComponent(id) } catch { /* malformed escape: use it as written */ }
  const el = id && document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'instant' })
}

// Fonts and images shift the layout after load, so re-measure triggers then.
function refresh() {
  ScrollTrigger.refresh()
  jumpToHash()
}
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
