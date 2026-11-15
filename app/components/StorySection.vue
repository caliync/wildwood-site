<script setup>
// The pitch: what you do in Wildwood, a few headline numbers, and the four pillars.
import { ref } from 'vue'

const FACTS = [
  { n: 6, label: 'Regions' },
  { n: 6, label: 'Animal friends' },
  { n: 5, label: 'Bosses' },
  { n: 10, label: 'Weapon tiers' },
]

const PILLARS = [
  { name: 'Befriend', text: 'Offer the right food and stay still while trust fills. Each animal has its own time of day, place and temper.' },
  { name: 'Grow', text: 'Plant carrots, berries, mushrooms and pumpkins in your plots. Rain makes crops grow twice as fast.' },
  { name: 'Defend', text: 'Wolf packs raid the farm every night. Build gates, watchtowers and spike traps to hold them off.' },
  { name: 'Forge', text: 'Bring enemy drops to the Blacksmith for stronger knives and slings, all the way to Moonsteel and Thunder.' },
]

const root = ref(null)

// Each pillar slides in from the left as it reaches the bottom of the screen.
useGsapContext(root, (gsap) => {
  gsap.utils.toArray('.pillar').forEach((p) => {
    gsap.from(p, { x: -24, opacity: 0.2, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: p, start: 'top 92%', once: true } })
  })
})
</script>

<template>
  <section id="story" ref="root" class="block wrap">
    <div class="story reveal">
      <div>
        <div class="label">The story</div>
        <h2>Befriend the wild. Defend the farm.</h2>
        <p class="lead">You start at the edge of Wildwood with a camp tent, a rusty knife and a twig sling. Bunnies hop through the meadow, squirrels chatter in the Old Oak Grove and owls watch from the stumps at night. You don't catch them. You earn their trust.</p>
        <p class="lead">Grow the food each animal loves, wait for its heart to fill, then carry your new friend home to its pen. Sell their gifts, forge better weapons from wolf fur and boar tusks, and build up your gates before the wolf packs raid the farm at night.</p>
        <div class="facts">
          <div v-for="f in FACTS" :key="f.label"><CountUp :to="f.n" /><small>{{ f.label }}</small></div>
        </div>
      </div>
      <div class="pillars">
        <div v-for="p in PILLARS" :key="p.name" class="pillar"><b>{{ p.name }}</b><span>{{ p.text }}</span></div>
      </div>
    </div>
  </section>
</template>
