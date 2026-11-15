<script setup>
// Closing call to play.
import { PLAY_URL } from '~/data/site.js'
</script>

<template>
  <section class="cta">
    <div class="wrap">
      <div class="label">Demo available now</div>
      <h2 class="reveal">Your first night starts here.</h2>
      <p>Play Wildwood Farm right in your browser. No download, and your farm saves as you go.</p>
      <div class="hero-cta" style="justify-content:center">
        <a class="btn primary" :href="PLAY_URL" target="_blank" rel="noopener">Play the demo</a>
      </div>
    </div>
  </section>
</template>
