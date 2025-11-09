<script setup lang="ts">
import { onMounted } from 'vue';
import DevTools from '~/components/DevTools.vue';
import StreakDashboard from '~/components/streak/dashboard/StreakDashboard.vue';
import { useStreaksStore } from '~/stores/streaks';

const streaksStore = useStreaksStore();

onMounted(async () => {
  await streaksStore.fetchStreaks();
  await streaksStore.fetchCurrentDate();
});
</script>

<template>
  <StreakDashboard />
  <DevTools />
</template>

<style>
	.animated-gradient {
		background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #6366f1);
		background-size: 400% 400%;
		animation: gradientShift 15s ease infinite;
	}

	@keyframes gradientShift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
