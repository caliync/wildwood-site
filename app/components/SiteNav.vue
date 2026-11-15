<script setup>
// Fixed top bar. Turns solid after a little scroll, highlights the section in
// view (and the open field-guide tab), and folds into a menu on phones.
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { NAV_LINKS, MOBILE_LINKS, PLAY_URL } from '~/data/site.js'

const cat = useShowcaseCategory()
const solid = ref(false)
const open = ref(false)
/** @type {import('vue').Ref<string|null>} id of the section in the middle of the screen */
const section = ref(null)
const menuBtn = ref(null)

/**
 * @param {{href:string, tab?:string}} link
 * @returns {boolean}
 */
const isCurrent = (link) => link.href === '#' + section.value && (!link.tab || link.tab === cat.value)

/** @param {{tab?:string}} link */
function follow(link) {
  if (link.tab) cat.value = link.tab
  open.value = false
}

function onScroll() { solid.value = scrollY > 40 }
/** @param {KeyboardEvent} e */
function onKey(e) {
  if (e.key === 'Escape' && open.value) {
    open.value = false
    menuBtn.value?.focus()
  }
}

/** @type {IntersectionObserver|null} */
let io = null
onMounted(() => {
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('keydown', onKey)
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) section.value = e.target.id || null })
  }, { rootMargin: '-45% 0px -50% 0px' })
  document.querySelectorAll('.hero,#story,#showcase,#world,.cta').forEach((el) => io.observe(el))
})
onBeforeUnmount(() => {
  removeEventListener('scroll', onScroll)
  removeEventListener('keydown', onKey)
  io?.disconnect()
})
</script>

<template>
  <nav class="nav" :class="{ solid, open }" aria-label="Main">
    <div class="wrap">
      <a class="logo" href="#top">WILDWOOD</a>
      <ul>
        <li v-for="link in NAV_LINKS" :key="link.label">
          <a :href="link.href" :aria-current="isCurrent(link) ? 'location' : undefined" @click="follow(link)">{{ link.label }}</a>
        </li>
      </ul>
      <button
        ref="menuBtn"
        class="menu-btn"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="mobileMenu"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      ><i /><i /><i /></button>
      <div class="nav-cta">
        <a class="btn primary" :href="PLAY_URL" target="_blank" rel="noopener"><span class="long">Play demo</span><span class="short">Demo</span></a>
      </div>
    </div>
    <div id="mobileMenu" class="mobile-menu" :hidden="!open">
      <a v-for="link in MOBILE_LINKS" :key="link.label" :href="link.href" @click="follow(link)">{{ link.label }}</a>
    </div>
  </nav>
</template>
