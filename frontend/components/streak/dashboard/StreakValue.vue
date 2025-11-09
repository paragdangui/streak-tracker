<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import FireAnimation from '~/assets/Fire.lottie';

const props = defineProps<{
  streak: number;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <div class="flex items-center justify-center gap-3">
      <ClientOnly>
        <DotLottieVue
          v-if="props.streak > 0"
          style="height: 80px; width: 80px"
          autoplay
          loop
          :src="FireAnimation"
        />
      </ClientOnly>
      <h1 class="text-6xl font-bold">{{ props.streak }}</h1>
    </div>
    <p class="text-xl opacity-85">Current Streak</p>
  </div>
</template>
