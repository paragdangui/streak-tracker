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
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
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
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
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
        
        <!-- Completion indicator background -->
        <div 
          v-if="isCompleted(day)" 
          class="absolute inset-0 rounded-full"
          :class="getDayCompletionIndicator(day)"
        ></div>
        
        <!-- Completion checkmark -->
        <div 
          v-if="isCompleted(day)" 
          class="absolute inset-0 rounded-full flex items-center justify-center z-10"
        >
          <svg class="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>

        <!-- Today indicator ring -->
        <div 
          v-if="isToday(day)" 
          class="absolute inset-0 rounded-full border-2"
          :class="isCompleted(day) ? 'border-blue-300' : 'border-blue-500'"
        ></div>

        <!-- Streak flame indicator for active streaks -->
        <div 
          v-if="isPartOfCurrentStreak(day) && !isToday(day)" 
          class="absolute -top-1 -right-1 text-orange-500"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-6 flex justify-center gap-3 text-xs text-gray-600">
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
        <span>Streak</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Completed</span>
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
  if (isPartOfCurrentStreak(day)) {
    return 'bg-orange-500 shadow-lg'; // Orange for streak days
  }
  return 'bg-green-500 shadow-lg'; // Green for old completed days
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
