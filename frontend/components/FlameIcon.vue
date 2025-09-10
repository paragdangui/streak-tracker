<template>
  <img
    v-if="src"
    :src="src"
    :alt="title || 'Flame'"
    class="flame"
    :style="{ width: `${size || 64}px`, height: `${size || 64}px` }"
  />
  <span
    v-else
    class="flame"
    role="img"
    aria-label="Flame"
    :style="{ fontSize: `${size || 64}px` }"
    :title="title || 'Streak on fire!'"
  >
    🔥
  </span>
  <!-- Defaults to an animated emoji to avoid external assets,
       but you can pass a GIF/PNG via the `src` prop. -->
</template>

<script setup lang="ts">
defineProps<{
  size?: number
  title?: string
  src?: string
}>()
</script>

<style scoped>
.flame {
  display: inline-block;
  line-height: 1;
  animation: flame-flicker 1.2s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.75))
          drop-shadow(0 0 16px rgba(255, 69, 0, 0.5));
  will-change: transform, filter;
}

@keyframes flame-flicker {
  0%   { transform: translateY(0) scale(1);       filter: drop-shadow(0 0 6px rgba(255, 140, 0, 0.7)) drop-shadow(0 0 12px rgba(255, 69, 0, 0.4)); }
  35%  { transform: translateY(-1px) scale(1.03);  filter: drop-shadow(0 0 10px rgba(255, 160, 0, 0.8)) drop-shadow(0 0 18px rgba(255, 69, 0, 0.55)); }
  70%  { transform: translateY(0) scale(0.985);    filter: drop-shadow(0 0 7px rgba(255, 140, 0, 0.7)) drop-shadow(0 0 14px rgba(255, 69, 0, 0.45)); }
  100% { transform: translateY(-0.5px) scale(1.01); filter: drop-shadow(0 0 9px rgba(255, 150, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 69, 0, 0.6)); }
}
</style>
