<template>
  <img
    v-if="src"
    :src="src"
    :alt="title || 'Flame'"
    class="flame-img"
    :style="{ width: `${size || 64}px`, height: `${size || 64}px` }"
  />
  <div
    v-else
    class="flame-wrap"
    role="img"
    aria-label="Flame"
    :title="title || 'Streak on fire!'"
    :style="{ '--s': `${size || 64}px` }"
  >
    <span class="flame-emoji" aria-hidden="true">🔥</span>
    <div class="sparks">
      <span class="spark s1"></span>
      <span class="spark s2"></span>
      <span class="spark s3"></span>
      <span class="spark s4"></span>
      <span class="spark s5"></span>
    </div>
    <div class="embers">
      <span class="ember e1"></span>
      <span class="ember e2"></span>
      <span class="ember e3"></span>
      <span class="ember e4"></span>
      <span class="ember e5"></span>
      <span class="ember e6"></span>
      <span class="ember e7"></span>
      <span class="ember e8"></span>
      <span class="ember e9"></span>
      <span class="ember e10"></span>
    </div>
  </div>
  <!-- Uses the original emoji icon with a richer animation.
       Pass a GIF/PNG/WebP via `src` to override. -->
</template>

<script setup lang="ts">
defineProps<{
  size?: number
  title?: string
  src?: string
}>()
</script>

<style scoped>
.flame-img {
  display: inline-block;
  filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.75)) drop-shadow(0 0 16px rgba(255, 69, 0, 0.5));
}

.flame-wrap {
  --s: 64px;
  position: relative;
  width: var(--s);
  height: calc(var(--s) * 1.2);
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(255, 153, 0, 0.7)) drop-shadow(0 0 22px rgba(255, 80, 0, 0.5));
}


.flame-emoji {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--s);
  line-height: 1;
  text-shadow:
    0 0 calc(var(--s) * 0.10) rgba(255, 153, 0, 0.8),
    0 0 calc(var(--s) * 0.20) rgba(255, 90, 0, 0.6);
  transform-origin: 50% 100%;
  animation: flame-lick 1.2s ease-in-out infinite;
}

.flame-wrap::before,
.flame-wrap::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: calc(var(--s) * 0.05);
  transform: translateX(-50%);
  width: calc(var(--s) * 0.9);
  height: calc(var(--s) * 0.9);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 60%, rgba(255, 220, 120, 0.55), rgba(255, 140, 0, 0.35) 60%, rgba(255, 60, 0, 0) 70%);
  filter: blur(calc(var(--s) * 0.08));
  pointer-events: none;
}

.flame-wrap::before { animation: glow-flicker 1.3s ease-in-out infinite; }
.flame-wrap::after  { animation: glow-flicker 1.1s ease-in-out infinite 0.2s; }

@keyframes flame-lick {
  0%   { transform: translate(-50%, 0) scaleY(1) rotate(-2deg); }
  25%  { transform: translate(-50%, -2%) scaleY(1.06) rotate(1deg); }
  50%  { transform: translate(-50%, -1%) scaleY(1.02) rotate(2deg); }
  75%  { transform: translate(-50%, -3%) scaleY(1.08) rotate(-1deg); }
  100% { transform: translate(-50%, 0) scaleY(1) rotate(-2deg); }
}

@keyframes glow-flicker {
  0%   { opacity: 0.65; transform: translateX(-50%) scale(1); }
  50%  { opacity: 0.9;  transform: translateX(-50%) scale(1.06); }
  100% { opacity: 0.7;  transform: translateX(-50%) scale(1.02); }
}

