<template>
  <div class="bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
    <!-- Header with month navigation -->
    <div class="flex justify-between items-center mb-6">
      <button 
        @click="previousMonth" 
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        :class="{'text-gray-400 cursor-not-allowed': !canGoToPreviousMonth}"
        :disabled="!canGoToPreviousMonth"
      >
        <ChevronLeft />
      </button>
      
      <div class="text-center">
        <h2 class="text-xl font-bold text-gray-800">{{ monthYear }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ completedDaysInMonth }} days completed</p>
      </div>
      
      <button 
        @click="nextMonth" 
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        :class="{'text-gray-400 cursor-not-allowed': !canGoToNextMonth}"
        :disabled="!canGoToNextMonth"
      >
        <ChevronRight />
      </button>
    </div>

    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekdays" :key="day" class="text-center text-sm font-semibold text-gray-600 py-2">
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-1">
      <!-- Empty cells for days before month starts -->
      <div v-for="blank in blankDays" :key="'blank-' + blank" class="h-10"></div>
      
      <!-- Days of the month -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="relative h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
        :class="getDayClasses(day)"
        @click="onDayClick(day)"
        :title="getDayTooltip(day)"
      >
        <span class="relative z-10">{{ day }}</span>
        
        <!-- Streak segment background: creates a continuous pill across consecutive days in a week -->
        <div 
          v-if="isCompleted(day)" 
          class="absolute"
          :class="getDayCompletionIndicator(day)"
        ></div>
        
        <!-- No checkmark; number sits on the orange streak bar -->

        <!-- Today indicator ring -->
        <div 
          v-if="isToday(day)" 
          class="absolute inset-0 rounded-full border-2 z-20"
          :class="isCompleted(day) ? 'border-blue-300' : 'border-blue-500'"
        ></div>

        
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

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

const blankDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month, 1).getDay();
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
    1
  );
  
  return previousMonth >= new Date(earliestStreak.getFullYear(), earliestStreak.getMonth(), 1);
});

const canGoToNextMonth = computed(() => {
  const today = getCurrentDate();
  const nextMonth = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
  
  return nextMonth <= new Date(today.getFullYear(), today.getMonth(), 1);
});

const isCompleted = (day: number) => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const date = new Date(year, month, day);
  
  return streaksStore.streaks.some(streak => {
    const streakDate = new Date(streak.completion_date);
    return streakDate.getFullYear() === date.getFullYear() &&
           streakDate.getMonth() === date.getMonth() &&
           streakDate.getDate() === date.getDate();
  });
};

const isToday = (day: number) => {
  // Get today's date (might be simulated)
  const today = getCurrentDate();
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
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
  streakStartDate.setDate(streakStartDate.getDate() - streaksStore.currentStreak + 1);
  
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

  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;
  const prevCompleted = !isSunday && isCompleted(day - 1);
  const nextCompleted = !isSaturday && isCompleted(day + 1);

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

const previousMonth = () => {
  if (canGoToPreviousMonth.value) {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
  }
};

const nextMonth = () => {
  if (canGoToNextMonth.value) {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    );
  }
};

// Initialize component
onMounted(() => {
  fetchCurrentDate();
});
</script>
