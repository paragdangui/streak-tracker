<template>
	<div
		class="bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto"
	>
		<!-- Header with navigation -->
		<div class="flex justify-between items-center mb-6">
			<button
				v-if="!isYearView"
				@click="previousMonth"
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
				:class="{ 'text-gray-400 cursor-not-allowed': !canGoToPreviousMonth }"
				:disabled="!canGoToPreviousMonth"
			>
				‹
			</button>
			<button
				v-if="isYearView"
				@click="previousYear"
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
				:class="{ 'text-gray-400 cursor-not-allowed': !canGoToPreviousYear }"
				:disabled="!canGoToPreviousYear"
			>
				‹
			</button>

			<div class="text-center">
				<h2 class="text-xl font-bold text-gray-800">{{ headerTitle }}</h2>
				<p class="text-sm text-gray-600 mt-1">
					{{ headerSubtitle }}
				</p>
			</div>

			<button
				v-if="!isYearView"
				@click="nextMonth"
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
				:class="{ 'text-gray-400 cursor-not-allowed': !canGoToNextMonth }"
				:disabled="!canGoToNextMonth"
			>
				›
			</button>
			<button
				v-if="isYearView"
				@click="nextYear"
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
				:class="{ 'text-gray-400 cursor-not-allowed': !canGoToNextYear }"
				:disabled="!canGoToNextYear"
			>
				›
			</button>
		</div>

		<!-- View toggle button -->
		<div class="flex justify-center mb-4">
			<button
				@click="toggleView"
				class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
			>
				{{ isYearView ? 'Month View' : 'Year View' }}
			</button>
		</div>

		<!-- Month View -->
		<div v-if="!isYearView">
			<!-- Weekday headers -->
			<div class="grid grid-cols-7 gap-1 mb-2">
				<div
					v-for="day in weekdays"
					:key="day"
					class="text-center text-sm font-semibold text-gray-600 py-2"
				>
					{{ day }}
				</div>
			</div>

			<!-- Calendar grid -->
			<div class="grid grid-cols-7 gap-1">
				<!-- Empty cells for days before month starts -->
				<div
					v-for="blank in blankDays"
					:key="'blank-' + blank"
					class="h-10"
				></div>

				<!-- Days of the month -->
				<div
					v-for="day in daysInMonth"
					:key="day"
					class="relative h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
					:class="[getDayClasses(day), { 'animate-pulse': isToday(day) }]"
					@click="onDayClick(day)"
					:title="getDayTooltip(day)"
				>
					<span class="relative rounded-md z-10">{{ day }}</span>

					<!-- Streak segment background: creates a continuous pill across consecutive days in a week -->
					<div
						v-if="isCompleted(day)"
						class="absolute"
						:class="getDayCompletionIndicator(day)"
					></div>

					<!-- Today indicator ring -->
					<div
						v-if="isToday(day)"
						class="absolute top-1 bottom-1 left-0 right-0 rounded-full border-4 z-20"
						:class="isCompleted(day) ? 'border-blue-300' : 'border-blue-500'"
					></div>
				</div>
			</div>
		</div>

		<!-- Year View -->
		<div v-else class="grid grid-cols-3 gap-4">
			<div
				v-for="monthIndex in 12"
				:key="monthIndex"
				class="text-center"
				@click="selectMonth(monthIndex - 1)"
			>
				<!-- Month name -->
				<h3 class="text-xs font-semibold text-gray-800 mb-2">
					{{ getMonthName(monthIndex - 1) }}
				</h3>

				<!-- Mini calendar grid -->
				<div class="grid grid-cols-7 gap-px text-xs">
					<!-- Weekday headers (abbreviated) -->
					<div
						v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
						:key="day"
						class="text-gray-500 text-center h-4 flex items-center justify-center"
					>
						{{ day }}
					</div>

					<!-- Empty cells for days before month starts -->
					<div
						v-for="blank in getBlankDaysForMonth(monthIndex - 1)"
						:key="'blank-' + blank"
						class="h-4"
					></div>

					<!-- Days of the month -->
					<div
						v-for="day in getDaysInMonthForYear(monthIndex - 1)"
						:key="day"
						class="relative h-4 flex items-center justify-center rounded-sm text-xs transition-all duration-200 cursor-pointer"
						:class="getYearDayClasses(monthIndex - 1, day)"
						:title="getYearDayTooltip(monthIndex - 1, day)"
					>
						<span class="relative z-10">{{ day }}</span>

						<!-- Streak indicator for year view -->
						<div
							v-if="isCompletedInYear(monthIndex - 1, day)"
							class="absolute top-0 bottom-0 left-0 right-0 bg-orange-500 rounded-sm z-0"
						></div>

						<!-- Today indicator for year view -->
						<div
							v-if="isTodayInYear(monthIndex - 1, day)"
							class="absolute top-0 bottom-0 left-0 right-0 rounded-sm border border-blue-500 z-20"
						></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Legend -->
		<div class="mt-6 flex justify-center gap-4 text-xs text-gray-600">
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded-full bg-orange-500"></div>
				<span>Streak</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded-full border-2 border-blue-500"></div>
				<span>Today</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';
	import { useStreaksStore } from '~/stores/streaks';

	const streaksStore = useStreaksStore();
	const currentDate = ref(new Date());
	const simulatedToday = ref<Date | null>(null);
	const isYearView = ref(false);

	const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	// Get current date (real or simulated)
	const getCurrentDate = () => {
		if (simulatedToday.value) {
			const d = new Date(simulatedToday.value);
			d.setHours(0, 0, 0, 0);
			return d;
		}
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	};

	// Fetch simulated date from dev tools
	const fetchCurrentDate = async () => {
		try {
			const res = await fetch('/api/dev-tools/current-date');
			if (!res.ok) return;
			const data = await res.json();
			const date = new Date(data.currentDate);
			simulatedToday.value = date;
		} catch (e) {
			// Fallback to real current date if dev-tools endpoint unavailable
			const date = new Date();
			simulatedToday.value = date;
		}
	};

	const monthYear = computed(() => {
		return currentDate.value.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
		});
	});

	const headerTitle = computed(() => {
		if (isYearView.value) {
			return currentDate.value.getFullYear().toString();
		}
		return monthYear.value;
	});

	const headerSubtitle = computed(() => {
		if (isYearView.value) {
			const year = currentDate.value.getFullYear();
			const totalDaysInYear = streaksStore.streaks.filter((streak) => {
				const streakDate = new Date(streak.completion_date);
				return streakDate.getFullYear() === year;
			}).length;
			return `${totalDaysInYear} days completed`;
		}
		return `${completedDaysInMonth.value} days completed`;
	});

	const daysInMonth = computed(() => {
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		return new Date(year, month + 1, 0).getDate();
	});

	const blankDays = computed(() => {
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		// Convert Sunday (0) to be day 6, and Monday (1) to be day 0
		return firstDay === 0 ? 6 : firstDay - 1;
	});

	// New computed property for completed days in current month
	const completedDaysInMonth = computed(() => {
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const startOfMonth = new Date(year, month, 1);
		const endOfMonth = new Date(year, month + 1, 0);

		return streaksStore.streaks.filter((streak) => {
			const streakDate = new Date(streak.completion_date);
			return streakDate >= startOfMonth && streakDate <= endOfMonth;
		}).length;
	});

	// Navigation constraints
	const canGoToPreviousMonth = computed(() => {
		if (streaksStore.streaks.length === 0) return false;

		const firstStreak = streaksStore.streaks[0];
		if (!firstStreak) return false;

		const earliestStreak = new Date(firstStreak.completion_date);
		const previousMonth = new Date(
			currentDate.value.getFullYear(),
			currentDate.value.getMonth() - 1,
			1,
		);

		return (
			previousMonth >=
			new Date(earliestStreak.getFullYear(), earliestStreak.getMonth(), 1)
		);
	});

	const canGoToNextMonth = computed(() => {
		const today = getCurrentDate();
		const nextMonth = new Date(
			currentDate.value.getFullYear(),
			currentDate.value.getMonth() + 1,
			1,
		);

		return nextMonth <= new Date(today.getFullYear(), today.getMonth(), 1);
	});

	// Year navigation constraints
	const canGoToPreviousYear = computed(() => {
		if (streaksStore.streaks.length === 0) return false;

		const firstStreak = streaksStore.streaks[0];
		if (!firstStreak) return false;

		const earliestStreak = new Date(firstStreak.completion_date);
		const previousYear = currentDate.value.getFullYear() - 1;

		return previousYear >= earliestStreak.getFullYear();
	});

	const canGoToNextYear = computed(() => {
		const today = getCurrentDate();
		const nextYear = currentDate.value.getFullYear() + 1;

		return nextYear <= today.getFullYear();
	});

	const isCompleted = (day: number) => {
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const date = new Date(year, month, day);

		return streaksStore.streaks.some((streak) => {
			const streakDate = new Date(streak.completion_date);
			return (
				streakDate.getFullYear() === date.getFullYear() &&
				streakDate.getMonth() === date.getMonth() &&
				streakDate.getDate() === date.getDate()
			);
		});
	};

	const isToday = (day: number) => {
		// Get today's date (might be simulated)
		const today = getCurrentDate();
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		return (
			today.getFullYear() === year &&
			today.getMonth() === month &&
			today.getDate() === day
		);
	};

	// Check if day is part of current streak
	const isPartOfCurrentStreak = (day: number) => {
		if (!isCompleted(day) || streaksStore.currentStreak === 0) return false;

		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const date = new Date(year, month, day);
		date.setHours(0, 0, 0, 0);

		// Get today's date (simulated)
		const today = getCurrentDate();

		// Calculate streak start date
		const streakStartDate = new Date(today);
		streakStartDate.setDate(
			streakStartDate.getDate() - streaksStore.currentStreak + 1,
		);

		return date >= streakStartDate && date <= today && isCompleted(day);
	};

	const getDayClasses = (day: number) => {
		const classes = [];

		if (isCompleted(day)) {
			classes.push('text-white font-semibold');
			if (isPartOfCurrentStreak(day)) {
				classes.push('hover:scale-105');
			}
		} else {
			classes.push('text-gray-700 hover:bg-gray-100');
			if (isToday(day)) {
				classes.push('font-semibold');
			}
		}

		return classes.join(' ');
	};

	const getDayCompletionIndicator = (day: number) => {
		// Build classes that create a continuous horizontal pill across
		// consecutive completed days within the same week row.
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const date = new Date(year, month, day);

		const dayOfWeek = date.getDay();
		const isMonday = dayOfWeek === 1;
		const isSunday = dayOfWeek === 0;
		const prevCompleted = !isMonday && isCompleted(day - 1);
		const nextCompleted = !isSunday && isCompleted(day + 1);

		// Slight vertical inset to resemble the screenshot padding
		const classes: string[] = ['bg-orange-500', 'top-1', 'bottom-1', 'z-0'];

		// Slightly overhang into adjacent cells when connected to hide grid gaps
		classes.push(prevCompleted ? '-left-1' : 'left-0');
		classes.push(nextCompleted ? '-right-1' : 'right-0');

		if (!prevCompleted) classes.push('rounded-l-full');
		if (!nextCompleted) classes.push('rounded-r-full');

		return classes.join(' ');
	};

	const getDayTooltip = (day: number) => {
		const year = currentDate.value.getFullYear();
		const month = currentDate.value.getMonth();
		const date = new Date(year, month, day);

		const dateStr = date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		if (isToday(day)) {
			return `Today - ${dateStr}`;
		} else if (isCompleted(day)) {
			if (isPartOfCurrentStreak(day)) {
				return `Streak day - ${dateStr}`;
			}
			return `Completed - ${dateStr}`;
		} else {
			return dateStr;
		}
	};

	const onDayClick = (day: number) => {
		if (isToday(day)) {
			if (isCompleted(day)) {
				streaksStore.undoToday();
			} else {
				streaksStore.markToday();
			}
		}
	};

	// Year view helper functions
	const getMonthName = (monthIndex: number) => {
		const date = new Date(currentDate.value.getFullYear(), monthIndex, 1);
		return date.toLocaleDateString('en-US', { month: 'short' });
	};

	const getDaysInMonthForYear = (monthIndex: number) => {
		const year = currentDate.value.getFullYear();
		return new Date(year, monthIndex + 1, 0).getDate();
	};

	const getBlankDaysForMonth = (monthIndex: number) => {
		const year = currentDate.value.getFullYear();
		const firstDay = new Date(year, monthIndex, 1).getDay();
		return firstDay === 0 ? 6 : firstDay - 1;
	};

	const isCompletedInYear = (monthIndex: number, day: number) => {
		const year = currentDate.value.getFullYear();
		const date = new Date(year, monthIndex, day);

		return streaksStore.streaks.some((streak) => {
			const streakDate = new Date(streak.completion_date);
			return (
				streakDate.getFullYear() === date.getFullYear() &&
				streakDate.getMonth() === date.getMonth() &&
				streakDate.getDate() === date.getDate()
			);
		});
	};

	const isTodayInYear = (monthIndex: number, day: number) => {
		const today = getCurrentDate();
		const year = currentDate.value.getFullYear();
		return (
			today.getFullYear() === year &&
			today.getMonth() === monthIndex &&
			today.getDate() === day
		);
	};

	const getYearDayClasses = (monthIndex: number, day: number) => {
		const classes = [];

		if (isCompletedInYear(monthIndex, day)) {
			classes.push('text-white font-semibold');
		} else {
			classes.push('text-gray-600 hover:bg-gray-100');
			if (isTodayInYear(monthIndex, day)) {
				classes.push('font-semibold');
			}
		}

		return classes.join(' ');
	};

	const getYearDayTooltip = (monthIndex: number, day: number) => {
		const year = currentDate.value.getFullYear();
		const date = new Date(year, monthIndex, day);

		const dateStr = date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		if (isTodayInYear(monthIndex, day)) {
			return `Today - ${dateStr}`;
		} else if (isCompletedInYear(monthIndex, day)) {
			return `Completed - ${dateStr}`;
		} else {
			return dateStr;
		}
	};

	const toggleView = () => {
		isYearView.value = !isYearView.value;
	};

	const selectMonth = (monthIndex: number) => {
		currentDate.value = new Date(
			currentDate.value.getFullYear(),
			monthIndex,
			1,
		);
		isYearView.value = false;
	};

	const previousMonth = () => {
		if (canGoToPreviousMonth.value) {
			currentDate.value = new Date(
				currentDate.value.getFullYear(),
				currentDate.value.getMonth() - 1,
				1,
			);
		}
	};

	const nextMonth = () => {
		if (canGoToNextMonth.value) {
			currentDate.value = new Date(
				currentDate.value.getFullYear(),
				currentDate.value.getMonth() + 1,
				1,
			);
		}
	};

	const previousYear = () => {
		if (canGoToPreviousYear.value) {
			currentDate.value = new Date(
				currentDate.value.getFullYear() - 1,
				currentDate.value.getMonth(),
				1,
			);
		}
	};

	const nextYear = () => {
		if (canGoToNextYear.value) {
			currentDate.value = new Date(
				currentDate.value.getFullYear() + 1,
				currentDate.value.getMonth(),
				1,
			);
		}
	};

	// Initialize component
	onMounted(async () => {
		await fetchCurrentDate();
	});
</script>
