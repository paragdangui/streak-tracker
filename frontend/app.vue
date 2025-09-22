<script setup lang="ts">
	import { useStreaksStore } from '~/stores/streaks';
	import DevTools from '~/components/DevTools.vue';
	import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
	import FireAnimation from '~/assets/Fire.lottie';
	import { onMounted } from 'vue';

	const streaksStore = useStreaksStore();

	// Move data fetching to client-side only
	onMounted(async () => {
		await streaksStore.fetchStreaks();
		await streaksStore.fetchCurrentDate();
	});
</script>

<template>
	<div
		class="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col items-center justify-center text-white font-sans"
	>
		<div class="text-center">
			<ClientOnly>
				<h1
					v-if="streaksStore.isSimulated"
					class="text-3xl font-bold mb-4 text-yellow-300"
				>
					SIMULATION MODE
				</h1>
				<p
					class="text-xl opacity-90 mb-2"
					v-if="streaksStore.currentDateFormatted"
				>
					{{ streaksStore.currentDateFormatted }}
				</p>
			</ClientOnly>
			<div class="flex items-center justify-center gap-3 mb-4">
				<ClientOnly>
					<DotLottieVue
						v-if="streaksStore.currentStreak > 0"
						style="height: 80px; width: 80px"
						autoplay
						loop
						:src="FireAnimation"
					/>
				</ClientOnly>
				<h1 class="text-6xl font-bold">{{ streaksStore.currentStreak }}</h1>
			</div>
			<p class="text-xl mb-8">Current Streak</p>
			<ClientOnly>
				<div class="flex items-center justify-center gap-3">
					<button
						v-if="!streaksStore.isTodayMarked"
						@click="streaksStore.markToday()"
						class="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300 flex items-center gap-2"
						title="Add to your streak today"
					>
						Add To Your Streak Today
						<DotLottieVue
							style="height: 24px; width: 24px"
							autoplay
							loop
							:src="FireAnimation"
						/>
					</button>
					<button
						v-else
						@click="streaksStore.undoToday()"
						class="border border-white/80 text-white font-semibold py-2.5 px-5 rounded-full shadow transition duration-200 hover:bg-white/10 active:bg-white/20"
						title="Undo marking today as completed"
					>
						Undo Today
					</button>
				</div>
			</ClientOnly>
		</div>
		<div class="mt-16">
			<ClientOnly>
				<StreakCalendar />
			</ClientOnly>
		</div>
	</div>
	<DevTools />
</template>

<style>
	/* You can add global styles here if needed */
</style>
