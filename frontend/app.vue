<template>
  <div class="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col items-center justify-center text-white font-sans">
    <div class="text-center">
      <h1 class="text-6xl font-bold mb-4">{{ streaksStore.currentStreak }}</h1>
      <p class="text-xl mb-8">Current Streak</p>
      <button @click="streaksStore.markToday()" class="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300">
        Mark Today as Completed
      </button>
    </div>
    <div class="mt-16">
      <StreakCalendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStreaksStore } from '~/stores/streaks';

const streaksStore = useStreaksStore();

onMounted(() => {
  streaksStore.fetchStreaks();
});
</script>

<style>
/* You can add global styles here if needed */
</style>
