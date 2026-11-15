# WILDWOOD

The website for **Wildwood Farm**, my cozy survival taming game.

**🌲 Visit the site:** https://caliync.github.io/wildwood-site/
**▶ Play the game:** https://caliync.github.io/wildwood-farm/

## What's on the site
- A 3D pine forest at dusk. There's a campfire in the clearing, fireflies, an owl on a stump and a bunny hopping around the camp.
- The story and the four pillars: Befriend, Grow, Defend, Forge.
- A field guide with every weapon, animal and building from the game. You can spin and zoom each one. Switch the lights to night and the wolves' eyes, the gate torches and the Moonsteel blade glow.
- A 3D map of the six regions. Click one and the camera flies over to it.

## Tech
Built with [Nuxt](https://nuxt.com/) 4 and Vue 3, [three.js](https://threejs.org/) r128 and [GSAP](https://gsap.com/) with ScrollTrigger. I built all the models in code, so there are no model files to load.

The page is prerendered to static HTML, so the text shows up straight away. The 3D scenes load right after, in their own chunk.

```
app/
  app.vue              the page, and the scroll reveals
  components/          one component per section (nav, hero, story, showcase, world...)
  composables/         useGsap (GSAP + cleanup), useShowcase (shared category, saved choices)
  data/                the field guide, regions and weapon numbers, as plain JS
  lib/three/           the 3D scenes: hero forest, model viewer, world map, and the models
```

## Run it
You need Node 20 or newer.

```
npm install
npm run dev        # http://localhost:3000/wildwood-site/
npm run generate   # static site in .output/public
```

Pushing to `main` builds and publishes the site to GitHub Pages (`.github/workflows/deploy.yml`).

Made by Alli.
