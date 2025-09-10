<template>
	<div
		class="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col items-center justify-center text-white font-sans"
	>
		<div class="text-center">
			<p class="text-xl opacity-90 mb-2" v-if="currentDateFormatted">
				{{ currentDateFormatted }}
			</p>
			<div class="flex items-center justify-center gap-3 mb-4">
				<FlameIcon
					v-if="streaksStore.currentStreak > 0"
					:size="64"
					:title="`Streak on fire: ${streaksStore.currentStreak}`"
				/>
				<h1 class="text-6xl font-bold">{{ streaksStore.currentStreak }}</h1>
			</div>
			<p class="text-xl mb-8">Current Streak</p>
			<button
				@click="streaksStore.markToday()"
				class="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300"
			>
				Mark Today as Completed
			</button>
		</div>
		<div class="mt-16">
			<StreakCalendar />
		</div>
	</div>
	<DevTools />
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useStreaksStore } from '~/stores/streaks';
	import DevTools from '~/components/DevTools.vue';
    import FlameIcon from '~/components/FlameIcon.vue';

	const streaksStore = useStreaksStore();
	const currentDateFormatted = ref('');

	async function fetchCurrentDate() {
		try {
			const res = await fetch('/api/dev-tools/current-date');
			if (!res.ok) return;
			const data = await res.json();
			const date = new Date(data.currentDate);
			currentDateFormatted.value = date.toLocaleDateString(undefined, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch (e) {
			// ignore
		}
	}

	onMounted(() => {
		streaksStore.fetchStreaks();
		fetchCurrentDate();
	});
</script>

<style>
	/* You can add global styles here if needed */
</style>
