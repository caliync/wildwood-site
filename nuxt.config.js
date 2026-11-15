// Wildwood is a fully static site: `npm run generate` prerenders it to
// .output/public for GitHub Pages.

// Hides the animated elements before first paint so GSAP can bring them in,
// unless the visitor prefers reduced motion. If the app never boots, the page
// shows everything after 6 seconds instead of staying blank.
const motionGate = `(function(d){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-anim');setTimeout(function(){if(!window.__wwMotion)d.classList.remove('js-anim')},6000)}catch(e){}})(document.documentElement)`

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    // The site is served from https://caliync.github.io/wildwood-site/
    baseURL: process.env.NUXT_APP_BASE_URL || '/wildwood-site/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Wildwood',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' },
        { name: 'description', content: 'Wildwood Farm, a cozy survival taming game. Befriend forest animals, grow your farm, and survive the night.' },
        { name: 'theme-color', content: '#0a0d0c' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Marcellus&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap' },
      ],
      script: [{ innerHTML: motionGate, tagPosition: 'head' }],
    },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
  vite: {
    build: {
      // three.js is about 600 KB on its own; it loads in its own chunk after the page.
      chunkSizeWarningLimit: 900,
    },
  },
})
