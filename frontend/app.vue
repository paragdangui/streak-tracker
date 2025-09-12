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
      <div class="flex items-center justify-center gap-3">
        <button
          v-if="!isTodayMarked"
          @click="streaksStore.markToday()"
          class="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300"
          title="Mark today as completed"
        >
          Mark Today as Completed
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
		</div>
		<div class="mt-16">
			<StreakCalendar />
		</div>
	</div>
	<DevTools />
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
	import { useStreaksStore } from '~/stores/streaks';
	import DevTools from '~/components/DevTools.vue';
    import FlameIcon from '~/components/FlameIcon.vue';

	const streaksStore = useStreaksStore();
  const currentDateFormatted = ref('');
  const simulatedToday = ref<Date | null>(null);
  const todayDate = computed(() => {
    const d = simulatedToday.value ? new Date(simulatedToday.value) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const toYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const isTodayMarked = computed(() => {
    const t = todayDate.value;
    const todayKey = toYMD(t);
    return streaksStore.streaks.some((s) => {
      const d = new Date(s.completion_date);
      return toYMD(d) === todayKey;
    });
  });

  async function fetchCurrentDate() {
      try {
        const res = await fetch('/api/dev-tools/current-date');
        if (!res.ok) return;
    const data = await res.json();
    const date = new Date(data.currentDate);
    simulatedToday.value = date;
    currentDateFormatted.value = date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    // Fallback to real current date if dev-tools endpoint unavailable
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    simulatedToday.value = date;
    currentDateFormatted.value = date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