.sparks { position: absolute; inset: 0; pointer-events: none; }
.spark {
  position: absolute;
  bottom: 10%;
  width: calc(var(--s) * 0.06);
  height: calc(var(--s) * 0.06);
  background: radial-gradient(circle at 40% 40%, #fff2b8, #ffbf3e 55%, rgba(255, 120, 0, 0.7) 100%);
  border-radius: 50%;
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(255, 210, 140, 0.95));
}
.s1 { left: 30%; animation: spark-rise 1.8s ease-in infinite 0.1s; }
.s2 { left: 50%; animation: spark-rise 1.6s ease-in infinite 0.5s; }
.s3 { left: 70%; animation: spark-rise 2.0s ease-in infinite 0.3s; }
.s4 { left: 40%; animation: spark-rise 1.5s ease-in infinite 0.2s; }
.s5 { left: 60%; animation: spark-rise 1.7s ease-in infinite 0.4s; }

@keyframes spark-rise {
  0% { transform: translate(-50%, 0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  60% { opacity: 0.9; }
  100% { transform: translate(-50%, -160%) scale(0.65); opacity: 0; }
}

/* Subtle ember sparkles near the top of the flame */
.embers { position: absolute; inset: 0; pointer-events: none; }
.ember {
  position: absolute;
  bottom: calc(var(--s) * 0.50);
  width: calc(var(--s) * 0.045);
  height: calc(var(--s) * 0.045);
  background: radial-gradient(circle at 40% 40%, #fff8d6, #ffd98d 55%, rgba(255, 150, 0, 0.85) 80%, rgba(255, 90, 0, 0) 100%);
  border-radius: 50%;
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(255, 220, 140, 0.95));
}

.e1 { left: 38%; --dx: -12%; animation: ember-float 1.6s ease-out infinite 0.0s, ember-twinkle 0.8s ease-in-out infinite 0.0s; }
.e2 { left: 46%; --dx: 6%;   animation: ember-float 1.8s ease-out infinite 0.2s,  ember-twinkle 1s ease-in-out infinite 0.1s; }
.e3 { left: 54%; --dx: -6%;  animation: ember-float 1.7s ease-out infinite 0.35s, ember-twinkle 0.9s ease-in-out infinite 0.0s; }
.e4 { left: 62%; --dx: 10%;  animation: ember-float 2.0s ease-out infinite 0.5s,  ember-twinkle 1.05s ease-in-out infinite 0.2s; }
.e5 { left: 50%; --dx: -4%;  animation: ember-float 1.9s ease-out infinite 0.65s, ember-twinkle 0.95s ease-in-out infinite 0.15s; }
.e6 { left: 34%; --dx: -8%;  animation: ember-float 1.5s ease-out infinite 0.25s, ember-twinkle 0.85s ease-in-out infinite 0.1s; }
.e7 { left: 42%; --dx: 12%;  animation: ember-float 2.1s ease-out infinite 0.4s,  ember-twinkle 1.1s ease-in-out infinite 0.25s; }
.e8 { left: 58%; --dx: -10%; animation: ember-float 1.6s ease-out infinite 0.55s, ember-twinkle 0.9s ease-in-out infinite 0.05s; }
.e9 { left: 66%; --dx: 8%;   animation: ember-float 1.7s ease-out infinite 0.7s,  ember-twinkle 0.95s ease-in-out infinite 0.2s; }
.e10{ left: 48%; --dx: 5%;   animation: ember-float 2.2s ease-out infinite 0.85s, ember-twinkle 1.0s ease-in-out infinite 0.15s; }

@keyframes ember-float {
  0%   { transform: translate(-50%, 0) scale(1);   opacity: 0; }
  10%  { opacity: 1; }
  60%  { opacity: 0.95; }
  100% { transform: translate(calc(-50% + var(--dx)), -150%) scale(0.65); opacity: 0; }
}

@keyframes ember-twinkle {
  0%   { filter: drop-shadow(0 0 4px rgba(255, 230, 160, 0.75)); transform: translateZ(0) scale(1); }
  50%  { filter: drop-shadow(0 0 8px rgba(255, 250, 200, 1));     transform: translateZ(0) scale(1.12); }
  100% { filter: drop-shadow(0 0 5px rgba(255, 225, 150, 0.85)); transform: translateZ(0) scale(0.96); }
}
</style>
