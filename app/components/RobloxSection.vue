<script setup>
// "Coming to Roblox" pitch. Hidden for now (as on the original site) until the
// Roblox version is ready to announce: remove `hidden` to show it.
import { PLAY_URL } from '~/data/site.js'
</script>

<template>
  <section id="roblox" class="block wrap" style="padding-top:0" hidden>
    <div class="rbx reveal">
      <div class="rbx-copy">
        <div class="label">The full game</div>
        <h2>Wildwood is coming to Roblox.</h2>
        <p class="lead">Wildwood was made for Roblox from the start. The browser demo is a first taste of the world. The Roblox version is the real game, where you tame, survive and build together with your friends.</p>
        <ul class="rbx-list">
          <li><b>Play with friends</b><span>Share a camp, tame animals side by side and hold the line together when the wolves come.</span></li>
          <li><b>Build your camp</b><span>Raise the barn, then add cabins, watchtowers and a palisade gate as you grow.</span></li>
          <li><b>Full-moon hunts</b><span>The whole server gathers when the Alpha Wolf or the Boar King shows up.</span></li>
          <li><b>Play anywhere</b><span>On computer, phone, tablet and console, with your progress saved to your Roblox account.</span></li>
        </ul>
        <div class="hero-cta">
          <span class="btn primary" aria-disabled="true">Coming soon on Roblox</span>
          <a class="btn" :href="PLAY_URL" target="_blank" rel="noopener">Try the web demo</a>
        </div>
      </div>
      <div class="rbx-compare" role="table" aria-label="Web demo compared with the Roblox version">
        <div class="row head" role="row"><span role="columnheader"></span><span role="columnheader">Web demo</span><span role="columnheader">Roblox</span></div>
        <div class="row" role="row"><span role="rowheader">Status</span><span role="cell">Playable now</span><span role="cell" class="hi">In development</span></div>
        <div class="row" role="row"><span role="rowheader">Players</span><span role="cell">Solo</span><span role="cell" class="hi">Multiplayer</span></div>
        <div class="row" role="row"><span role="rowheader">Platforms</span><span role="cell">Web browser</span><span role="cell" class="hi">PC, mobile, console</span></div>
        <div class="row" role="row"><span role="rowheader">Saves</span><span role="cell">This browser</span><span role="cell" class="hi">Roblox account</span></div>
        <div class="row" role="row"><span role="rowheader">Building</span><span role="cell">Barn and well</span><span role="cell" class="hi">Full camp building</span></div>
        <div class="row" role="row"><span role="rowheader">World</span><span role="cell">6 regions</span><span role="cell" class="hi">6 regions and more</span></div>
      </div>
    </div>
  </section>
</template>
