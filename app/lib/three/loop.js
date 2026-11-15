// One requestAnimationFrame loop shared by every 3D scene on the page.
// A scene only renders while its canvas is on screen, and all scenes share one
// clock so their idle animations stay in step (same as the original site).

/**
 * @typedef {(t:number, dt:number) => void} Tick
 * @typedef {{tick:Tick, visible:boolean}} Entry
 */

/** @type {Set<Entry>} */
const entries = new Set()
let raf = 0
let last = 0
let elapsed = 0

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05)
  last = now
  elapsed += dt
  entries.forEach((e) => { if (e.visible) e.tick(elapsed, dt) })
  raf = requestAnimationFrame(frame)
}

/**
 * Adds a scene to the loop. The loop starts with the first scene and stops
 * when the last one leaves.
 * @param {Element} el     Element whose visibility gates rendering (the canvas)
 * @param {Tick} tick      Called every frame while `el` is on screen
 * @param {boolean} [startVisible=false]
 * @returns {() => void}   Removes the scene again
 */
export function addToLoop(el, tick, startVisible = false) {
  /** @type {Entry} */
  const entry = { tick, visible: startVisible }
  const io = new IntersectionObserver((es) => { entry.visible = es[0].isIntersecting })
  io.observe(el)
  entries.add(entry)
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  return () => {
    io.disconnect()
    entries.delete(entry)
    if (!entries.size && raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}
