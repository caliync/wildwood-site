import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/**
 * GSAP with ScrollTrigger registered once for the whole app (client only).
 * @returns {{gsap: typeof gsap, ScrollTrigger: typeof ScrollTrigger}}
 */
export function useGsap() {
  if (import.meta.client && !registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return { gsap, ScrollTrigger }
}

/**
 * True when the visitor asked for reduced motion. Always false on the server.
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Runs `setup` inside a gsap.context scoped to `scope` once the component is
 * mounted, and reverts every tween and ScrollTrigger it made on unmount.
 * Skipped entirely when the visitor prefers reduced motion.
 *
 * Animations created later (after an event) can join the same context through
 * the returned `add`, so they are cleaned up too.
 *
 * @param {import('vue').Ref<HTMLElement|null>} scope
 * @param {(g: typeof gsap) => void} [setup]
 * @returns {{add: (fn: () => void) => void}}
 */
export function useGsapContext(scope, setup) {
  const { gsap: g } = useGsap()
  /** @type {gsap.Context|null} */
  let ctx = null

  onMounted(() => {
    if (!scope.value || prefersReducedMotion()) return
    ctx = g.context(() => setup?.(g), scope.value)
  })

  onBeforeUnmount(() => {
    ctx?.revert()
    ctx = null
  })

  return {
    add(fn) {
      if (ctx) ctx.add(fn)
    },
  }
}
