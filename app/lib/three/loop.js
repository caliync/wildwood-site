// One requestAnimationFrame loop shared by every 3D scene on the page.
// A scene only renders while its canvas is on screen, and all scenes share one
// clock so their idle animations stay in step (same as the original site).
//
// Two safety nets:
// - A scene that throws is dropped from the loop (and logged once) instead of
//   stopping every other scene with it.
// - If frames stay slow, visible scenes are asked to lower their resolution,
//   one step at a time, so weaker laptops and phones stay smooth.

/**
 * @typedef {(t:number, dt:number) => void} Tick
 * @typedef {Object} LoopOptions
 * @property {boolean} [visible=false]  Render before the first visibility check
 * @property {() => boolean} [degrade]  Lower quality one step. Return false when there is nothing left to lower.
 * @typedef {{tick:Tick, visible:boolean, degrade?:() => boolean, done?:boolean}} Entry
 */

/** Frames slower than this (ms, smoothed) count as slow: about 40 fps. */
const SLOW_MS = 25
/** How long frames must stay slow before lowering quality, and the pause between steps (ms). */
const SLOW_FOR = 2000

/** @type {Set<Entry>} */
const entries = new Set()
let raf = 0
let last = 0
let elapsed = 0
let avg = 16.7
let slowSince = 0

/** @param {number} now */
function adapt(now) {
  if (avg <= SLOW_MS) { slowSince = 0; return }
  if (!slowSince) { slowSince = now; return }
  if (now - slowSince < SLOW_FOR) return
  slowSince = now
  entries.forEach((e) => {
    if (e.visible && e.degrade && !e.done) e.done = !e.degrade()
  })
}

/** @param {number} now */
function frame(now) {
  raf = requestAnimationFrame(frame)
  const ms = now - last
  last = now
  const dt = Math.min(ms / 1000, 0.05)
  elapsed += dt
  let drew = false
  entries.forEach((e) => {
    if (!e.visible) return
    drew = true
    try {
      e.tick(elapsed, dt)
    } catch (err) {
      console.error('Wildwood: a 3D scene stopped after an error', err)
      entries.delete(e)
    }
  })
  // Ignore long gaps (tab in the background, a stall while a model builds).
  if (drew && ms < 250) {
    avg += (ms - avg) * 0.05
    adapt(now)
  }
}

/**
 * Adds a scene to the loop. The loop starts with the first scene and stops
 * when the last one leaves.
 * @param {Element} el     Element whose visibility gates rendering (the canvas)
 * @param {Tick} tick      Called every frame while `el` is on screen
 * @param {LoopOptions} [opts]
 * @returns {() => void}   Removes the scene again
 */
export function addToLoop(el, tick, opts = {}) {
  /** @type {Entry} */
  const entry = { tick, visible: !!opts.visible, degrade: opts.degrade }
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

/**
 * Standard quality step for a renderer: lower its pixel ratio by a fifth, down
 * to `floor`. The scene's own `fit()` picks up the new size on the next frame.
 * @param {import('three').WebGLRenderer} r
 * @param {number} [floor=0.75]
 * @returns {boolean} false when already at the floor
 */
export function lowerPixelRatio(r, floor = 0.75) {
  const now = r.getPixelRatio()
  if (now <= floor + 0.01) return false
  r.setPixelRatio(Math.max(floor, now * 0.8))
  return true
}
