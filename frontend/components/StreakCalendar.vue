<template>
  <div class="bg-white text-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
    <div class="flex justify-between items-center mb-4">
      <button @click="previousMonth" class="text-gray-600 hover:text-gray-800">&lt;</button>
      <h2 class="text-lg font-bold">{{ monthYear }}</h2>
      <button @click="nextMonth" class="text-gray-600 hover:text-gray-800">&gt;</button>
    </div>
    <div class="grid grid-cols-7 gap-2 text-center">
      <div v-for="day in weekdays" :key="day" class="font-bold text-sm">{{ day }}</div>
      <div v-for="blank in blankDays" :key="'blank-' + blank"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="p-2 rounded-full cursor-pointer"
        :class="{
          'bg-purple-500 text-white': isCompleted(day),
          'bg-gray-200': !isCompleted(day) && isToday(day),
        }"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStreaksStore } from '~/stores/streaks';

const streaksStore = useStreaksStore();
const currentDate = ref(new Date());

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const isCompleted = (day: number) => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return streaksStore.streaks.some(
    (streak) => new Date(streak.completion_date).getTime() === date.getTime()
  );
};

const isToday = (day: number) => {
  const today = new Date();
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};
</script>
