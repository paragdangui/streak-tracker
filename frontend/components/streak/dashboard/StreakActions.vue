<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import FireAnimation from '~/assets/Fire.lottie';

const props = defineProps<{
  isTodayMarked: boolean;
}>();

const emit = defineEmits<{
  (e: 'mark-today'): void;
  (e: 'undo-today'): void;
}>();
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <button
      v-if="!props.isTodayMarked"
      @click="emit('mark-today')"
      class="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300 flex items-center gap-2"
      title="Add to your streak today"
    >
      Add To Your Streak Today
      <ClientOnly>
        <DotLottieVue
          style="height: 24px; width: 24px"
          autoplay
          loop
          :src="FireAnimation"
        />
      </ClientOnly>
    </button>

    <button
      v-else
      @click="emit('undo-today')"
      class="border border-white/80 text-white font-semibold py-2.5 px-5 rounded-full shadow transition duration-200 hover:bg-white/10 active:bg-white/20"
      title="Undo marking today as completed"
    >
      Undo Today
    </button>
  </div>
</template>
